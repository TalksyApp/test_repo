"use client"

import React from 'react';
import { Bell } from 'lucide-react';

export default function NotificationsPage() {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 animate-in fade-in duration-500">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Bell size={40} className="text-gray-400" />
            </div>
            <h1 className="text-3xl font-black text-white">Signals</h1>
            <p className="text-gray-500 max-w-md">Your notifications channel is quiet... for now.</p>
        </div>
    );
}
