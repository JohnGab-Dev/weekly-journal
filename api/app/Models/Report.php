<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $primaryKey = 'reportId';
    protected $fillable = [
        'reportDateId',
        'type',
        'description',
    ];
}
