<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tasks = Task::all();

        return response()->json([
            'message' => 'Danh sách công việc ',
            'data' => $tasks
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:pending,completed',
            'due_date' => 'nullable|date',
        ]);
        $task = $request->user()->tasks()->create($validated);

        return response()->json([
            'message' => 'Công việc đã được tạo thành công',
            'data' => $task,
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $task = Task::findOrFail($id);
        return response()->json(
            [
                'message' => 'Chi tiết công việc đã được lấy thành công',
                'data' => $task,
            ],
            200
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $task = Task::findOrFail($id);
        $task->update($request->all());
        return response()->json([
            'message' => 'Công việc đã được cập nhật thành công',
            'data' => $task,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $task = Task::findOrFail($id);
        $task->delete();
        return response()->json([
            'message' => 'Công việc đã được xóa thành công',
        ], 200);
    }
}
