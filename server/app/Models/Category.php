<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Category extends Model
{
    protected $fillable = ['name'];

   public function tasks()
{
    return $this->belongsToMany(Task::class, 'category_task')
        ->withTimestamps()
        ->withPivot('user_id');
}

}
