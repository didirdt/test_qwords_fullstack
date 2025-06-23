
import React from 'react';
import { Link } from '@inertiajs/react';

export default function AppLayout({ children }) {
    return (
        <div>
            <nav>
                <Link href="/tasks">Tasks</Link> | 
                <Link href="/tasks/reminder">Reminders</Link> | 
                <Link href="/logout">Logout</Link>
            </nav>
            <main>{children}</main>
        </div>
    );
}