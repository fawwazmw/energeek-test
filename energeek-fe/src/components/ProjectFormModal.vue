<template>
  <BaseModal :is-open="isOpen" :title="formTitle" @close="$emit('close')">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <BaseInput
        id="projectName"
        label="Project Name"
        v-model="form.name"
        placeholder="Enter project name"
        :error-message="errors.name?.[0]"
        :disabled="loading"
      />
      <BaseInput
        id="projectDescription"
        label="Description"
        type="textarea"
        v-model="form.description"
        placeholder="Enter project description"
        :error-message="errors.description?.[0]"
        :disabled="loading"
      />
      <div class="space-y-1">
        <label for="projectStatus" class="block text-sm font-medium text-gray-700">Status</label>
        <select
          id="projectStatus"
          v-model="form.status"
          :disabled="loading"
          class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:bg-gray-50"
        >
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
        <p v-if="errors.status" class="text-sm text-red-600">{{ errors.status[0] }}</p>
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
import { ref, watch, computed } from 'vue';
import type { Project } from '../types';
import BaseModal from './BaseModal.vue';
import BaseInput from './BaseInput.vue';
import BaseButton from './BaseButton.vue';

const props = defineProps<{
  isOpen: boolean;
  project?: Project | null;
}>();

const emit = defineEmits(['close', 'save']);

const form = ref({ name: '', description: '', status: 'active' as 'active' | 'archived' });
const loading = ref(false);
const errors = ref<Record<string, string[]>>({});

const formTitle = computed(() => (props.project ? 'Edit Project' : 'Create Project'));
const submitButtonText = computed(() => (props.project ? 'Update' : 'Create'));

watch(() => props.project, (newProject) => {
  if (newProject) {
    form.value = { name: newProject.name, description: newProject.description, status: newProject.status };
  } else {
    form.value = { name: '', description: '', status: 'active' };
  }
  errors.value = {};
}, { immediate: true });

watch(() => props.isOpen, (val) => {
  if (!val) errors.value = {};
});

const handleSubmit = async () => {
  loading.value = true;
  errors.value = {};
  try {
    await emit('save', form.value);
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
