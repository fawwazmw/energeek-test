<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
      block ? 'w-full' : '',
      variantClasses[variant],
    ]"
  >
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
    <slot />
  </button>
</template>

<script setup lang="ts">
type ButtonType = 'button' | 'submit' | 'reset';
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'warning' | 'ghost';

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

const variantClasses: Record<string, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-indigo-600',
  secondary: 'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:ring-gray-400',
  danger: 'bg-red-600 text-white hover:bg-red-500 focus:ring-red-600',
  warning: 'bg-yellow-500 text-white hover:bg-yellow-400 focus:ring-yellow-500',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-400',
};
</script>
