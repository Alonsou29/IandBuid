<?php

namespace App\Models;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'type',
        'url',
        'isDelete'
    ];

    public function Employee():BelongsTo{
        $this->belongsTo(Employee::class, 'employee_id','social_id');
    }
}
