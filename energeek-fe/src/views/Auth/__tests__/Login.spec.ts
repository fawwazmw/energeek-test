import { render, screen } from '@testing-library/vue';
import { describe, it, expect, vi } from 'vitest';
import Login from '../Login.vue';
import { createTestingPinia } from '@pinia/testing';
import { useRouter } from 'vue-router';

// Mock useRouter from vue-router
vi.mock('vue-router', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useRouter: vi.fn(() => ({
            push: vi.fn(),
        })),
    };
});

describe('Login.vue', () => {
    it('renders login form correctly', () => {
        render(Login, {
            global: {
                plugins: [createTestingPinia({
                    initialState: {
                        auth: {
                            token: null,
                            user: null,
                        }
                    },
                    stubActions: false, // We want to test actions sometimes
                })],
            }
        });

        // Verify email input exists
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();

        // Verify password input exists
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

        // Verify login button exists
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });
});
