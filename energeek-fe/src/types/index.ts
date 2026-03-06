export interface User {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface Project {
    id: number;
    created_by: number;
    name: string;
    description: string;
    status: 'active' | 'archived';
    created_at: string;
    updated_at: string;
    creator?: User; // Optional, loaded via relationship
    tasks?: Task[]; // Optional, loaded via relationship
}

export interface Task {
    id: number;
    project_id: number;
    category_id: number;
    created_by: number;
    deleted_by: number | null;
    title: string;
    description: string;
    due_date: string; // YYYY-MM-DD
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    project?: Project; // Optional, loaded via relationship
    category?: Category; // Optional, loaded via relationship
    creator?: User; // Optional, loaded via relationship
    deleter?: User; // Optional, loaded via relationship
}
