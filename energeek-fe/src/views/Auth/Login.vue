<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const loading = ref(false);
const errors = ref<Record<string, string>>({}); // For validation errors

const handleLogin = async () => {
    loading.value = true;
    errors.value = {}; // Clear previous errors

    try {
        await authStore.login(email.value, password.value);
        router.push({ name: 'Dashboard' }); // Redirect to dashboard on success
    } catch (error: any) {
        if (error.response && error.response.status === 422) {
            // Laravel validation errors
            errors.value = error.response.data.errors;
        } else if (error.response && error.response.data.message) {
            // General API error message
            errors.value.general = error.response.data.message;
        } else {
            errors.value.general = 'An unexpected error occurred.';
        }
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="login-container">
        <div class="login-box">
            <h2>Login</h2>
            <form @submit.prevent="handleLogin">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" v-model="email" :disabled="loading" />
                    <p v-if="errors.email" class="error-message">{{ errors.email[0] }}</p>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" v-model="password" :disabled="loading" />
                    <p v-if="errors.password" class="error-message">{{ errors.password[0] }}</p>
                </div>
                <button type="submit" class="btn btn-primary" :disabled="loading">
                    {{ loading ? 'Logging in...' : 'Login' }}
                </button>
                <p v-if="errors.general" class="error-message general-error">{{ errors.general }}</p>
            </form>
        </div>
    </div>
</template>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f0f2f5;
}

.login-box {
    background-color: #fff;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
}

h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #333;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #555;
}

.form-group input {
    width: calc(100% - 1.5rem); /* Adjust for padding */
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
}

.form-group input:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn-primary {
    width: 100%;
    padding: 0.75rem;
    font-size: 1.1rem;
    border-radius: 4px;
    background-color: #007bff;
    border-color: #007bff;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.btn-primary:hover:not(:disabled) {
    background-color: #0056b3;
    border-color: #0056b3;
}

.btn-primary:disabled {
    background-color: #a0cffc;
    border-color: #a0cffc;
    cursor: not-allowed;
}

.error-message {
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.5rem;
}

.general-error {
    text-align: center;
    margin-top: 1rem;
}
</style>
