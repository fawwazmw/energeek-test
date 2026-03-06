import { beforeAll, afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/vue';
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

// extends Vitest's expect with methods from testing-library/jest-dom
expect.extend(matchers);

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => cleanup());

// Mock localStorage
const localStorageMock = (function () {
    let store: Record<string, string> = {};
    return {
        getItem(key: string) {
            return store[key] || null;
        },
        setItem(key: string, value: string) {
            store[key] = value.toString();
        },
        removeItem(key: string) {
            delete store[key];
        },
        clear() {
            store = {};
        }
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

// Mock router
// For mocking useRouter, you might need to mock vue-router itself
// Example:
// import * as VueRouter from 'vue-router';
// vi.mock('vue-router', async () => {
//   const actual = await vi.importActual('vue-router');
//   return {
//     ...actual,
//     useRouter: vi.fn(() => ({
//       push: vi.fn(),
//       // Add other router methods you use in components
//     })),
//     useRoute: vi.fn(() => ({
//       params: {},
//       query: {},
//     })),
//   };
// });

// Mock pinia (if needed globally, otherwise mock per test)
// import { createPinia, setActivePinia } from 'pinia';
// beforeAll(() => {
//   setActivePinia(createPinia());
// });
