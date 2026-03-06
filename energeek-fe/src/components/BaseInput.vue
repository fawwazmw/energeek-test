<template>
  <div class="space-y-1">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <textarea
      v-if="type === 'textarea'"
      :id="id"
      :value="modelValue as string"
      :placeholder="placeholder"
      :disabled="disabled"
      rows="3"
      :class="[
        'block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500',
        errorMessage ? 'ring-red-400 focus:ring-red-500' : 'ring-gray-300 focus:ring-indigo-600',
      ]"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <input
      v-else
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="[
        'block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500',
        errorMessage ? 'ring-red-400 focus:ring-red-500' : 'ring-gray-300 focus:ring-indigo-600',
      ]"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
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
