<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReportDate extends Model
{
    protected $table = 'report_date';
    protected $primaryKey = 'reportDateId';
    protected $fillable = [
        'userId',
        'date',
        'description',
        'documentation'
    ];
}

