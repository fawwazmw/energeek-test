<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, RouterView } from 'vue-router';
import AppLayout from './components/AppLayout.vue';

const route = useRoute();
const useLayout = computed(() => route.meta.requiresAuth);
</script>

<template>
  <AppLayout v-if="useLayout">
    <template #default>
      <RouterView />
    </template>
  </AppLayout>
  <RouterView v-else />
</template>
