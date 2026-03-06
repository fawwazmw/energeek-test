<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { dashboardApi } from '../services/api';
import type { Task } from '../types';
import Loader from '../components/Loader.vue';

interface DashboardStats {
  total_active_projects: number;
  total_unfinished_tasks: number;
  tasks_near_due_date: Task[];
}

const stats = ref<DashboardStats | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const greeting = computed(() => getGreeting());

const getDueDateInfo = (dateString: string) => {
  if (!dateString) return { text: 'No due date', dotClass: 'bg-gray-400', textClass: 'text-gray-600' };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dueDate = new Date(dateString);
  dueDate.setHours(0, 0, 0, 0);
  
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return {
      text: `${Math.abs(diffDays)} days ago`,
      dotClass: 'bg-red-500',
      textClass: 'text-red-500'
    };
  } else if (diffDays === 0) {
    return {
      text: 'Today',
      dotClass: 'bg-red-500',
      textClass: 'text-red-500'
    };
  } else if (diffDays === 1) {
    return {
      text: 'Tomorrow',
      dotClass: 'bg-yellow-500',
      textClass: 'text-yellow-500'
    };
  } else {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return {
      text: dueDate.toLocaleDateString('en-GB', options),
      dotClass: 'bg-blue-500',
      textClass: 'text-blue-500'
    };
  }
};

onMounted(async () => {
  try {
    const response = await dashboardApi.getDashboardStats();
    stats.value = response.data;
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to fetch dashboard data.';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Welcome, {{ greeting }}</h1>
      <p class="text-sm text-gray-500 mt-1">Overview of your projects and tasks</p>
    </div>

    <Loader v-if="loading" text="Loading dashboard..." />

    <div v-else-if="error" class="rounded-md bg-red-50 p-4">
      <p class="text-sm text-red-700">{{ error }}</p>
    </div>

    <div v-else class="space-y-6">
      <!-- Stat cards -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div class="bg-white overflow-hidden rounded-lg shadow">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="rounded-md bg-indigo-50 p-3">
                  <svg class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Active Projects</dt>
                  <dd class="flex items-baseline">
                    <div class="text-3xl font-semibold text-gray-900">{{ stats?.total_active_projects }}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden rounded-lg shadow">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="rounded-md bg-yellow-50 p-3">
                  <svg class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Unfinished Tasks</dt>
                  <dd class="flex items-baseline">
                    <div class="text-3xl font-semibold text-gray-900">{{ stats?.total_unfinished_tasks }}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Upcoming tasks -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-5 py-4 border-b border-gray-200">
          <h2 class="text-base font-semibold text-gray-900">Task Approaching Due Date</h2>
        </div>
        <div>
          <ul v-if="stats?.tasks_near_due_date?.length" class="divide-y divide-gray-200">
            <li
              v-for="task in stats.tasks_near_due_date"
              :key="task.id"
              class="px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
            >
              <div class="flex-shrink-0 flex items-center justify-center">
                <div :class="['h-3 w-3 rounded-full', getDueDateInfo(task.due_date).dotClass]"></div>
              </div>
              
              <div class="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div class="flex flex-col">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ task.title }}</p>
                  <p class="text-xs text-gray-500 truncate mt-0.5">{{ task.project?.name || 'No Project' }}</p>
                </div>
                
                <div class="flex-shrink-0">
                  <span :class="['text-sm font-medium whitespace-nowrap', getDueDateInfo(task.due_date).textClass]">
                    {{ getDueDateInfo(task.due_date).text }}
                  </span>
                </div>
              </div>
            </li>
          </ul>
          <div v-else class="p-5 text-center text-sm text-gray-500">
            No tasks approaching due date.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
