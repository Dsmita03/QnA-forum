/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Settings, 
  Eye,
  Zap,
  BarChart3,
  Clock,
  Shield,
  Database,
  Sparkles
} from 'lucide-react';

type Stat = {
  label: string;
  value: number;
  change?: number;
  icon: React.ReactNode;
  color: string;
};

type Activity = {
  id: number;
  user: string;
  action: string;
  target: string;
  time: string;
  type: 'create' | 'update' | 'delete' | 'login';
  priority: 'low' | 'medium' | 'high';
};

const StatCard = ({ stat, index }: { stat: Stat; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    <Card className={`relative overflow-hidden group hover:shadow-lg transition-all duration-300 ${stat.color}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
      <CardContent className="p-6 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-white/20 backdrop-blur-sm`}>
            {stat.icon}
          </div>
          {stat.change && (
            <Badge 
              variant={stat.change > 0 ? "default" : "destructive"}
              className="text-xs font-medium"
            >
              {stat.change > 0 ? '+' : ''}{stat.change}%
            </Badge>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-white/80">{stat.label}</p>
          <p className="text-3xl font-bold text-white">{stat.value.toLocaleString()}</p>
        </div>
        <div className="absolute -bottom-2 -right-2 opacity-10 group-hover:opacity-20 transition-opacity">
          <div className="text-6xl">
            {stat.icon}
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const ActivityItem = ({ activity, index }: { activity: Activity; index: number }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create': return <Sparkles className="w-4 h-4 text-green-500" />;
      case 'update': return <Settings className="w-4 h-4 text-blue-500" />;
      case 'delete': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'login': return <Shield className="w-4 h-4 text-purple-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group p-4 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 transition-all duration-200 border-l-4 border-transparent hover:border-orange-400"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-start space-x-3">
          <div className="mt-1">
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-semibold text-gray-900">{activity.user}</span>
              <Badge className={`text-xs px-2 py-0.5 ${getPriorityColor(activity.priority)}`}>
                {activity.priority}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1">{activity.action}</p>
            <p className="text-xs text-gray-500">Target: {activity.target}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 mb-1">{activity.time}</p>
          <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Eye className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default function AdminPage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [statsRes, activitiesRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/activities'),
        ]);

        const [statsData, activitiesData] = await Promise.all([
          statsRes.json(),
          activitiesRes.json(),
        ]);

        // Enhanced stats with icons and colors
        const enhancedStats = statsData.map((stat: any, index: number) => ({
          ...stat,
          change: Math.floor(Math.random() * 20) - 10, // Mock change data
          icon: [
            // eslint-disable-next-line react/jsx-key
            <Users className="w-6 h-6 text-white" />,
            // eslint-disable-next-line react/jsx-key
            <BarChart3 className="w-6 h-6 text-white" />,
            // eslint-disable-next-line react/jsx-key
            <TrendingUp className="w-6 h-6 text-white" />,
            // eslint-disable-next-line react/jsx-key
            <Database className="w-6 h-6 text-white" />
          ][index % 4],
          color: [
            'bg-gradient-to-br from-blue-500 to-blue-600',
            'bg-gradient-to-br from-purple-500 to-purple-600',
            'bg-gradient-to-br from-green-500 to-green-600',
            'bg-gradient-to-br from-orange-500 to-orange-600'
          ][index % 4]
        }));

        // Enhanced activities with types and priorities
        const enhancedActivities = activitiesData.map((activity: any) => ({
          ...activity,
          type: ['create', 'update', 'delete', 'login'][Math.floor(Math.random() * 4)],
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
        }));

        setStats(enhancedStats);
        setActivities(enhancedActivities);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-orange-600 bg-clip-text text-transparent mb-2">
                Admin Command Center
              </h1>
              <p className="text-gray-600">Monitor, manage, and maintain your platform</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">System Online</span>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-500">Loading dashboard...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <StatCard key={stat.label} stat={stat} index={index} />
              ))}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="overflow-hidden shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                    <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <Clock className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
                            <p className="text-sm text-gray-500">Latest system events</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="hover:bg-orange-50">
                          <Eye className="w-4 h-4 mr-2" />
                          View All
                        </Button>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <AnimatePresence>
                        {activities.map((activity, index) => (
                          <ActivityItem key={activity.id} activity={activity} index={index} />
                        ))}
                      </AnimatePresence>
                    </div>
                  </Card>
                </motion.div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="p-6 bg-gradient-to-br from-orange-500 to-pink-500 text-white shadow-lg">
                    <div className="flex items-center space-x-3 mb-4">
                      <Zap className="w-6 h-6" />
                      <h3 className="text-lg font-bold">Quick Actions</h3>
                    </div>
                    <div className="space-y-3">
                      <Button 
                        className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
                        variant="outline"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Manage Users
                      </Button>
                      <Button 
                        className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
                        variant="outline"
                      >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Review Flags
                      </Button>
                      <Button 
                        className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
                        variant="outline"
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analytics
                      </Button>
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="p-6 bg-white shadow-lg">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">System Health</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Server Status</span>
                        <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Database</span>
                        <Badge className="bg-green-100 text-green-800">Connected</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">API Response</span>
                        <Badge className="bg-yellow-100 text-yellow-800">245ms</Badge>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
