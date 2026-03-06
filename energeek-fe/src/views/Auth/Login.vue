<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const loading = ref(false);
const errors = ref<Record<string, string | string[]>>({});

const handleLogin = async () => {
  loading.value = true;
  errors.value = {};
  try {
    await authStore.login(email.value, password.value);
    router.push({ name: 'Dashboard' });
  } catch (error: any) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors;
    } else if (error.response?.data?.message) {
      errors.value = { general: error.response.data.message };
    } else {
      errors.value = { general: 'An unexpected error occurred.' };
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen w-full bg-[#141E31] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div class="mb-8 text-left">
          <h1 class="text-3xl font-bold tracking-tight">
            <span class="text-[#141E31]">Task</span><span class="text-[#3B83F6]">Tracker</span>
          </h1>
          <p class="mt-2 text-sm text-gray-500">Login to your account</p>
        </div>
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <div class="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                v-model="email"
                :disabled="loading"
                :class="[
                  'block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:bg-gray-50',
                  errors.email ? 'ring-red-400' : 'ring-gray-300'
                ]"
                placeholder="admin@energeek.co.id"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">
                {{ Array.isArray(errors.email) ? errors.email[0] : errors.email }}
              </p>
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <div class="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                v-model="password"
                :disabled="loading"
                :class="[
                  'block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:bg-gray-50',
                  errors.password ? 'ring-red-400' : 'ring-gray-300'
                ]"
              />
              <p v-if="errors.password" class="mt-1 text-sm text-red-600">
                {{ Array.isArray(errors.password) ? errors.password[0] : errors.password }}
              </p>
            </div>
          </div>

          <div v-if="errors.general" class="rounded-md bg-red-50 p-3">
            <p class="text-sm text-red-700">{{ errors.general }}</p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              v-if="loading"
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
