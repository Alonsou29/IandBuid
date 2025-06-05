<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Employee extends Model
{
    Use HasFactory;

    protected $fillable = [
        'name',
        'lastname',
        'email',
        'age'
    ];

    public function jobs():BelongsToMany{
        return $this->belongsToMany(Job::class);
    }
}
