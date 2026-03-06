import { render, screen } from '@testing-library/vue';
import { describe, it, expect, vi } from 'vitest';
import Login from '../Login.vue';
import { createTestingPinia } from '@pinia/testing';

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    useRouter: vi.fn(() => ({ push: vi.fn() })),
  };
});

describe('Login.vue', () => {
  it('renders login form correctly', () => {
    render(Login, {
      global: {
        plugins: [createTestingPinia({
          initialState: { auth: { token: null, user: null } },
          stubActions: false,
        })],
      },
    });

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });
});
