<template>
    <teleport to="body">
        <transition name="modal-fade">
            <div v-if="isOpen" class="modal-backdrop" @click="closeModal">
                <div class="modal-content" role="dialog" aria-modal="true" :aria-labelledby="titleId" @click.stop>
                    <header class="modal-header">
                        <h3 :id="titleId">{{ title }}</h3>
                        <button type="button" class="btn-close" @click="closeModal" aria-label="Close modal">
                            &times;
                        </button>
                    </header>
                    <section class="modal-body">
                        <slot></slot>
                    </section>
                    <footer class="modal-footer" v-if="$slots.footer">
                        <slot name="footer"></slot>
                    </footer>
                </div>
            </div>
        </transition>
    </teleport>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, withDefaults, onMounted, onUnmounted } from 'vue';

const props = withDefaults(defineProps<{
    isOpen: boolean;
    title: string;
}>(), {
    isOpen: false,
    title: '',
});

const emit = defineEmits(['close']);

const titleId = `modal-title-${Math.random().toString(36).substring(2, 9)}`;

const closeModal = () => {
    emit('close');
};

const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.isOpen) {
        closeModal();
    }
};

onMounted(() => {
    document.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape);
});
</script>

<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: #fff;
    border-radius: 8px;
    padding: 1.5rem;
    min-width: 300px;
    max-width: 90%;
    max-height: 90%;
    overflow-y: auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    position: relative;
    display: flex;
    flex-direction: column;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
}

.modal-header h3 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
}

.btn-close {
    border: none;
    font-size: 1.5rem;
    padding: 0;
    cursor: pointer;
    font-weight: bold;
    color: #999;
    background: transparent;
    line-height: 1;
}

.btn-close:hover {
    color: #666;
}

.modal-body {
    flex-grow: 1;
    padding-bottom: 1rem;
}

.modal-footer {
    border-top: 1px solid #eee;
    padding-top: 1rem;
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}
</style>
