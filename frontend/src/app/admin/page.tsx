/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useRouter } from 'next/navigation'; 
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import QuestionCard from '@/components/QuestionCard';
import { useAppStore } from '@/store';
import axios from 'axios';
import { 
  Users, 
  AlertTriangle, 
  Settings, 
  Eye,
  Zap,
  BarChart3,
  Clock,
  Shield,
  Search,
  Filter,
  MessageSquare,
  TrendingUp,
  LogOut
} from 'lucide-react';

type Question = {
  id: string;
  title: string;
  answersCount: number;
  tags: string[];
  username: string;
  createdAt: string;
  views: number;
};

export default function AdminPage() {
  // ALL HOOKS MUST BE DECLARED FIRST
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [totalUsers, setTotalUsers] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();
  
  // Get user data from store
  const { user, isAuthenticated, setUser } = useAppStore();

  // Modified Logout function using localStorage
  const handleLogout = () => {
    try {
      setLoggingOut(true);
      
      // Remove token from localStorage
      localStorage.removeItem("token");
      
      // Clear user data using setUser with proper structure
      setUser({
        name: "",
        email: "",
        role: undefined,
        userId: "",
        isLoggedIn: false,
        profileImage: "/profile.png",
      });
      
      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  // Authentication check useEffect
  useEffect(() => {
    if (!isAuthenticated() || user.role !== 'admin') {
      router.push('/login');
      return;
    }
  }, [user, isAuthenticated, router]);

  // Data fetching useEffect
  useEffect(() => {
    const fetchData = async () => {
      // Only fetch if authenticated and admin
      if (!isAuthenticated() || user.role !== 'admin') {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch questions
        const questionsRes = await axios.get("http://localhost:5001/api/questions", 
          { withCredentials: true });

        const formattedQuestions = questionsRes.data.map((q: any) => ({
          id: q._id,
          title: q.title,
          answersCount: q.answers ? q.answers.length : 0,
          tags: q.tags || [],
          username: q.user.email || "anonymous",
          createdAt: q.createdAt,
          views: q.views || 0,
        }));

        setQuestions(formattedQuestions);

        // Fetch users count
        try {
          const usersRes = await axios.get("http://localhost:5001/api/admin/users/count", 
            { withCredentials: true });
          setTotalUsers(usersRes.data.count || 0);
        } catch (userError) {
          console.warn('Could not fetch users count:', userError);
          setTotalUsers(0);
        }

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user.role]);

  // Filter and sort questions
  const filteredQuestions = questions.filter((question) => {
    if (!searchTerm.trim()) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      question.title.toLowerCase().includes(searchLower) ||
      question.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
      question.username.toLowerCase().includes(searchLower)
    );
  });

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.answersCount - a.answersCount;
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "most-viewed":
        return b.views - a.views;
      case "unanswered":
        if (a.answersCount === 0 && b.answersCount > 0) return -1;
        if (a.answersCount > 0 && b.answersCount === 0) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const sortOptions = [
    { value: "latest", label: "Latest", icon: Clock },
    { value: "newest", label: "Newest", icon: TrendingUp },
    { value: "oldest", label: "Oldest", icon: Clock },
    { value: "popular", label: "Most Popular", icon: TrendingUp },
    { value: "most-viewed", label: "Most Viewed", icon: Eye },
    { value: "unanswered", label: "Unanswered", icon: MessageSquare },
  ];

  // Early return AFTER all hooks
  if (!isAuthenticated() || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Checking permissions...</p>
        </div>
      </div>
    );
  }

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
              {/* Logout Button */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                disabled={loggingOut}
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                {loggingOut ? (
                  <div className="flex items-center">
                    <div className="animate-spin w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full mr-2"></div>
                    Logging out...
                  </div>
                ) : (
                  <>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-500">Loading dashboard...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* All Posts Section */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="overflow-hidden shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                    <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <MessageSquare className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-gray-800">All Posts</h2>
                            <p className="text-sm text-gray-500">
                              Monitor community questions ({sortedQuestions.length} total)
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Search and Filter Controls */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            placeholder="Search posts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-white border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                          />
                        </div>
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger className="w-full sm:w-48 bg-white border-gray-200 focus:border-orange-500">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Sort by" />
                          </SelectTrigger>
                          <SelectContent>
                            {sortOptions.map((option) => {
                              const IconComponent = option.icon;
                              return (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="flex items-center space-x-2">
                                    <IconComponent className="w-4 h-4" />
                                    <span>{option.label}</span>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Questions List */}
                    <div className="max-h-[600px] overflow-y-auto">
                      {searchTerm.trim() && (
                        <div className="bg-orange-50 border-b border-orange-200 p-4">
                          <p className="text-orange-800 text-sm font-medium">
                            {filteredQuestions.length > 0
                              ? `Found ${filteredQuestions.length} result${filteredQuestions.length !== 1 ? "s" : ""} for "${searchTerm}"`
                              : `No results found for "${searchTerm}"`}
                          </p>
                        </div>
                      )}
                      
                      <div className="p-4 space-y-4">
                        <AnimatePresence>
                          {sortedQuestions.length > 0 ? (
                            sortedQuestions.map((question, index) => (
                              <motion.div
                                key={question.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <QuestionCard
                                  id={question.id}
                                  title={question.title}
                                  answersCount={question.answersCount}
                                  tags={question.tags}
                                  username={question.username}
                                  createdAt={question.createdAt}
                                  views={question.views}
                                />
                              </motion.div>
                            ))
                          ) : (
                            <div className="text-center py-12">
                              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-500">
                                {searchTerm.trim() ? "No posts match your search" : "No posts available"}
                              </p>
                              {searchTerm.trim() && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSearchTerm("")}
                                  className="mt-2"
                                >
                                  Clear Search
                                </Button>
                              )}
                            </div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
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
                        onClick={() => router.push('/admin/manageUsers')}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Manage Users
                      </Button>
                      <Button 
                        className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
                        variant="outline"
                        onClick={() => router.push('/admin/flags')}
                      >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Review Flags
                      </Button>
                      <Button 
                        className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
                        variant="outline"
                        onClick={() => router.push('/admin/analytics')}
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analytics
                      </Button>
                    </div>
                  </Card>
                </motion.div>

                {/* System Health */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="p-6 bg-white shadow-lg">
                    <div className="flex items-center space-x-3 mb-4">
                      <Shield className="w-5 h-5 text-gray-700" />
                      <h3 className="text-lg font-bold text-gray-800">System Health</h3>
                    </div>
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
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Active Users</span>
                        <Badge className="bg-blue-100 text-blue-800">{Math.floor(totalUsers * 0.1)}</Badge>
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
