<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useProjectStore } from '../../stores/project';
import { useRouter } from 'vue-router';
import ProjectFormModal from '../../components/ProjectFormModal.vue';
import Loader from '../../components/Loader.vue';
import BaseButton from '../../components/BaseButton.vue';
import type { Project } from '../../types';

const projectStore = useProjectStore();
const router = useRouter();

const searchQuery = ref('');
const filterStatus = ref<'active' | 'archived' | ''>('');
const isCreateProjectModalOpen = ref(false);
const isEditProjectModalOpen = ref(false);
const projectToEdit = ref<Project | null>(null);

onMounted(() => projectStore.fetchProjects());

watch([searchQuery, filterStatus], () => {
  projectStore.fetchProjects(searchQuery.value, filterStatus.value || undefined);
});

const navigateToProject = (slug: string) => router.push({ name: 'ProjectDetail', params: { slug } });

const handleCreateProject = async (projectData: Partial<Project>) => {
  try {
    await projectStore.createProject(projectData as { name: string; description: string; status: 'active' | 'archived' });
    isCreateProjectModalOpen.value = false;
    await projectStore.fetchProjects(searchQuery.value, filterStatus.value || undefined);
  } catch (error) {
    throw error;
  }
};

const openEditProject = (project: Project) => {
  projectToEdit.value = project;
  isEditProjectModalOpen.value = true;
};

const handleEditProject = async (projectData: Partial<Project>) => {
  if (!projectToEdit.value) return;
  try {
    await projectStore.updateProject(projectToEdit.value.id, projectData);
    isEditProjectModalOpen.value = false;
    projectToEdit.value = null;
    await projectStore.fetchProjects(searchQuery.value, filterStatus.value || undefined);
  } catch (error) {
    throw error;
  }
};

const statusColors: Record<string, string> = {
  active: 'bg-green-500 text-white', // Changed to solid green background, white text
  archived: 'bg-gray-500 text-white', // Changed to solid gray background, white text
};

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between flex-wrap gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Projects</h1>
        <p class="text-sm text-gray-500 mt-1">Manage all your projects</p>
      </div>
      <BaseButton @click="isCreateProjectModalOpen = true">+ New Project</BaseButton>
    </div>

    <!-- Filters -->
    <div class="mb-6 flex flex-wrap gap-3">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search by name..."
        class="flex-1 min-w-[200px] rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
      />
      <select
        v-model="filterStatus"
        class="rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
      >
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="archived">Archived</option>
      </select>
    </div>

    <!-- Create modal -->
    <ProjectFormModal
      :is-open="isCreateProjectModalOpen"
      @close="isCreateProjectModalOpen = false"
      @save="handleCreateProject"
    />
    
    <!-- Edit modal -->
    <ProjectFormModal
      :is-open="isEditProjectModalOpen"
      :project="projectToEdit"
      @close="isEditProjectModalOpen = false"
      @save="handleEditProject"
    />

    <Loader v-if="projectStore.loading" text="Loading projects..." />

    <div v-else-if="projectStore.error" class="rounded-md bg-red-50 p-4">
      <p class="text-sm text-red-700">{{ projectStore.error }}</p>
    </div>

    <!-- Table Layout -->
    <div v-else-if="projectStore.projects.length" class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Task</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created At</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right text-sm font-semibold text-gray-900">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="project in projectStore.projects" :key="project.id">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {{ project.name }}
                  </td>
                  <td class="py-4 px-3 text-sm text-gray-500 max-w-xs truncate">
                    {{ project.description || '-' }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span :class="['inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', statusColors[project.status]]">
                      {{ project.status }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ project.tasks_count || 0 }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ formatDate(project.created_at) }}
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 flex items-center justify-end space-x-2">
                    <span @click="navigateToProject(project.slug)" class="inline-flex items-center rounded-md bg-gray-500 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-gray-500/10 cursor-pointer hover:bg-gray-600">Detail</span>
                    <span @click="openEditProject(project)" class="inline-flex items-center rounded-md bg-blue-500 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-blue-700/10 cursor-pointer hover:bg-blue-600">Edit</span>
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
      <p class="mt-3 text-sm text-gray-500">No projects found. Create one to get started!</p>
      <div class="mt-4">
        <BaseButton @click="isCreateProjectModalOpen = true">+ New Project</BaseButton>
      </div>
    </div>
  </div>
</template>
