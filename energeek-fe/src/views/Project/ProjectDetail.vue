<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProjectStore } from '../../stores/project';
import type { Project, Task } from '../../types';
import TaskFormModal from '../../components/TaskFormModal.vue';
import ProjectFormModal from '../../components/ProjectFormModal.vue';
import Loader from '../../components/Loader.vue';
import BaseButton from '../../components/BaseButton.vue';

const projectStore = useProjectStore();
const route = useRoute();
const router = useRouter();

const projectSlug = ref<string | null>(null);
const currentProjectToEdit = ref<Project | null>(null);

const getDueDateInfo = (dateString: string) => {
  if (!dateString) return { text: 'No due date', colorClass: 'text-gray-500' };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dueDate = new Date(dateString);
  dueDate.setHours(0, 0, 0, 0);
  
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return {
      text: `${Math.abs(diffDays)} days ago`,
      colorClass: 'text-red-500'
    };
  } else if (diffDays === 0) {
    return {
      text: 'Today',
      colorClass: 'text-red-500'
    };
  } else if (diffDays === 1) {
    return {
      text: 'Tomorrow',
      colorClass: 'text-yellow-500'
    };
  } else {
    // Format to "DD Mon"
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return {
      text: date.toLocaleDateString('en-GB', options),
      colorClass: 'text-blue-500'
    };
  }
};

const doneTasksCount = computed(() => {
  if (!projectStore.currentProject?.tasks) return 0;
  const doneCategory = projectStore.categories.find(cat => cat.name === 'Done');
  if (!doneCategory) return 0;
  return projectStore.currentProject.tasks.filter(task => task.category_id === doneCategory.id && !task.deleted_at).length;
});

const totalTasksCount = computed(() => projectStore.currentProject?.tasks?.length || 0);

onMounted(() => {
  projectSlug.value = route.params.slug as string;
  if (projectSlug.value) {
    projectStore.fetchProject(projectSlug.value);
    projectStore.fetchCategories();
  }
});

watch(() => route.params.slug, (newSlug) => {
  projectSlug.value = newSlug as string;
  if (projectSlug.value) projectStore.fetchProject(projectSlug.value);
});

// Task modal
const isTaskModalOpen = ref(false);
const editingTask = ref<Task | null>(null);

const openCreateTaskModal = () => { editingTask.value = null; isTaskModalOpen.value = true; };
const openEditTaskModal = (task: Task) => { editingTask.value = { ...task }; isTaskModalOpen.value = true; };

const saveTask = async (taskData: Partial<Task>) => {
  if (!projectStore.currentProject?.id) return;
  try {
    if (editingTask.value) {
      await projectStore.updateTask(editingTask.value.id, taskData);
    } else {
      // project_id is already included in taskData from the modal
      await projectStore.createTask(taskData.project_id as number, taskData as any);
    }
    isTaskModalOpen.value = false;
    // No need to refetch - store already updated currentProject.tasks
  } catch (error) {
    throw error;
  }
};

const deleteTask = async (taskId: number) => {
  if (!confirm('Are you sure you want to delete this task?')) return;
  try {
    await projectStore.deleteTask(taskId);
    // No need to refetch - store already updated currentProject.tasks
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};

// Project modal
const isProjectModalOpen = ref(false);
const openEditProjectModal = () => {
  currentProjectToEdit.value = projectStore.currentProject;
  isProjectModalOpen.value = true;
};

const handleUpdateProject = async (projectData: Partial<Project>) => {
  if (!projectSlug.value) return;
  try {
    await projectStore.updateProject(projectSlug.value, projectData);
    isProjectModalOpen.value = false;
  } catch (error) {
    throw error;
  }
};

// Drag and drop
const dragOverCategoryId = ref<number | null>(null);

const onDragStart = (event: DragEvent, task: Task) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', task.id.toString());
    event.dataTransfer.effectAllowed = 'move';
  }
};

const onDrop = async (event: DragEvent, targetCategoryId: number) => {
  event.preventDefault();
  dragOverCategoryId.value = null;
  const taskId = Number(event.dataTransfer?.getData('text/plain'));
  if (isNaN(taskId)) return;
  const taskToMove = projectStore.currentProject?.tasks?.find(t => t.id === taskId);
  if (taskToMove && taskToMove.category_id !== targetCategoryId) {
    // Optimistically update UI first for seamless experience
    if (projectStore.currentProject?.tasks) {
      const index = projectStore.currentProject.tasks.findIndex(t => t.id === taskId);
      if (index !== -1) {
        projectStore.currentProject.tasks[index] = {
          ...projectStore.currentProject.tasks[index],
          category_id: targetCategoryId,
        } as Task;
      }
    }

    try {
      // Update on server without showing loader (skipLoading = true)
      await projectStore.updateTask(taskId, { category_id: targetCategoryId }, true);
    } catch (error) {
      console.error('Error moving task:', error);
      // Revert optimistic update on error
      if (projectStore.currentProject?.tasks) {
        const index = projectStore.currentProject.tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
          projectStore.currentProject.tasks[index] = {
            ...projectStore.currentProject.tasks[index],
            category_id: taskToMove.category_id,
          } as Task;
        }
      }
    }
  }
};

const onDragOver = (event: DragEvent, categoryId: number) => {
  event.preventDefault();
  dragOverCategoryId.value = categoryId;
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
};

const onDragLeave = () => { dragOverCategoryId.value = null; };

const tasksByCategory = (categoryId: number) =>
  projectStore.currentProject?.tasks?.filter(t => t.category_id === categoryId && !t.deleted_at) || [];

const statusColors: Record<string, string> = {
  active: 'bg-green-500 text-white',
  archived: 'bg-gray-500 text-white',
};

const columnColors: Record<string, string> = {
  'Todo': 'bg-gray-200 border-gray-400',
  'InProgress': 'bg-blue-200 border-blue-400',
  'Testing': 'bg-yellow-200 border-yellow-400',
  'Done': 'bg-green-200 border-green-400',
  'Pending': 'bg-red-200 border-red-400',
};
</script>

<template>
  <div>
    <Loader v-if="projectStore.loading" text="Loading project..." />

    <div v-else-if="projectStore.error" class="rounded-md bg-red-50 p-4">
      <p class="text-sm text-red-700">{{ projectStore.error }}</p>
    </div>

    <div v-else-if="projectStore.currentProject">
      <!-- Back Button -->
      <div class="mb-4">
        <button @click="router.back()" class="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>
      </div>

      <!-- Project Information Card -->
      <div class="bg-white shadow-md rounded-lg p-6 mb-8">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ projectStore.currentProject.name }}</h1>
            <p class="text-gray-600 mt-1">{{ projectStore.currentProject.description }}</p>
          </div>
          <div class="flex items-center gap-3">
            <span :class="['inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium capitalize', statusColors[projectStore.currentProject.status]]">
              {{ projectStore.currentProject.status }}
            </span>
            <BaseButton variant="secondary" @click="openEditProjectModal">Edit Project</BaseButton>
          </div>
        </div>
        <hr class="my-4 border-gray-200" />
        <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <div>
            <p class="text-gray-500">Created by:</p>
            <p class="font-medium text-gray-900">{{ projectStore.currentProject.creator?.name || 'N/A' }}</p>
          </div>
          <div>
            <p class="text-gray-500">Total Tasks:</p>
            <p class="font-medium text-gray-900">{{ totalTasksCount }}</p>
          </div>
          <div>
            <p class="text-gray-500">Done Tasks:</p>
            <p :class="['font-medium', { 'text-green-500': doneTasksCount > 0 }]">
              {{ doneTasksCount }} / {{ totalTasksCount }}
            </p>
          </div>
        </div>
      </div>

      <!-- Tasks Section Header -->
      <div class="mb-6 flex items-center justify-between flex-wrap gap-4">
        <h2 class="text-2xl font-bold text-gray-900">Tasks</h2>
        <BaseButton @click="openCreateTaskModal">+ Add Task</BaseButton>
      </div>

      <!-- Kanban board -->
      <div class="flex gap-4 overflow-x-auto pb-4">
        <div
          v-for="category in projectStore.categories"
          :key="category.id"
          class="flex-shrink-0 w-72 flex flex-col rounded-lg border"
          :class="[columnColors[category.name] || 'bg-gray-50 border-gray-200', dragOverCategoryId === category.id ? 'ring-2 ring-indigo-400' : '']"
          @drop="onDrop($event, category.id)"
          @dragover="onDragOver($event, category.id)"
          @dragleave="onDragLeave"
        >
          <!-- Column header -->
          <div class="px-4 py-3 border-b border-inherit flex items-center justify-between">
            <h3 class="text-sm font-bold text-gray-800">{{ category.name.toUpperCase().replace(/ /g, ' ') }}</h3>
            <span class="inline-flex items-center rounded-full bg-white px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-300">
              {{ tasksByCategory(category.id).length }}
            </span>
          </div>

          <!-- Tasks -->
          <div class="flex-1 p-3 space-y-3 min-h-[120px]">
            <div
              v-if="tasksByCategory(category.id).length === 0"
              class="flex items-center justify-center h-20 rounded-md border-2 border-dashed border-gray-300"
            >
              <p class="text-xs text-gray-400">Drop tasks here</p>
            </div>

            <div
              v-for="task in tasksByCategory(category.id)"
              :key="task.id"
              class="bg-white rounded-md border border-gray-200 p-3 shadow-sm cursor-grab hover:shadow-md transition-shadow active:cursor-grabbing"
              draggable="true"
              @dragstart="onDragStart($event, task)"
            >
              <h4 class="text-sm font-medium text-gray-900 mb-1">{{ task.title }}</h4>
              <p v-if="task.description" class="text-xs text-gray-500 mb-2 line-clamp-2">{{ task.description }}</p>
              
              <div class="border-t border-gray-100 pt-2 mt-2">
                <span :class="['text-xs font-medium', getDueDateInfo(task.due_date).colorClass]">
                  {{ getDueDateInfo(task.due_date).text }}
                </span>
                <div class="flex gap-1 mt-2">
                  <span
                    @click.stop="openEditTaskModal(task)"
                    class="inline-flex items-center rounded-md bg-blue-500 px-2 py-1 text-xs font-medium text-white cursor-pointer hover:bg-blue-600"
                  >
                    Edit
                  </span>
                  <span
                    @click.stop="deleteTask(task.id)"
                    class="inline-flex items-center rounded-md bg-red-500 px-2 py-1 text-xs font-medium text-white cursor-pointer hover:bg-red-600"
                  >
                    Delete
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-16">
      <p class="text-gray-500">Project not found.</p>
    </div>

    <!-- Modals -->
    <ProjectFormModal
      :is-open="isProjectModalOpen"
      :project="currentProjectToEdit"
      @close="isProjectModalOpen = false"
      @save="handleUpdateProject"
    />

    <TaskFormModal
      :is-open="isTaskModalOpen"
      :task="editingTask"
      :project-id="projectStore.currentProject?.id || null"
      :categories="projectStore.categories"
      @close="isTaskModalOpen = false"
      @save="saveTask"
    />
  </div>
</template>
