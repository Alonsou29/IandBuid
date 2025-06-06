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
        'age',
        'status'
    ];

    public function occupations():BelongsToMany{
        return $this->belongsToMany(Occupation::class);
    }
}
