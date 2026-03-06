<template>
    <div class="loader-container">
        <div class="spinner"></div>
        <p v-if="text">{{ text }}</p>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
    text?: string;
}>();
</script>

<style scoped>
.loader-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-top-color: #007bff;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin-bottom: 10px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loader-container p {
    color: #555;
    font-size: 1.1rem;
}
</style>
