<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\Category;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $activeProjectsCount = Project::where('status', 'active')->count();

        $doneCategoryId = Category::where('name', 'Done')->value('id');
        $pendingTasksCount = Task::when($doneCategoryId, fn($q) => $q->where('category_id', '!=', $doneCategoryId))->count();

        $upcomingTasks = Task::with(['project', 'category'])
            ->whereNotNull('due_date')
            ->when($doneCategoryId, fn($q) => $q->where('category_id', '!=', $doneCategoryId))
            ->whereBetween('due_date', [Carbon::today(), Carbon::today()->addDays(3)])
            ->orderBy('due_date')
            ->limit(10)
            ->get();

        return response()->json([
            'total_active_projects' => $activeProjectsCount,
            'total_unfinished_tasks' => $pendingTasksCount,
            'tasks_near_due_date' => $upcomingTasks,
        ]);
    }
}
