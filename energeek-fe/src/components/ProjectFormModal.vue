<template>
    <BaseModal :is-open="isOpen" :title="formTitle" @close="$emit('close')">
        <form @submit.prevent="handleSubmit">
            <BaseInput
                id="projectName"
                label="Project Name"
                v-model="form.name"
                :error-message="errors.name?.[0]"
                :disabled="loading"
            />
            <BaseInput
                id="projectDescription"
                label="Description"
                type="textarea"
                v-model="form.description"
                :error-message="errors.description?.[0]"
                :disabled="loading"
            />
            <div class="form-group">
                <label for="projectStatus">Status</label>
                <select id="projectStatus" v-model="form.status" class="form-control" :disabled="loading">
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                </select>
                <p v-if="errors.status" class="error-message">{{ errors.status[0] }}</p>
            </div>
            <template #footer>
                <BaseButton variant="secondary" @click="$emit('close')" :disabled="loading">Cancel</BaseButton>
                <BaseButton type="submit" :loading="loading">{{ submitButtonText }}</BaseButton>
            </template>
        </form>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { Project } from '../types';
import BaseModal from './BaseModal.vue';
import BaseInput from './BaseInput.vue';
import BaseButton from './BaseButton.vue';

const props = defineProps<{
    isOpen: boolean;
    project?: Project | null;
}>();

const emit = defineEmits(['close', 'save']);

const form = ref({
    name: '',
    description: '',
    status: 'active' as 'active' | 'archived',
});

const loading = ref(false);
const errors = ref<Record<string, string[]>>({});

const formTitle = computed(() => (props.project ? 'Edit Project' : 'Create Project'));
const submitButtonText = computed(() => (props.project ? 'Update Project' : 'Create Project'));

watch(() => props.project, (newProject) => {
    if (newProject) {
        form.value = { ...newProject };
    } else {
        form.value = { name: '', description: '', status: 'active' };
    }
    errors.value = {};
}, { immediate: true });

const handleSubmit = async () => {
    loading.value = true;
    errors.value = {};
    try {
        await emit('save', form.value);
    } catch (err: any) {
        if (err.response && err.response.data && err.response.data.errors) {
            errors.value = err.response.data.errors;
        } else if (err.response && err.response.data.message) {
            errors.value = { general: [err.response.data.message] };
        } else {
            errors.value = { general: ['An unexpected error occurred.'] };
        }
    } finally {
        loading.value = false;
    }
};
</script>
