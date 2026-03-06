<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useProjectStore } from '../../stores/project';
import { useRouter } from 'vue-router';
import ProjectFormModal from '../../components/ProjectFormModal.vue';
import { Project } from '../../types';

const projectStore = useProjectStore();
const router = useRouter();

const searchQuery = ref('');
const filterStatus = ref<'active' | 'archived' | ''>('');
const isCreateProjectModalOpen = ref(false);

onMounted(() => {
    projectStore.fetchProjects();
});

watch([searchQuery, filterStatus], () => {
    projectStore.fetchProjects(searchQuery.value, filterStatus.value || undefined);
});

const navigateToProject = (id: number) => {
    router.push({ name: 'ProjectDetail', params: { id } });
};

const openCreateProjectModal = () => {
    isCreateProjectModalOpen.value = true;
};

const handleCreateProject = async (projectData: Partial<Project>) => {
    try {
        await projectStore.createProject(projectData as { name: string; description: string; status: 'active' | 'archived' });
        isCreateProjectModalOpen.value = false;
        await projectStore.fetchProjects(searchQuery.value, filterStatus.value || undefined); // Refresh list
    } catch (error) {
        console.error('Error creating project:', error);
        throw error; // Re-throw to allow modal to display error
    }
};
</script>

<template>
    <div class="project-list-container">
        <h2>Projects</h2>

        <div class="controls">
            <input type="text" v-model="searchQuery" placeholder="Search projects by name..." class="search-input" />
            <select v-model="filterStatus" class="status-filter">
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
            </select>
            <button @click="openCreateProjectModal" class="btn btn-primary">Create New Project</button>
        </div>

        <ProjectFormModal
            :is-open="isCreateProjectModalOpen"
            @close="isCreateProjectModalOpen = false"
            @save="handleCreateProject"
        />

        <div v-if="projectStore.loading" class="loader-overlay">
            <Loader text="Loading projects..." />
        </div>
        <div v-else-if="projectStore.error" class="error-message">{{ projectStore.error }}</div>

        <div v-else-if="projectStore.projects.length" class="project-grid">
            <div v-for="project in projectStore.projects" :key="project.id" class="project-card" @click="navigateToProject(project.id)">
                <h3>{{ project.name }}</h3>
                <p>{{ project.description }}</p>
                <div class="project-meta">
                    <span :class="['status-badge', project.status]">
                        {{ project.status }}
                    </span>
                    <span class="creator">By: {{ project.creator?.name }}</span>
                </div>
            </div>
        </div>
        <div v-else class="no-projects">
            <p>No projects found. Start by creating a new one!</p>
        </div>
    </div>
</template>

<style scoped>
.project-list-container {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

h2 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 2rem;
}

.controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    gap: 1rem;
}

.search-input, .status-filter {
    flex-grow: 1;
    padding: 0.5rem 0.75rem;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    font-size: 1rem;
}

.status-filter {
    max-width: 150px;
}

.btn-primary {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    white-space: nowrap;
}

.project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
}

.project-card {
    background-color: #fff;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.project-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.project-card h3 {
    color: #007bff;
    margin-bottom: 0.5rem;
}

.project-card p {
    color: #555;
    font-size: 0.95rem;
    margin-bottom: 1rem;
    flex-grow: 1;
}

.project-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85rem;
    color: #777;
    margin-top: 1rem;
}

.status-badge {
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    color: #fff;
    text-transform: capitalize;
}

.status-badge.active {
    background-color: #28a745;
}

.status-badge.archived {
    background-color: #6c757d;
}

.creator {
    font-style: italic;
}

.loader, .error-message, .no-projects {
    text-align: center;
    padding: 1rem;
    font-size: 1.1rem;
    color: #555;
}

.error-message {
    color: #dc3545;
}
</style>
