<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['user_id', 'name'];

   public function tasks()
{
    return $this->belongsToMany(Task::class, 'task_category', 'category_id', 'task_id');
}

}

