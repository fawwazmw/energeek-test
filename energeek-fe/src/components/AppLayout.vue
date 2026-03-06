<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, RouterView, useRouter } from 'vue-router';
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue';
import { useAuthStore } from '../stores/auth';


const authStore = useAuthStore();
const router = useRouter();
const sidebarOpen = ref(false);

const navigation = [
  { name: 'Dashboard', to: '/dashboard', icon: 'dashboard' },
  { name: 'Projects', to: '/projects', icon: 'project' },
  { name: 'Tasks', to: '/tasks', icon: 'task' },
];

const handleLogout = async () => {
  await authStore.logout();
  router.push({ name: 'Login' });
};
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Mobile sidebar -->
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog as="div" class="relative z-50 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild
          as="template"
          enter="transition-opacity ease-linear duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-900/80" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild
            as="template"
            enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-full"
            enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leave-from="translate-x-0"
            leave-to="-translate-x-full"
          >
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-[#141E31] px-6 pb-4">
                <div class="flex h-16 shrink-0 items-center border-b border-gray-700">
                  <span class="text-2xl font-bold tracking-tight">
                    <span class="text-white">Task</span><span class="text-[#3B83F6]">Tracker</span>
                  </span>
                </div>
                <nav class="flex flex-1 flex-col">
                  <ul class="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul class="-mx-2 space-y-1">
                        <li v-for="item in navigation" :key="item.name">
                          <RouterLink
                            :to="item.to"
                            class="group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-300 hover:bg-gray-800 hover:text-white"
                            active-class="bg-gray-800 text-white"
                            @click="sidebarOpen = false"
                          >
                            <!-- Icons based on name -->
                            <svg v-if="item.icon === 'dashboard'" class="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                            <svg v-else-if="item.icon === 'project'" class="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                            </svg>
                            <svg v-else-if="item.icon === 'task'" class="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                            </svg>
                            {{ item.name }}
                          </RouterLink>
                        </li>
                      </ul>
                    </li>
                    <li class="mt-auto">
                      <button
                        @click="handleLogout"
                        class="flex items-center gap-x-3 w-full text-left rounded-md p-2 text-sm font-semibold leading-6 text-gray-300 hover:bg-gray-800 hover:text-white"
                      >
                        <svg class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                        Logout
                      </button>
                      <hr class="my-4 border-gray-700" />
                      <div class="flex items-center gap-x-4 p-2">
                        <div class="h-10 w-10 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-lg">
                          {{ authStore.user?.name?.charAt(0)?.toUpperCase() || 'U' }}
                        </div>
                        <div class="flex flex-col">
                          <span class="text-sm font-semibold leading-6 text-white">{{ authStore.user?.name }}</span>
                          <span class="text-xs font-medium text-[#3B83F6]">Administrator</span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Desktop sidebar -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-[#141E31] px-6 pb-4">
        <div class="flex h-16 shrink-0 items-center border-b border-gray-700">
          <span class="text-2xl font-bold tracking-tight">
            <span class="text-white">Task</span><span class="text-[#3B83F6]">Tracker</span>
          </span>
        </div>
        <nav class="flex flex-1 flex-col">
          <ul class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul class="-mx-2 space-y-1">
                <li v-for="item in navigation" :key="item.name">
                  <RouterLink
                    :to="item.to"
                    class="group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-300 hover:bg-gray-800 hover:text-white"
                    active-class="bg-gray-800 text-white"
                  >
                    <svg v-if="item.icon === 'dashboard'" class="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    <svg v-else-if="item.icon === 'project'" class="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                    </svg>
                    <svg v-else-if="item.icon === 'task'" class="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                    </svg>
                    {{ item.name }}
                  </RouterLink>
                </li>
              </ul>
            </li>
            <li class="mt-auto">
              <button
                @click="handleLogout"
                class="flex items-center gap-x-3 w-full text-left rounded-md p-2 text-sm font-semibold leading-6 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <svg class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                Logout
              </button>
              <hr class="my-4 border-gray-700" />
              <div class="flex items-center gap-x-4 p-2">
                <div class="h-10 w-10 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                  <!-- Fallback to initial if no image URL, you can replace with img tag if user has an avatar -->
                  {{ authStore.user?.name?.charAt(0)?.toUpperCase() || 'U' }}
                </div>
                <div class="flex flex-col overflow-hidden">
                  <span class="text-sm font-semibold leading-6 text-white truncate">{{ authStore.user?.name }}</span>
                  <span class="text-xs font-medium text-[#3B83F6] truncate">Administrator</span>
                </div>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Main content -->
    <div class="lg:pl-64">
      <!-- Top bar (mobile) -->
      <div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm lg:hidden">
        <button
          type="button"
          class="-m-2.5 p-2.5 text-gray-700"
          @click="sidebarOpen = true"
        >
          <span class="sr-only">Open sidebar</span>
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <span class="text-2xl font-bold tracking-tight">
          <span class="text-[#141E31]">Task</span><span class="text-[#3B83F6]">Tracker</span>
        </span>
      </div>

      <main class="py-8 px-4 sm:px-6 lg:px-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
