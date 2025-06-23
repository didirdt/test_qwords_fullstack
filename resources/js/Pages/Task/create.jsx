import React, { useState } from 'react';
import axios from 'axios';
import { Link } from '@inertiajs/react';

export default function CreateTask({ token }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        deadline_date: '',
        priority: 'medium'
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/tasks', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            window.location.href = '/tasks';
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating task');
        }
    };

    return (
        <div>
            <h2>Create New Task</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input 
                        type="text" 
                        name="title" 
                        value={formData.title} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div>
                    <label>Deadline Date (dd/mm/yyyy):</label>
                    <input 
                        type="text" 
                        name="deadline_date" 
                        value={formData.deadline_date} 
                        onChange={handleChange} 
                        placeholder="dd/mm/yyyy"
                        required 
                    />
                </div>
                <div>
                    <label>Priority:</label>
                    <select 
                        name="priority" 
                        value={formData.priority} 
                        onChange={handleChange}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <button type="submit">Create Task</button>
            </form>
            <Link href="/tasks">Back to Tasks</Link>
        </div>
    );
}