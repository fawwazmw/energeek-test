import { defineStore } from 'pinia';
import { ref } from 'vue';
import { taskApi } from '../services/api';
import type { Task } from '../types';

export const useTaskStore = defineStore('task', () => {
    const tasks = ref<Task[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    async function fetchTasks(params?: any) {
        loading.value = true;
        error.value = null;
        try {
            const response = await taskApi.getTasks(params);
            tasks.value = response.data.data || response.data; // Handle pagination if API sends it
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to fetch tasks.';
            console.error('Error fetching tasks:', err);
        } finally {
            loading.value = false;
        }
    }

    async function updateTask(taskId: number, updatedFields: Partial<Task>) {
        loading.value = true;
        error.value = null;
        try {
            const response = await taskApi.updateTask(taskId, updatedFields);
            const index = tasks.value.findIndex(t => t.id === taskId);
            if (index !== -1) {
                tasks.value[index] = { ...tasks.value[index], ...response.data.task };
            }
            return response.data.task;
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to update task.';
            console.error('Error updating task:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function deleteTask(taskId: number) {
        loading.value = true;
        error.value = null;
        try {
            await taskApi.deleteTask(taskId);
            tasks.value = tasks.value.filter(task => task.id !== taskId);
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to delete task.';
            console.error('Error deleting task:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    return {
        tasks,
        loading,
        error,
        fetchTasks,
        updateTask,
        deleteTask,
    };
});
