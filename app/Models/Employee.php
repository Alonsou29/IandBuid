<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Occupation;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Employee extends Model
{
    Use HasFactory;

    protected $primaryKey='social_id';
    // protected $incrementing = false;
    protected $keyType= 'string';

    protected $fillable = [
        'social_id',
        'name',
        'lastname',
        'phone_number',
        'birthday',
        'apply_occupations',
        'avaible_travel',
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
        return $this->belongsToMany(Occupation::class);
    }
}
