<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'description',
        'status',
        'due_date',
        'important',
        'user_id',
    ];
    // App\Models\Task.php

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'task_category')
            ->withPivot('user_id');
    }




    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
