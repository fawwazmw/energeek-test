<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
    <p class="text-8xl font-bold text-indigo-200">404</p>
    <h1 class="mt-4 text-2xl font-bold text-gray-900">Page not found</h1>
    <p class="mt-2 text-sm text-gray-500">The page you are looking for doesn't exist.</p>
    <router-link
      to="/dashboard"
      class="mt-6 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
    >
      Go to Dashboard
    </router-link>
  </div>
</template>
