<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\SearchHistory;
use Illuminate\Http\Request;
use Carbon\Carbon;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->get('q');
        
        $tasks = Task::where('user_id', auth()->id())
            ->where(function($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                  ->orWhere('description', 'like', "%{$query}%");
            })
            ->orderBy('created_at', 'desc')
            ->get();

        // Save search history
        if ($tasks->count() > 0) {
            SearchHistory::create([
                'user_id' => auth()->id(),
                'query' => $query,
                'searched_at' => now(),
            ]);
        }

        return response()->json([
            'message' => 'Search completed',
            'data' => $tasks
        ],200);
    }

    public function advancedSearch(Request $request)
    {
        $query = Task::where('user_id', auth()->id());

        // Apply text search if provided
        if ($request->has('query')) {
            $searchTerm = $request->get('query');
            $query->where(function($q) use ($searchTerm) {
                $q->where('title', 'like', "%{$searchTerm}%")
                  ->orWhere('description', 'like', "%{$searchTerm}%");
                
            });
        }

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('completed', $request->status === 'completed');
        }

        // Filter by priority
        if ($request->has('important') && $request->important) {
            $query->where('important', $request->important);
        }

        // Filter by date range
        if ($request->has('startDate')) {
            $query->where('created_at', '>=', Carbon::parse($request->startDate));
        }
        if ($request->has('endDate')) {
            $query->where('created_at', '<=', Carbon::parse($request->endDate)->endOfDay());
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function suggestions(Request $request)
    {
        $query = $request->get('q');
        
        return response()->json(
            Task::where('user_id', auth()->id())
                ->where('title', 'like', "{$query}%")
                ->select('title')
                ->distinct()
                ->limit(5)
                ->get()
                ->pluck('title')
        );
    }

    public function getHistory()
    {
        $history = SearchHistory::where('user_id', auth()->id())
            ->orderBy('searched_at', 'desc')
            ->limit(10)
            ->get()
            ->pluck('query')
            ->unique()
            ->values();

        return response()->json($history);
    }

    public function clearHistory()
    {
        SearchHistory::where('user_id', auth()->id())->delete();
        return response()->json(['message' => 'Search history cleared']);
    }
}
