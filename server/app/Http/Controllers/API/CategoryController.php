<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    // 📌 1. Lấy danh sách danh mục của người dùng từ bảng trung gian
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        // Lấy tất cả các category liên kết với user qua bảng trung gian, kèm theo task_id
        $categories = \DB::table('category_task')
            ->join('categories', 'categories.id', '=', 'category_task.category_id')
            ->where('category_task.user_id', $userId)
            ->select('categories.id', 'categories.name', 'category_task.task_id')
            ->get()
            ->groupBy('id')
            ->map(function ($group) {
                return [
                    'id' => $group[0]->id,
                    'name' => $group[0]->name,
                    'task_ids' => $group->pluck('task_id')->unique()->values(),
                ];
            })
            ->values();

        return response()->json([
            'message' => 'Lấy danh mục thành công',
            'data' => $categories,
        ]);
    }

    // 📌 2. Tạo mới danh mục (chỉ tạo nếu chưa có)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'task_id' => 'required|integer|exists:tasks,id',
        ]);

        $category = Category::firstOrCreate(['name' => $validated['name']]);

        DB::table('category_task')->updateOrInsert([
            'category_id' => $category->id,
            'task_id' => $validated['task_id'],
            'user_id' => $request->user()->id,
        ], [
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Thêm danh mục thành công',
            'data' => $category,
        ]);
    }




    // 📌 3. Cập nhật tên danh mục — chỉ thực hiện nếu không ảnh hưởng người khác
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        // Option 1: Kiểm tra người dùng có dùng category này không?
        $usedByUser = DB::table('category_task')
            ->where('category_id', $id)
            ->where('user_id', $request->user()->id)
            ->exists();

        if (!$usedByUser) {
            return response()->json(['message' => 'Bạn không có quyền sửa danh mục này'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category->update(['name' => $validated['name']]);

        return response()->json([
            'message' => 'Cập nhật danh mục thành công',
            'data' => $category,
        ]);
    }

    // 📌 4. Xoá liên kết của user trong category_task (không xoá toàn bộ category)
    public function destroy(Request $request, $id)
    {
        $userId = $request->user()->id;

        $deleted = DB::table('category_task')
            ->where('category_id', $id)
            ->where('user_id', $userId)
            ->delete();

        if ($deleted === 0) {
            return response()->json(['message' => 'Không tìm thấy danh mục của bạn'], 404);
        }

        return response()->json([
            'message' => 'Xoá danh mục khỏi công việc của bạn thành công',
        ]);
    }
}
