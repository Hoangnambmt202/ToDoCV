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
                    'categories' => $task->categories->pluck('name'), // chỉ lấy tên
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

    /**
     * Update the specified resource in storage.
     */
    // public function update(Request $request, string $id)
    // {
    //     $task = Task::findOrFail($id);
    //     $task->update($request->all());
    //     return response()->json([
    //         'message' => 'Công việc đã được cập nhật thành công',
    //         'data' => $task,
    //     ], 200);
    // }
    public function update(Request $request, string $id)
    {
        $task = Task::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:to-do,doing,completed',
            'due_date' => 'nullable|date',
            'important' => 'nullable|boolean',
            'category_names' => 'nullable|array',
            'category_names.*' => 'string|max:255',
        ]);

        // Định dạng ngày nếu có
        $validated['due_date'] = isset($validated['due_date'])
            ? Carbon::parse($validated['due_date'])->format('Y-m-d')
            : null;

        $task->update($validated);

        // Xử lý category nếu có gửi lên
        if ($request->has('category_names')) {
            $categoryIds = [];
            foreach ($request->category_names as $name) {
                $category = \App\Models\Category::firstOrCreate([
                    'name' => $name,
                    'user_id' => auth()->id(),
                ]);
                $categoryIds[$category->id] = ['user_id' => auth()->id()]; // 👈 thêm user_id vào pivot
            }

            // Gắn category kèm user_id vào bảng trung gian
            $task->categories()->sync($categoryIds);
        }

        // Load lại category để trả về frontend
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
