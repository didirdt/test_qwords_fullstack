import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from '@inertiajs/react';

export default function TaskList({ token }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        sort: '',
        priority: ''
    });

    useEffect(() => {
        fetchTasks();
    }, [filters]);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.sort) params.append('sort', filters.sort);
            if (filters.priority) params.append('priority', filters.priority);
            
            const response = await axios.get(`/api/tasks?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(response.data);
        } catch (err) {
            console.error('Error fetching tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFinishTask = async (taskId) => {
        try {
            await axios.put(`/api/tasks/${taskId}/finish`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTasks();
        } catch (err) {
            console.error('Error finishing task:', err);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    if (loading) return <div>Loading tasks...</div>;

    return (
        <div>
            <h2>My Tasks</h2>
            
            <div>
                <label>Sort by: </label>
                <select name="sort" value={filters.sort} onChange={handleFilterChange}>
                    <option value="">None</option>
                    <option value="deadline">Deadline</option>
                </select>
                
                <label>Priority: </label>
                <select name="priority" value={filters.priority} onChange={handleFilterChange}>
                    <option value="">All</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
            
            <Link href="/tasks/create">Create New Task</Link>
            
            <ul>
                {tasks.map(task => (
                    <li key={task.id} style={{ 
                        border: '1px solid #ccc', 
                        margin: '10px 0', 
                        padding: '10px',
                        backgroundColor: task.needs_attention ? '#fff3cd' : 'white'
                    }}>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <p>Deadline: {task.deadline_date}</p>
                        <p>Priority: {task.priority}</p>
                        <p>Status: {task.is_completed ? 'Completed' : 'Pending'}</p>
                        {!task.is_completed && (
                            <button onClick={() => handleFinishTask(task.id)}>
                                Mark as Complete
                            </button>
                        )}
                        {task.needs_attention && <p style={{ color: 'red' }}>NEEDS ATTENTION!</p>}
                    </li>
                ))}
            </ul>
        </div>
    );
}