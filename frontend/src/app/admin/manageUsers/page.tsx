"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Mail,
    Ban,
    CheckCircle,
    UserSearch,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    Users,
    ChevronDown,
    Briefcase,
    HelpCircle,
    User,
    Settings,
    Shield,
    MessageSquare,
    XCircle,
    Bell,
} from "lucide-react";
import axios from "axios";

interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    profession: string;
    bio: string;
    avatar: string;
    role: string;
    websiteLink: string;
    rankings: string;
    createdAt: string;
    isBanned?: boolean;
    questionCount: number;
    answerCount: number;
}

export default function ManageUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    // Filter to show only users with role "user" (exclude admins)
    const filteredUsers = users.filter((user) => {
        // Only show users with role "user"
        if (user.role !== "user") return false;
        
        const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || 
                            (statusFilter === "active" && !user.isBanned) ||
                            (statusFilter === "banned" && user.isBanned);
        
        return matchesSearch && matchesStatus;
    });

    const paginatedUsers = filteredUsers.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    useEffect(() => {
       const getAllUsers = async () => {
         try {
           const response = await axios.get("http://localhost:5001/api/auth/all-users", {
             withCredentials: true
           });
           const data = response.data;
           console.log(data);
           setUsers(data);
         } catch (error) {
           console.error("Error fetching users:", error);
         }
       }

       getAllUsers();
    }, []);

    const toggleBan = async (id: string) => {
        // Optimistically update UI
        setUsers((prev) =>
            prev.map((user) =>
                user._id === id ? { ...user, isBanned: !user.isBanned } : user
            )
        );
        
        // Call API to update ban status
        try {
            const response = await axios.put(
                `http://localhost:5001/api/auth/ban-user/${id}`,
                {},
                { withCredentials: true }
            );
            console.log("Ban status updated:", response.data);
        } catch (error) {
            console.error("Error updating ban status:", error);
            // Revert optimistic update on error
            setUsers((prev) =>
                prev.map((user) =>
                    user._id === id ? { ...user, isBanned: !user.isBanned } : user
                )
            );
        }
    };

    const sendNotification = (id: string) => {
        // Call API to send notification
        alert(`Notification sent to user ${id}`);
    };

    const sendEmail = (id: string) => {
        // Call API to send email
        alert(`Email sent to user ${id}`);
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 px-6 py-10">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-orange-500 rounded-lg shadow-lg">
                            <UserSearch className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    </div>
                    <p className="text-gray-600">Manage regular users, monitor activity, and control access</p>
                </div>

                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-0">
                        {/* Search and Filter Section */}
                        <div className="p-6 border-b bg-gradient-to-r from-white to-orange-50/50">
                            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                                <div className="flex flex-col md:flex-row gap-4 flex-1">
                                    <div className="relative flex-1 max-w-md">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            placeholder="Search by name..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="pl-10 border-gray-200 focus:border-orange-400 focus:ring-orange-400 bg-white shadow-sm"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="pl-10 pr-8 py-2 border border-gray-200 rounded-md focus:border-orange-400 focus:ring-orange-400 bg-white shadow-sm appearance-none cursor-pointer min-w-[140px]"
                                        >
                                            <option value="all">All Status</option>
                                            <option value="active">Active Users</option>
                                            <option value="banned">Banned Users</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                    <Users className="w-4 h-4" />
                                    <span className="font-medium">{filteredUsers.length}</span>
                                    <span>users found</span>
                                </div>
                            </div>
                        </div>

                        {/* Table Section */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                                        <th className="px-6 py-4 text-left font-semibold">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                Name
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left font-semibold">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                Email
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left font-semibold">
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="w-4 h-4" />
                                                Profession
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left font-semibold">
                                            <div className="flex items-center gap-2">
                                                <HelpCircle className="w-4 h-4" />
                                                Questions
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left font-semibold">
                                            <div className="flex items-center gap-2">
                                                <MessageSquare className="w-4 h-4" />
                                                Answers
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left font-semibold">
                                            <div className="flex items-center gap-2">
                                                <Shield className="w-4 h-4" />
                                                Status
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left font-semibold">
                                            <div className="flex items-center gap-2">
                                                <Settings className="w-4 h-4" />
                                                Actions
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <Users className="w-12 h-12 text-gray-300" />
                                                    <p className="text-gray-500 font-medium">No users found</p>
                                                    <p className="text-gray-400 text-sm">Try adjusting your search or filter criteria</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedUsers.map((user, index) => (
                                            <tr
                                                key={user._id}
                                                className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 transition-all duration-200 ${
                                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                                }`}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-gray-900">{user.name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-gray-700">{user.email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {user.profession}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                            <span className="text-green-700 font-semibold text-sm">{user.questionCount}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                                            <span className="text-purple-700 font-semibold text-sm">{user.answerCount}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {user.isBanned ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                                                <XCircle className="w-3 h-3 mr-1" />
                                                                Banned
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                                Active
                                                            </span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <Button
                                                            onClick={() => toggleBan(user._id)}
                                                            size="sm"
                                                            variant="outline"
                                                            className={`${
                                                                user.isBanned 
                                                                    ? 'text-green-600 border-green-300 hover:bg-green-50 hover:border-green-400' 
                                                                    : 'text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400'
                                                            } transition-all duration-200 shadow-sm hover:shadow-md`}
                                                        >
                                                            {user.isBanned ? (
                                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                            ) : (
                                                                <Ban className="w-4 h-4 mr-1" />
                                                            )}
                                                            {user.isBanned ? "Allow" : "Ban"}
                                                        </Button>
                                                        <Button
                                                            onClick={() => sendNotification(user._id)}
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
                                                        >
                                                            <Bell className="w-4 h-4 mr-1" />
                                                            Notify
                                                        </Button>
                                                        <Button
                                                            onClick={() => sendEmail(user._id)}
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-purple-600 border-purple-300 hover:bg-purple-50 hover:border-purple-400 transition-all duration-200 shadow-sm hover:shadow-md"
                                                        >
                                                            <Mail className="w-4 h-4 mr-1" />
                                                            Email
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {filteredUsers.length > 0 && (
                            <div className="p-6 bg-gradient-to-r from-white to-orange-50/50 border-t">
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-600">
                                        Showing page <span className="font-semibold text-gray-900">{page}</span> of{' '}
                                        <span className="font-semibold text-gray-900">{totalPages}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={page === 1}
                                            onClick={() => setPage(page - 1)}
                                            className="disabled:opacity-40 hover:bg-orange-50 border-orange-200 text-orange-700 shadow-sm"
                                        >
                                            <ChevronLeft className="w-4 h-4 mr-1" />
                                            Previous
                                        </Button>
                                        <div className="flex items-center px-3 py-2 bg-orange-100 text-orange-800 rounded-md font-medium text-sm">
                                            {page} / {totalPages}
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={page === totalPages}
                                            onClick={() => setPage(page + 1)}
                                            className="disabled:opacity-40 hover:bg-orange-50 border-orange-200 text-orange-700 shadow-sm"
                                        >
                                            Next
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
