<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useTaskStore } from '../../stores/task';
import { useProjectStore } from '../../stores/project';
import Loader from '../../components/Loader.vue';
import TaskFormModal from '../../components/TaskFormModal.vue';
import BaseButton from '../../components/BaseButton.vue';
import type { Task } from '../../types';

const taskStore = useTaskStore();
const projectStore = useProjectStore();

const searchQuery = ref('');
const filterProject = ref<number | ''>('');
const filterCategory = ref<number | ''>('');

const isCreateTaskModalOpen = ref(false); // New state for create modal
const isEditTaskModalOpen = ref(false);
const taskToEdit = ref<Task | null>(null);

onMounted(() => {
    taskStore.fetchTasks();
    projectStore.fetchProjects(); // For the filter dropdown
    projectStore.fetchCategories(); // For the filter dropdown and edit modal
});

watch([searchQuery, filterProject, filterCategory], () => {
    const params: any = {};
    if (searchQuery.value) params.search = searchQuery.value;
    if (filterProject.value) params.project_id = filterProject.value;
    if (filterCategory.value) params.category_id = filterCategory.value;
    taskStore.fetchTasks(params);
});

const openCreateTask = () => {
    taskToEdit.value = null; // Ensure no task is being edited
    isCreateTaskModalOpen.value = true;
};

const openEditTask = (task: Task) => {
    taskToEdit.value = task;
    isEditTaskModalOpen.value = true;
};

const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
        // Since project_id is now part of taskData from the modal, we can directly pass it
        // The API expects project_id, title, description, due_date, category_id
        await projectStore.createTask(taskData.project_id as number, taskData as any);
        isCreateTaskModalOpen.value = false;
        // Refresh the task list
        const params: any = {};
        if (searchQuery.value) params.search = searchQuery.value;
        if (filterProject.value) params.project_id = filterProject.value;
        if (filterCategory.value) params.category_id = filterCategory.value;
        await taskStore.fetchTasks(params);
    } catch (error) {
        console.error(error);
        throw error; // Re-throw to allow modal to display errors
    }
};

const handleEditTask = async (taskData: Partial<Task>) => {
    if (!taskToEdit.value) return;
    try {
        await taskStore.updateTask(taskToEdit.value.id, taskData);
        isEditTaskModalOpen.value = false;
        taskToEdit.value = null;
        
        // Refresh list
        const params: any = {};
        if (searchQuery.value) params.search = searchQuery.value;
        if (filterProject.value) params.project_id = filterProject.value;
        if (filterCategory.value) params.category_id = filterCategory.value;
        await taskStore.fetchTasks(params);
    } catch (error) {
        console.error(error);
        throw error; // Re-throw to allow modal to display errors
    }
};

const handleDeleteTask = async (id: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
        await taskStore.deleteTask(id);
    }
};

const getCategoryColorClass = (categoryName?: string) => {
  switch (categoryName) {
    case 'Todo': return 'bg-gray-500 text-white';
    case 'InProgress': return 'bg-blue-500 text-white';
    case 'Testing': return 'bg-yellow-500 text-white';
    case 'Done': return 'bg-green-500 text-white';
    case 'Pending': return 'bg-red-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

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
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return {
      text: dueDate.toLocaleDateString('en-GB', options),
      colorClass: 'text-blue-500'
    };
  }
};
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between flex-wrap gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Tasks</h1>
        <p class="text-sm text-gray-500 mt-1">Manage all tasks across projects</p>
      </div>
      <BaseButton @click="openCreateTask">+ New Task</BaseButton>
    </div>

    <!-- Filters -->
    <div class="mb-6 flex flex-wrap gap-3">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search task by title..."
        class="flex-1 min-w-[200px] rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
      />
      <select
        v-model="filterCategory"
        class="rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
      >
        <option value="">All Categories</option>
        <option v-for="cat in projectStore.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>
      <select
        v-model="filterProject"
        class="rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
      >
        <option value="">All Projects</option>
        <option v-for="proj in projectStore.projects" :key="proj.id" :value="proj.id">{{ proj.name }}</option>
      </select>
    </div>

    <!-- Create modal -->
    <TaskFormModal
      :is-open="isCreateTaskModalOpen"
      @close="isCreateTaskModalOpen = false"
      @save="handleCreateTask"
      :project-id="null"
      :categories="projectStore.categories"
    />

    <!-- Edit modal -->
    <TaskFormModal
      :is-open="isEditTaskModalOpen"
      :task="taskToEdit"
      :project-id="taskToEdit?.project_id || null"
      :categories="projectStore.categories"
      @close="isEditTaskModalOpen = false"
      @save="handleEditTask"
    />

    <Loader v-if="taskStore.loading" text="Loading tasks..." />

    <div v-else-if="taskStore.error" class="rounded-md bg-red-50 p-4">
      <p class="text-sm text-red-700">{{ taskStore.error }}</p>
    </div>

    <!-- Table Layout -->
    <div v-else-if="taskStore.tasks.length" class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Title Task</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Project</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Due Date</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right text-sm font-semibold text-gray-900">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="task in taskStore.tasks" :key="task.id">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {{ task.title }}
                  </td>
                  <td class="py-4 px-3 text-sm text-gray-500 max-w-xs truncate">
                    {{ task.project?.name || '-' }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span :class="['inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', getCategoryColorClass(task.category?.name)]">
                      {{ task.category?.name || '-' }}
                    </span>
                  </td>
                  <td :class="['whitespace-nowrap px-3 py-4 text-sm font-medium', getDueDateInfo(task.due_date).colorClass]">
                    {{ getDueDateInfo(task.due_date).text }}
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 flex items-center justify-end space-x-2">
                    <span @click="openEditTask(task)" class="inline-flex items-center rounded-md bg-blue-500 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-blue-700/10 cursor-pointer hover:bg-blue-600">Edit</span>
                    <span @click="handleDeleteTask(task.id)" class="inline-flex items-center rounded-md bg-red-500 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-red-600/10 cursor-pointer hover:bg-red-600">Delete</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-16">
      <svg class="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z" />
      </svg>
      <p class="mt-3 text-sm text-gray-500">No tasks found.</p>
    </div>
  </div>
</template>
