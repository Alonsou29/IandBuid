<?php

namespace App\Models;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Experience extends Model
{
    use HasFactory;

    protected $fillable=[
        'employee_id',
        'emplo_name',
        'phone_number',
        'start_work',
        'end_work',
        'title',
        'duties',
        'reason_leaving',
        'isDelete',
    ];

    public function Employee():BelongsTo{
        $this->belongsTo(Employee::class, 'employee_id','social_id');
    }
}
