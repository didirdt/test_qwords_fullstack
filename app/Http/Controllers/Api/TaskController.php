<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        
        $user = Auth::user();        
        $query = $user->tasks();
        
        if ($request->has('prioritas')) {
            $query->where('prioritas', $request->prioritas);
        }
        
        if ($request->has('urut')) {
            $query->orderBy($request->urut);
        }
        
        $tasks = $query->get();
        
        return $this->addNeedsAttentionFlag($tasks);
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string',
            'deskripsi' => 'required|string',
            'tanggal_deadline' => 'required|date_format:d/m/Y',
            'prioritas' => 'required|in:rendah,sedang,tinggi',
        ]);    
        
        $task = Auth::user()->tasks()->create([
            'judul' => Auth::user()->name . ' - ' . $request->judul,
            'deskripsi' => $request->deskripsi,
            'tanggal_deadline' => $request->tanggal_deadline,
            'prioritas' => $request->prioritas,
            'status' => 'berjalan',
        ]);
        
        return $this->addNeedsAttentionFlag(collect([$task]))->first();
    }

    public function finishTask($id)
    {
        $task = Auth::user()->tasks()->findOrFail($id);
        $task->status = 'selesai';
        $task->save();
        return $this->addNeedsAttentionFlag(collect([$task]))->first();
    }

    public function reminder()
    {
        $now = Carbon::now('Asia/Jakarta');
        $tomorrow = $now->copy()->addDay();
        
        $tasks = Auth::user()->tasks()
            ->where('status', 'berjalan')
            ->whereBetween('tanggal_deadline', [$now->format('Y-m-d'), $tomorrow->format('Y-m-d')])
            ->get();
            
        return $this->addNeedsAttentionFlag($tasks);
    }
    
    private function addNeedsAttentionFlag($tasks)
    {
        return $tasks->map(function ($task) {
            $taskArray = $task->toArray();
            $taskArray['butuh_perhatian'] = str_contains(strtolower($task->judul . $task->deskripsi), 'urgent') || 
                                             str_contains(strtolower($task->judul . $task->deskripsi), 'client');
            return $taskArray;
        });
    }
}