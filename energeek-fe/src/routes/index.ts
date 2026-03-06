import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth'; // Assuming auth store is in ../stores/auth.ts

// Placeholder Views - these will be created later
const Login = () => import('../views/Auth/Login.vue');
const Dashboard = () => import('../views/Dashboard.vue');
const ProjectList = () => import('../views/Project/ProjectList.vue');
const ProjectDetail = () => import('../views/Project/ProjectDetail.vue');
const TaskList = () => import('../views/Task/TaskList.vue');

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { guest: true } // Mark as guest-only route
    },
    {
        path: '/',
        redirect: '/dashboard',
        meta: { requiresAuth: true }
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true }
    },
    {
        path: '/projects',
        name: 'ProjectList',
        component: ProjectList,
        meta: { requiresAuth: true }
    },
    {
        path: '/projects/:slug',
        name: 'ProjectDetail',
        component: ProjectDetail,
        props: true, // Pass route params as props
        meta: { requiresAuth: true }
    },
    {
        path: '/tasks',
        name: 'TaskList',
        component: TaskList,
        meta: { requiresAuth: true }
    },
    // Fallback route for 404 (optional, but good practice)
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../views/NotFound.vue') // Placeholder 404 view
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, _from, next) => {
    const authStore = useAuthStore();
    
    // Check if route requires authentication
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({ name: 'Login' }); // Redirect to login if not authenticated
    } 
    // Redirect authenticated users away from login page
    else if (to.meta.guest && authStore.isAuthenticated) {
        next({ name: 'Dashboard' }); // Redirect to dashboard if logged in and trying to access login
    }
    else {
        next(); // Proceed to route
    }
});

export default router;
