import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi } from '../services/api'; // Assuming you have an authApi service

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(localStorage.getItem('authToken'));
    const user = ref<any | null>(null); // Replace 'any' with a proper User interface later

    const isAuthenticated = computed(() => !!token.value);

    async function login(email: string, password: string) {
        try {
            const response = await authApi.login({ email, password });
            token.value = response.data.access_token;
            user.value = response.data.user;
            localStorage.setItem('authToken', token.value as string);
            return true;
        } catch (error) {
            token.value = null;
            user.value = null;
            localStorage.removeItem('authToken');
            throw error;
        }
    }

    async function logout() {
        try {
            if (token.value) {
                await authApi.logout();
            }
        } catch (error) {
            // Even if logout API fails, we should clear local state
            console.error('Logout API failed:', error);
        } finally {
            token.value = null;
            user.value = null;
            localStorage.removeItem('authToken');
        }
    }

    // Attempt to fetch user info on store initialization if token exists
    async function fetchUser() {
        if (token.value && !user.value) {
            try {
                const response = await authApi.me();
                user.value = response.data;
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                // If token is invalid, clear it
                token.value = null;
                localStorage.removeItem('authToken');
            }
        }
    }

    // Call fetchUser on store creation
    fetchUser();

    return {
        token,
        user,
        isAuthenticated,
        login,
        logout,
        fetchUser,
    };
});
