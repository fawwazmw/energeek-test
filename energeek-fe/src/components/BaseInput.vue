<template>
    <div :class="['form-group', { 'has-error': errorMessage }]">
        <label v-if="label" :for="id">{{ label }}</label>
        <input
            :id="id"
            :type="type"
            :value="modelValue"
            :placeholder="placeholder"
            :disabled="disabled"
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
            class="form-control"
        />
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, withDefaults } from 'vue';

withDefaults(defineProps<{
    id: string;
    label?: string;
    type?: string;
    modelValue: string | number;
    placeholder?: string;
    disabled?: boolean;
    errorMessage?: string;
}>(), {
    type: 'text',
    placeholder: '',
    disabled: false,
    errorMessage: '',
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #555;
}

.form-control {
    display: block;
    width: 100%;
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.has-error .form-control {
    border-color: #dc3545;
}

.error-message {
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}
</style>
