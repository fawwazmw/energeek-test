<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use App\Models\Category;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request, ?Project $project = null)
    {
        $query = Task::with(['project', 'category', 'creator']);

        if ($project && $project->exists) {
            $query->where('project_id', $project->id);
        } elseif ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        if ($request->has('search')) {
            $query->where('title', 'ilike', '%' . $request->search . '%');
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'due_date' => 'required|date',
        ]);

        $task = Task::create([
            ...$validated,
            'created_by' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Task created successfully',
            'task' => $task->load(['project', 'category', 'creator'])
        ], 201);
    }

    public function show(Task $task)
    {
        return response()->json($task->load(['project', 'category', 'creator']));
    }

    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'project_id' => 'sometimes|required|exists:projects,id',
            'category_id' => 'sometimes|required|exists:categories,id',
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'due_date' => 'sometimes|required|date',
        ]);

        $task->update($validated);

        return response()->json([
            'message' => 'Task updated successfully',
            'task' => $task->fresh()->load(['project', 'category', 'creator'])
        ]);
    }

    public function destroy(Request $request, Task $task)
    {
        $task->deleted_by = $request->user()->id;
        $task->save();
        $task->delete();

        return response()->json([
            'message' => 'Task deleted successfully'
        ]);
    }
}
