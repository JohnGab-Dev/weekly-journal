<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Preferences extends Model
{
    protected $table = 'preferences';
    protected $primaryKey = 'prefId';
    protected $fillable = [
        'userId',
        'coordinator',
        'owner_name',
        'department',
        'designation',
        'head_name',
        'head_designation',
        'hours'
    ];
}
