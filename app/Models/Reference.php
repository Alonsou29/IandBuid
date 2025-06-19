<?php

namespace App\Models;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reference extends Model
{
    Use HasFactory;

    protected $fillable=[
        'employee_id',
        'fullname',
        'phone_number',
        'email',
        'isDelete',
    ];

    public function Employee():BelongsTo{
        $this->belongsTo(Employee::class, 'employee_id','social_id');
    }
}
