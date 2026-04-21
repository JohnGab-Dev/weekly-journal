<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Events extends Model
{
    protected $primaryKey = 'eventId';
    protected $fillable = [
        'date',
        'title',
        'description'
    ];
}
