import { defineStore } from 'pinia';
import { ref } from 'vue';
import { projectApi, categoryApi, taskApi } from '../services/api';
import type { Project, Task, Category } from '../types';

export const useProjectStore = defineStore('project', () => {
    const projects = ref<Project[]>([]);
    const currentProject = ref<Project | null>(null);
    const categories = ref<Category[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    async function fetchProjects(search?: string, status?: 'active' | 'archived') {
        loading.value = true;
        error.value = null;
        try {
            const params: { search?: string; status?: 'active' | 'archived' } = {};
            if (search) params.search = search;
            if (status) params.status = status;
            const response = await projectApi.getProjects(params);
            projects.value = response.data;
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to fetch projects.';
            console.error('Error fetching projects:', err);
        } finally {
            loading.value = false;
        }
    }

    async function fetchProject(id: number) {
        loading.value = true;
        error.value = null;
        try {
            const response = await projectApi.getProject(id);
            currentProject.value = response.data;
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to fetch project.';
            console.error('Error fetching project:', err);
        } finally {
            loading.value = false;
        }
    }

    async function createProject(newProject: { name: string; description: string; status: 'active' | 'archived' }) {
        loading.value = true;
        error.value = null;
        try {
            const response = await projectApi.createProject(newProject);
            projects.value.push(response.data.project);
            return response.data.project;
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to create project.';
            console.error('Error creating project:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function updateProject(id: number, updatedFields: Partial<Project>) {
        loading.value = true;
        error.value = null;
        try {
            const response = await projectApi.updateProject(id, updatedFields);
            const index = projects.value.findIndex(p => p.id === id);
            if (index !== -1) {
                projects.value[index] = { ...projects.value[index], ...response.data.project };
            }
            if (currentProject.value && currentProject.value.id === id) {
                currentProject.value = { ...currentProject.value, ...response.data.project };
            }
            return response.data.project;
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to update project.';
            console.error('Error updating project:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function fetchCategories() {
        loading.value = true;
        error.value = null;
        try {
            const response = await categoryApi.getCategories();
            categories.value = response.data;
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to fetch categories.';
            console.error('Error fetching categories:', err);
        } finally {
            loading.value = false;
        }
    }

    async function createTask(projectId: number, newTask: { title: string; description: string; due_date: string; category_id: number }) {
        loading.value = true;
        error.value = null;
        try {
            const response = await taskApi.createTask({ ...newTask, project_id: projectId });
            if (currentProject.value && currentProject.value.id === projectId) {
                if (!currentProject.value.tasks) {
                    currentProject.value.tasks = [];
                }
                currentProject.value.tasks.push(response.data.task);
            }
            return response.data.task;
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to create task.';
            console.error('Error creating task:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function updateTask(taskId: number, updatedFields: Partial<Task>) {
        loading.value = true;
        error.value = null;
        try {
            const response = await taskApi.updateTask(taskId, updatedFields);
            if (currentProject.value && currentProject.value.tasks) {
                const index = currentProject.value.tasks.findIndex(t => t.id === taskId);
                if (index !== -1) {
                    currentProject.value.tasks[index] = { ...currentProject.value.tasks[index], ...response.data.task };
                }
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
            if (currentProject.value && currentProject.value.tasks) {
                currentProject.value.tasks = currentProject.value.tasks.filter(task => task.id !== taskId);
            }
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to delete task.';
            console.error('Error deleting task:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    return {
        projects,
        currentProject,
        categories,
        loading,
        error,
        fetchProjects,
        fetchProject,
        createProject,
        updateProject,
        fetchCategories,
        createTask,
        updateTask,
        deleteTask,
    };
});
