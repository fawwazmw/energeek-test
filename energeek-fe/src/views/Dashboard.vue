<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { dashboardApi } from '../services/api';
import { Task } from '../types';

interface DashboardStats {
    total_active_projects: number;
    total_unfinished_tasks: number;
    tasks_near_due_date: Task[];
}

const stats = ref<DashboardStats | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
    try {
        const response = await dashboardApi.getDashboardStats();
        stats.value = response.data;
    } catch (err: any) {
        error.value = err.response?.data?.message || 'Failed to fetch dashboard data.';
        console.error('Error fetching dashboard data:', err);
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <div class="dashboard-container">
        <h2>Dashboard</h2>

        <div v-if="loading" class="loader-overlay">
            <Loader text="Loading dashboard data..." />
        </div>
        <div v-else-if="error" class="error-message">{{ error }}</div>
        
        <div v-else class="stats-grid">
            <div class="stat-card">
                <h3>Active Projects</h3>
                <p class="stat-value">{{ stats?.total_active_projects }}</p>
            </div>
            <div class="stat-card">
                <h3>Pending Tasks</h3>
                <p class="stat-value">{{ stats?.total_unfinished_tasks }}</p>
            </div>
            <div class="stat-card full-width">
                <h3>Upcoming Tasks (Next 3 Days)</h3>
                <ul v-if="stats && stats.tasks_near_due_date.length">
                    <li v-for="task in stats.tasks_near_due_date" :key="task.id" class="task-item">
                        <strong>{{ task.title }}</strong> in Project: {{ task.project?.name }} (Due: {{ task.due_date }})
                    </li>
                </ul>
                <p v-else>No upcoming tasks.</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.dashboard-container {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

h2 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 2rem;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
}

.stat-card {
    background-color: #fff;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.stat-card.full-width {
    grid-column: 1 / -1; /* Spans all columns */
}

.stat-card h3 {
    color: #34495e;
    margin-bottom: 1rem;
    font-size: 1.25rem;
}

.stat-value {
    font-size: 2.5rem;
    font-weight: bold;
    color: #007bff;
    text-align: center;
    margin-bottom: 0.5rem;
}

.task-item {
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    padding: 0.75rem 1rem;
    margin-bottom: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.task-item:last-child {
    margin-bottom: 0;
}

.loader, .error-message {
    text-align: center;
    padding: 1rem;
    font-size: 1.1rem;
    color: #555;
}

.error-message {
    color: #dc3545;
}
</style>
