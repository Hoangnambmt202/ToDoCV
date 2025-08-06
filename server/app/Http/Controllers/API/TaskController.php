<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = request()->user(); // hoặc auth()->user()

        $tasks = Task::with('categories')
            ->where('user_id', $user->id)
            ->get()
            ->map(function ($task) {
                return [
                    'id' => $task->id,
                    'title' => $task->title,
                    'description' => $task->description,
                    'status' => $task->status,
                    'due_date' => $task->due_date,
                    'important' => $task->important,
                ];
            });

        return response()->json([
            'message' => 'Danh sách công việc đã được lấy thành công',
            'data' => $tasks,
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
            'status' => 'required|in:to-do,doing,completed',
            'due_date' => 'nullable|date',
        ]);

        // Chuyển đổi due_date thành định dạng MySQL hợp lệ
        $validated['due_date'] = $validated['due_date']
            ? Carbon::parse($validated['due_date'])->format('Y-m-d')
            : null;

        // Tạo task
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


    public function update(Request $request, string $id)
    {
        $task = Task::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:to-do,doing,completed',
            'due_date' => 'nullable|date',
            'important' => 'nullable|boolean',
        ]);

        $validated['due_date'] = isset($validated['due_date'])
            ? Carbon::parse($validated['due_date'])->format('Y-m-d')
            : null;

        $task->update($validated);

        // Load lại category để trả về frontend (nếu muốn)
        $task->load('categories');

        return response()->json([
            'message' => 'Cập nhật công việc thành công',
            'data' => $task
        ], 200);
    }



    public function toggleImportant($id)
    {
        $task = Task::findOrFail($id);
        $task->important = !$task->important;
        $task->save();

        return response()->json([
            'message' => 'Cập nhật trạng thái quan trọng thành công',
            'task' => $task
        ]);
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
