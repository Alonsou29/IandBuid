<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Occupation extends Model
{
    Use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'type',
        'status',
        'ubication',
        'needCertificate',
        'isDelete',
    ];

    public function employees():BelongsToMany{
        return $this->belongsToMany(Employee::class, 'employee_occupation', 'occupation_id','employee_id','id','social_id');
    }
}
