<template>
    <button
        :type="type"
        :class="['btn', `btn-${variant}`, { 'btn-block': block }]"
        :disabled="disabled || loading"
    >
        <span v-if="loading" class="spinner"></span>
        <slot v-else></slot>
    </button>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

type ButtonType = 'button' | 'submit' | 'reset';
type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link';

withDefaults(defineProps<{
    type?: ButtonType;
    variant?: ButtonVariant;
    block?: boolean;
    disabled?: boolean;
    loading?: boolean;
}>(), {
    type: 'button',
    variant: 'primary',
    block: false,
    disabled: false,
    loading: false,
});
</script>

<style scoped>
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 400;
    color: #212529;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    user-select: none;
    background-color: transparent;
    border: 1px solid transparent;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: 0.25rem;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
                border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
}

/* Variants */
.btn-primary {
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
}
.btn-primary:hover:not(:disabled) {
    background-color: #0056b3;
    border-color: #0056b3;
}

.btn-secondary {
    color: #fff;
    background-color: #6c757d;
    border-color: #6c757d;
}
.btn-secondary:hover:not(:disabled) {
    background-color: #5a6268;
    border-color: #545b62;
}

.btn-success {
    color: #fff;
    background-color: #28a745;
    border-color: #28a745;
}
.btn-success:hover:not(:disabled) {
    background-color: #218838;
    border-color: #1e7e34;
}

.btn-danger {
    color: #fff;
    background-color: #dc3545;
    border-color: #dc3545;
}
.btn-danger:hover:not(:disabled) {
    background-color: #c82333;
    border-color: #bd2130;
}

.btn-warning {
    color: #212529;
    background-color: #ffc107;
    border-color: #ffc107;
}
.btn-warning:hover:not(:disabled) {
    background-color: #e0a800;
    border-color: #d39e00;
}

.btn-info {
    color: #fff;
    background-color: #17a2b8;
    border-color: #17a2b8;
}
.btn-info:hover:not(:disabled) {
    background-color: #138496;
    border-color: #117a8b;
}

.btn-light {
    color: #212529;
    background-color: #f8f9fa;
    border-color: #f8f9fa;
}
.btn-light:hover:not(:disabled) {
    color: #212529;
    background-color: #e2e6ea;
    border-color: #dae0e5;
}

.btn-dark {
    color: #fff;
    background-color: #343a40;
    border-color: #343a40;
}
.btn-dark:hover:not(:disabled) {
    color: #fff;
    background-color: #23272b;
    border-color: #1d2124;
}

.btn-link {
    font-weight: 400;
    color: #007bff;
    text-decoration: none;
}
.btn-link:hover:not(:disabled) {
    color: #0056b3;
    text-decoration: underline;
}

.btn-block {
    display: flex; /* Changed to flex to center spinner */
    width: 100%;
}

.spinner {
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    width: 1em;
    height: 1em;
    animation: spin 1s linear infinite;
    display: inline-block;
    vertical-align: middle;
    margin-right: 0.5em; /* Space between spinner and text */
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
