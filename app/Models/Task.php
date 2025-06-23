<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'judul',
        'deskripsi',
        'tanggal_deadline',
        'prioritas',
        'status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
