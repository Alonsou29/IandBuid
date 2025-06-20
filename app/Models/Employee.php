<?php

namespace App\Models;

use App\Models\Occupation;
use App\Models\Address;
use App\Models\Reference;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model
{
    Use HasFactory;

    protected $primaryKey='social_id';
    public $incrementing = false;
    protected $keyType= 'string';

    protected $fillable = [
        'social_id',
        'name',
        'lastname',
        'phone_number',
        'birthday',
        'apply_occupations',
        'avaible_travel',
        'airport',
        'military_services',
        'start_services',
        'end_services',
        'military_desc',
        'contract_url',
        'email',
        'age',
        'status'
    ];

    public function occupations():BelongsToMany{
        return $this->belongsToMany(Occupation::class, 'employee_occupation', 'employee_id','occupation_id','social_id','id');
    }

    public function addresses():HasMany{
        return $this->hasMany(Address::class,'employee_id','social_id');
    }

    public function references():HasMany{
        return $this->hasMany(Reference::class,'employee_id','social_id');
    }

    public function workHistorys():HasMany{
        return $this->hasMany(Experience::class,'employee_id','social_id');
    }
}
