<template>
    <BaseModal :is-open="isOpen" :title="formTitle" @close="$emit('close')">
        <form @submit.prevent="handleSubmit">
            <BaseInput
                id="taskTitle"
                label="Title"
                v-model="form.title"
                :error-message="errors.title?.[0]"
                :disabled="loading"
            />
            <BaseInput
                id="taskDescription"
                label="Description"
                type="textarea"
                v-model="form.description"
                :error-message="errors.description?.[0]"
                :disabled="loading"
            />
            <BaseInput
                id="taskDueDate"
                label="Due Date"
                type="date"
                v-model="form.due_date"
                :error-message="errors.due_date?.[0]"
                :disabled="loading"
            />
            <div class="form-group">
                <label for="taskCategory">Category</label>
                <select id="taskCategory" v-model="form.category_id" class="form-control" :disabled="loading">
                    <option value="" disabled>Select a category</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                    </option>
                </select>
                <p v-if="errors.category_id" class="error-message">{{ errors.category_id[0] }}</p>
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
import { Task, Category } from '../types';
import BaseModal from './BaseModal.vue';
import BaseInput from './BaseInput.vue';
import BaseButton from './BaseButton.vue';

const props = defineProps<{
    isOpen: boolean;
    task?: Task | null;
    projectId: number | null; // Needed for new tasks
    categories: Category[];
}>();

const emit = defineEmits(['close', 'save']);

const form = ref({
    title: '',
    description: '',
    due_date: '',
    category_id: '' as string | number, // Can be empty string initially
});

const loading = ref(false);
const errors = ref<Record<string, string[]>>({});

const formTitle = computed(() => (props.task ? 'Edit Task' : 'Create Task'));
const submitButtonText = computed(() => (props.task ? 'Update Task' : 'Create Task'));

watch(() => props.task, (newTask) => {
    if (newTask) {
        form.value = {
            title: newTask.title,
            description: newTask.description,
            due_date: newTask.due_date,
            category_id: newTask.category_id,
        };
    } else {
        form.value = { title: '', description: '', due_date: '', category_id: '' };
    }
    errors.value = {};
}, { immediate: true });

watch(() => props.isOpen, (newVal) => {
    if (!newVal) {
        // Reset form and errors when modal closes
        form.value = { title: '', description: '', due_date: '', category_id: '' };
        errors.value = {};
    }
});


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
