<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useProjectStore } from '../../stores/project';
import { Project, Task, Category } from '../../types';

import TaskFormModal from '../../components/TaskFormModal.vue';
import ProjectFormModal from '../../components/ProjectFormModal.vue';

const projectStore = useProjectStore();
const route = useRoute();

const projectId = ref<number | null>(null);
const currentProjectToEdit = ref<Project | null>(null); // For editing project

onMounted(() => {
    projectId.value = Number(route.params.id);
    if (projectId.value) {
        projectStore.fetchProject(projectId.value);
        projectStore.fetchCategories(); // Fetch categories for task creation/editing
    }
});

watch(() => route.params.id, (newId) => {
    projectId.value = Number(newId);
    if (projectId.value) {
        projectStore.fetchProject(projectId.value);
    }
});

// For task management
const isTaskModalOpen = ref(false);
const editingTask = ref<Task | null>(null);

const openCreateTaskModal = () => {
    editingTask.value = null;
    isTaskModalOpen.value = true;
};

const openEditTaskModal = (task: Task) => {
    editingTask.value = { ...task }; // Clone task to avoid direct mutation
    isTaskModalOpen.value = true;
};

const saveTask = async (taskData: Partial<Task>) => {
    if (projectId.value === null) return;

    try {
        if (editingTask.value) {
            // Update existing task
            await projectStore.updateTask(editingTask.value.id, taskData);
        } else {
            // Create new task
            await projectStore.createTask(projectId.value, taskData as any);
        }
        isTaskModalOpen.value = false;
        await projectStore.fetchProject(projectId.value); // Re-fetch project to ensure tasks are up-to-date
    } catch (error) {
        console.error('Error saving task:', error);
        alert('Failed to save task. See console for details.');
        throw error;
    }
};

const deleteTask = async (taskId: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
        try {
            await projectStore.deleteTask(taskId);
            if (projectId.value) await projectStore.fetchProject(projectId.value);
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task. See console for details.');
        }
    }
};

// For project editing
const isProjectModalOpen = ref(false);

const openEditProjectModal = () => {
    currentProjectToEdit.value = projectStore.currentProject;
    isProjectModalOpen.value = true;
};

const handleUpdateProject = async (projectData: Partial<Project>) => {
    if (projectId.value === null) return;
    try {
        await projectStore.updateProject(projectId.value, projectData);
        isProjectModalOpen.value = false;
    } catch (error) {
        console.error('Error updating project:', error);
        alert('Failed to update project. See console for details.');
        throw error;
    }
};

// Kanban board drag and drop logic
const onDragStart = (event: DragEvent, task: Task) => {
    if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', task.id.toString());
        event.dataTransfer.effectAllowed = 'move';
    }
};

const onDrop = async (event: DragEvent, targetCategoryId: number) => {
    event.preventDefault();
    const taskId = Number(event.dataTransfer?.getData('text/plain'));
    if (isNaN(taskId) || !projectId.value) return;

    const taskToMove = projectStore.currentProject?.tasks?.find(t => t.id === taskId);
    if (taskToMove && taskToMove.category_id !== targetCategoryId) {
        try {
            await projectStore.updateTask(taskId, { category_id: targetCategoryId });
            if (projectId.value) await projectStore.fetchProject(projectId.value);
        } catch (error) {
            console.error('Error moving task:', error);
            alert('Failed to move task. See console for details.');
        }
    }
};

const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move';
    }
};

const tasksByCategory = (categoryId: number) => {
    return projectStore.currentProject?.tasks?.filter(task => task.category_id === categoryId && !task.deleted_at) || [];
};
</script>

<template>
    <div class="project-detail-container">
        <div v-if="projectStore.loading" class="loader-overlay">
            <Loader text="Loading project details..." />
        </div>
        <div v-else-if="projectStore.error" class="error-message">{{ projectStore.error }}</div>

        <div v-else-if="projectStore.currentProject" class="project-content">
            <div class="project-header">
                <h1>{{ projectStore.currentProject.name }}</h1>
                <div class="project-actions">
                    <button @click="openEditProjectModal" class="btn btn-primary">Edit Project</button>
                    <button @click="openCreateTaskModal" class="btn btn-primary">Add New Task</button>
                </div>
            </div>
            <p class="project-description">{{ projectStore.currentProject.description }}</p>
            <p class="project-status">Status: <span :class="['status-badge', projectStore.currentProject.status]">{{ projectStore.currentProject.status }}</span></p>

            <hr />

            <h3>Tasks</h3>
            <div class="kanban-board">
                <div v-for="category in projectStore.categories" :key="category.id"
                     class="kanban-column"
                     @drop="onDrop($event, category.id)"
                     @dragover="onDragOver"
                >
                    <h4>{{ category.name }}</h4>
                    <div class="task-list">
                        <div v-if="tasksByCategory(category.id).length === 0" class="no-tasks">
                            No tasks in this category.
                        </div>
                        <div v-for="task in tasksByCategory(category.id)" :key="task.id"
                             class="task-card"
                             draggable="true"
                             @dragstart="onDragStart($event, task)"
                        >
                            <h5>{{ task.title }}</h5>
                            <p>{{ task.description }}</p>
                            <p class="task-due-date">Due: {{ task.due_date }}</p>
                            <div class="task-actions">
                                <button @click="openEditTaskModal(task)" class="btn btn-primary btn-sm">Edit</button>
                                <button @click="deleteTask(task.id)" class="btn btn-danger btn-sm">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="no-project-selected">
            <p>Project not found.</p>
        </div>

        <ProjectFormModal
            :is-open="isProjectModalOpen"
            :project="currentProjectToEdit"
            @close="isProjectModalOpen = false"
            @save="handleUpdateProject"
        />

        <TaskFormModal
            :is-open="isTaskModalOpen"
            :task="editingTask"
            :project-id="projectId"
            :categories="projectStore.categories"
            @close="isTaskModalOpen = false"
            @save="saveTask"
        />
    </div>
</template>

<style scoped>
.project-detail-container {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
}

h1, h2, h3 {
    color: #2c3e50;
}

.project-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
}

.project-actions {
    display: flex;
    gap: 1rem;
}

.project-description {
    color: #555;
    margin-bottom: 1rem;
}

.project-status {
    font-weight: bold;
    color: #333;
    margin-bottom: 2rem;
}

.status-badge {
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    color: #fff;
    text-transform: capitalize;
    margin-left: 0.5rem;
}

.status-badge.active {
    background-color: #28a745;
}

.status-badge.archived {
    background-color: #6c757d;
}

hr {
    border: 0;
    border-top: 1px solid #eee;
    margin: 2rem 0;
}

.kanban-board {
    display: flex;
    gap: 1.5rem;
    overflow-x: auto;
    padding-bottom: 1rem;
}

.kanban-column {
    flex: 1 1 300px; /* Adjust width as needed */
    min-width: 280px;
    background-color: #f4f7f6;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.kanban-column h4 {
    text-align: center;
    margin-bottom: 1rem;
    color: #34495e;
    border-bottom: 2px solid #eee;
    padding-bottom: 0.5rem;
}

.task-list {
    min-height: 100px; /* Ensure columns have a drop target even if empty */
}

.task-card {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 1rem;
    margin-bottom: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    cursor: grab;
    transition: all 0.2s ease;
}

.task-card:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}

.task-card h5 {
    color: #007bff;
    margin-bottom: 0.5rem;
}

.task-card p {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 0.5rem;
}

.task-due-date {
    font-size: 0.85rem;
    color: #888;
    margin-bottom: 1rem;
}

.task-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
}

.btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
    line-height: 1.5;
    border-radius: 0.2rem;
}

.no-tasks, .no-project-selected, .loader, .error-message {
    text-align: center;
    padding: 1rem;
    color: #777;
}

.error-message {
    color: #dc3545;
}
</style>
