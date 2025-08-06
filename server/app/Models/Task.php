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


    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_task')
            ->withTimestamps()
            ->withPivot('user_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
