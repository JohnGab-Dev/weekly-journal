<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Log extends Model
{
    protected $primaryKey = 'logId';
    protected $fillable = [
        'userId',
        'title',
        'log',
        'created_at'
    ];
}
