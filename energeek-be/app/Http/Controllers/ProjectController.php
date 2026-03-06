<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::query();

        if ($request->has('search')) {
            $query->where('name', 'ilike', '%' . $request->search . '%');
        }
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $projects = $query->with('creator')->latest()->get();

        return response()->json($projects);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => ['required', Rule::in(['active', 'archived'])],
        ]);

        $project = Project::create([
            ...$validated,
            'created_by' => $request->user()->id
        ]);

        return response()->json([
            'message' => 'Project created successfully',
            'project' => $project->load('creator')
        ], 201);
    }

    public function show(Project $project)
    {
        return response()->json($project->load(['creator', 'tasks.category', 'tasks.creator']));
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'status' => ['sometimes', 'required', Rule::in(['active', 'archived'])],
        ]);

        $project->update($validated);

        return response()->json([
            'message' => 'Project updated successfully',
            'project' => $project->fresh()->load('creator')
        ]);
    }
}
