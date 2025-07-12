'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
 

const mockStats = [
  { label: 'Total Users', value: 1580 },
  { label: 'Questions Posted', value: 425 },
  { label: 'Answers Submitted', value: 1190 },
  { label: 'Pending Reviews', value: 16 },
];

const recentActivities = [
  {
    id: 1,
    user: 'johndoe',
    action: 'Posted a new question',
    target: 'How to optimize React performance?',
    time: '2 hours ago',
  },
  {
    id: 2,
    user: 'alice_dev',
    action: 'Answered a question',
    target: 'What is useEffect in React?',
    time: '5 hours ago',
  },
  {
    id: 3,
    user: 'admin',
    action: 'Flagged a spam answer',
    target: 'Cheap SEO links offer',
    time: '1 day ago',
  },
];

export default function AdminPage() {
  const [stats] = useState(mockStats);

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      <h1 className="text-3xl font-bold text-gray-800">🔧 Admin Dashboard</h1>

      {/* Stats Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-gradient-to-br from-white to-orange-50 shadow-sm border border-orange-100">
            <CardContent className="p-5 space-y-2">
              <div className="text-sm text-gray-500">{stat.label}</div>
              <div className="text-2xl font-bold text-orange-600">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Recent Activity */}
      <section className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">🕒 Recent Activity</h2>
          <Button size="sm" variant="outline">View All</Button>
        </div>
        <div className="divide-y">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="px-5 py-4 hover:bg-gray-50 flex justify-between items-center">
              <div className="space-y-1">
                <div className="text-sm text-gray-800">
                  <strong className="text-orange-600">{activity.user}</strong> {activity.action}
                </div>
                <div className="text-sm text-gray-500">Target: {activity.target}</div>
              </div>
              <div className="text-xs text-gray-400">{activity.time}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Actions */}
      <section className="flex flex-wrap gap-4">
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">Manage Users</Button>
        <Button variant="outline">Review Flags</Button>
        <Button variant="ghost">Settings</Button>
      </section>
    </main>
  );
}
