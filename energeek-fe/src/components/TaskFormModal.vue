<template>
  <BaseModal :is-open="isOpen" :title="formTitle" @close="$emit('close')">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <BaseInput
        id="taskTitle"
        label="Title"
        v-model="form.title"
        placeholder="Enter task title"
        :error-message="errors.title?.[0]"
        :disabled="loading"
      />
      <BaseInput
        id="taskDescription"
        label="Description"
        type="textarea"
        v-model="form.description"
        placeholder="Enter task description"
        :error-message="errors.description?.[0]"
        :disabled="loading"
      />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-1">
          <label for="taskCategory" class="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="taskCategory"
            v-model="form.category_id"
            :disabled="loading"
            class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:bg-gray-50"
          >
            <option value="" disabled>Select a category</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
          <p v-if="errors.category_id" class="text-sm text-red-600">{{ errors.category_id[0] }}</p>
        </div>
        <BaseInput
          id="taskDueDate"
          label="Due Date"
          type="date"
          v-model="form.due_date"
          :error-message="errors.due_date?.[0]"
          :disabled="loading"
        />
      </div>
      <div v-if="!projectId" class="space-y-1">
        <label for="taskProject" class="block text-sm font-medium text-gray-700">Project</label>
        <select
          id="taskProject"
          v-model="form.project_id"
          :disabled="loading"
          class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:bg-gray-50"
        >
          <option value="" disabled>Select a project</option>
          <option v-for="proj in projectStore.projects" :key="proj.id" :value="proj.id">
            {{ proj.name }}
          </option>
        </select>
        <p v-if="errors.project_id" class="text-sm text-red-600">{{ errors.project_id[0] }}</p>
      </div>
      <p v-if="errors.general" class="text-sm text-red-600">{{ errors.general[0] }}</p>
      <div class="flex justify-end gap-3 pt-2">
        <BaseButton variant="secondary" type="button" @click="$emit('close')" :disabled="loading">Cancel</BaseButton>
        <BaseButton type="submit" :loading="loading">{{ submitButtonText }}</BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import type { Task, Category } from '../types';
import BaseModal from './BaseModal.vue';
import BaseInput from './BaseInput.vue';
import BaseButton from './BaseButton.vue';
import { useProjectStore } from '../stores/project';

const projectStore = useProjectStore();

const props = defineProps<{
  isOpen: boolean;
  task?: Task | null;
  projectId?: number | null; // Made optional
  categories: Category[];
}>();

const emit = defineEmits(['close', 'save']);

const initialFormState = {
  title: '',
  description: '',
  due_date: '',
  category_id: '' as string | number,
  project_id: '' as string | number, // Added project_id to form state
};

const form = ref({ ...initialFormState });
const loading = ref(false);
const errors = ref<Record<string, string[]>>({});

const formTitle = computed(() => (props.task ? 'Edit Task' : 'Create Task'));
const submitButtonText = computed(() => (props.task ? 'Update' : 'Create'));

// If a projectId is provided from the parent (e.g., ProjectDetail), use it.
// Otherwise, the user will select from a dropdown.
const effectiveProjectId = computed(() => {
  return props.projectId || form.value.project_id;
});

onMounted(() => {
  // Fetch projects if not already loaded, needed for the project dropdown
  if (!projectStore.projects.length) {
    projectStore.fetchProjects();
  }
});

watch(() => props.task, (newTask) => {
  if (newTask) {
    form.value = {
      title: newTask.title,
      description: newTask.description,
      due_date: newTask.due_date,
      category_id: newTask.category_id,
      project_id: newTask.project_id, // Populate project_id if editing existing task
    };
  } else {
    // Reset form for new task, and set project_id if from a specific project view
    form.value = { ...initialFormState, project_id: props.projectId || '' };
  }
  errors.value = {};
}, { immediate: true });

watch(() => props.isOpen, (val) => {
  if (!val) {
    form.value = { ...initialFormState, project_id: props.projectId || '' };
    errors.value = {};
  }
});

const handleSubmit = async () => {
  loading.value = true;
  errors.value = {};

  if (!effectiveProjectId.value) {
    errors.value.project_id = ['Please select a project.'];
    loading.value = false;
    return;
  }

  try {
    const payload = { ...form.value, project_id: effectiveProjectId.value };
    await emit('save', payload);
  } catch (err: any) {
    if (err?.response?.data?.errors) {
      errors.value = err.response.data.errors;
    } else if (err?.response?.data?.message) {
      errors.value = { general: [err.response.data.message] };
    } else {
      errors.value = { general: ['An unexpected error occurred.'] };
    }
  } finally {
    loading.value = false;
  }
};
</script>
