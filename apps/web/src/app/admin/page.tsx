"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Edit,
  Eye,
  Flag,
  FolderOpen,
  MessageSquare,
  MoreHorizontal,
  Settings,
  Shield,
  TrendingUp,
  Users,
  XCircle
} from "lucide-react";
import { useState } from "react";

// Mock admin dashboard data
const dashboardStats = {
  totalUsers: 50432,
  activeProjects: 8234,
  monthlyRevenue: 284567,
  pendingReviews: 127,
  userGrowth: 12.5,
  revenueGrowth: 8.3,
  projectGrowth: 15.2,
};

const recentUsers = [
  {
    id: "user-1",
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b635?w=32&h=32&fit=crop&crop=face",
    type: "creator",
    status: "active",
    joinDate: "2024-10-20",
    totalEarnings: 2847,
    projects: 12,
  },
  {
    id: "user-2",
    name: "John Anderson",
    email: "john.anderson@email.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
    type: "customer",
    status: "active",
    joinDate: "2024-10-19",
    totalSpent: 1456,
    orders: 8,
  },
  {
    id: "user-3",
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
    type: "creator",
    status: "pending",
    joinDate: "2024-10-18",
    totalEarnings: 0,
    projects: 0,
  }
];

const pendingProjects = [
  {
    id: "proj-1",
    title: "E-commerce Website Design",
    creator: "Sarah Chen",
    creatorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b635?w=32&h=32&fit=crop&crop=face",
    category: "Web Design",
    price: 299,
    submittedDate: "2024-10-22",
    status: "pending",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=120&fit=crop",
  },
  {
    id: "proj-2",
    title: "Mobile App UI Kit",
    creator: "Alex Rivera",
    creatorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
    category: "Mobile Design",
    price: 199,
    submittedDate: "2024-10-21",
    status: "under-review",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=200&h=120&fit=crop",
  }
];

const reportedContent = [
  {
    id: "report-1",
    type: "project",
    title: "Suspicious Project Content",
    reporter: "John Doe",
    reportedUser: "Unknown User",
    reason: "Copyright infringement",
    date: "2024-10-22",
    status: "open",
    severity: "high",
  },
  {
    id: "report-2",
    type: "user",
    title: "Inappropriate Behavior",
    reporter: "Jane Smith",
    reportedUser: "Problem User",
    reason: "Harassment",
    date: "2024-10-21",
    status: "investigating",
    severity: "medium",
  }
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("overview");
  const [userFilter, setUserFilter] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "suspended": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "approved": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "rejected": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "under-review": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "open": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "investigating": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "resolved": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage users, projects, and platform operations</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Platform Settings
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Users</p>
                      <p className="text-2xl font-bold">{dashboardStats.totalUsers.toLocaleString()}</p>
                      <p className="text-xs text-green-600">+{dashboardStats.userGrowth}% this month</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Projects</p>
                      <p className="text-2xl font-bold">{dashboardStats.activeProjects.toLocaleString()}</p>
                      <p className="text-xs text-green-600">+{dashboardStats.projectGrowth}% this month</p>
                    </div>
                    <FolderOpen className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                      <p className="text-2xl font-bold">${dashboardStats.monthlyRevenue.toLocaleString()}</p>
                      <p className="text-xs text-green-600">+{dashboardStats.revenueGrowth}% this month</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pending Reviews</p>
                      <p className="text-2xl font-bold">{dashboardStats.pendingReviews}</p>
                      <p className="text-xs text-red-600">Requires attention</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Users</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("users")}>
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUsers.slice(0, 3).map((user) => (
                      <div key={user.id} className="flex items-center space-x-4">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {user.type}
                            </Badge>
                            <Badge className={`${getStatusColor(user.status)} text-xs`}>
                              {user.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {user.type === 'creator' ? `$${user.totalEarnings}` : `$${user.totalSpent}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user.type === 'creator' ? `${user.projects} projects` : `${user.orders} orders`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Pending Projects</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("projects")}>
                    Review All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingProjects.map((project) => (
                      <div key={project.id} className="flex items-center space-x-4">
                        <img src={project.image} alt={project.title} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{project.title}</p>
                          <p className="text-xs text-muted-foreground">by {project.creator}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {project.category}
                            </Badge>
                            <Badge className={`${getStatusColor(project.status)} text-xs`}>
                              {project.status.replace('-', ' ')}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">${project.price}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(project.submittedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Server Uptime</span>
                      <span className="text-sm font-medium">99.9%</span>
                    </div>
                    <Progress value={99.9} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Database Performance</span>
                      <span className="text-sm font-medium">95.2%</span>
                    </div>
                    <Progress value={95.2} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">API Response Time</span>
                      <span className="text-sm font-medium">120ms avg</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex gap-2">
                <Button
                  variant={userFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUserFilter("all")}
                >
                  All Users
                </Button>
                <Button
                  variant={userFilter === "creators" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUserFilter("creators")}
                >
                  Creators
                </Button>
                <Button
                  variant={userFilter === "customers" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUserFilter("customers")}
                >
                  Customers
                </Button>
                <Button
                  variant={userFilter === "pending" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUserFilter("pending")}
                >
                  Pending Approval
                </Button>
              </div>
              <Input placeholder="Search users..." className="max-w-xs" />
            </div>

            <div className="space-y-4">
              {recentUsers.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{user.name}</h4>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline">
                              {user.type}
                            </Badge>
                            <Badge className={getStatusColor(user.status)}>
                              {user.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Joined {new Date(user.joinDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                          <div>
                            <p className="text-muted-foreground">
                              {user.type === 'creator' ? 'Earnings' : 'Spent'}
                            </p>
                            <p className="font-bold">
                              ${user.type === 'creator' ? user.totalEarnings : user.totalSpent}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              {user.type === 'creator' ? 'Projects' : 'Orders'}
                            </p>
                            <p className="font-bold">
                              {user.type === 'creator' ? user.projects : user.orders}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Project Moderation</h2>
              <Input placeholder="Search projects..." className="max-w-xs" />
            </div>

            <div className="space-y-4">
              {pendingProjects.map((project) => (
                <Card key={project.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <img src={project.image} alt={project.title} className="w-32 h-24 rounded-lg object-cover" />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
                            <div className="flex items-center space-x-2 mb-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={project.creatorAvatar} alt={project.creator} />
                                <AvatarFallback>{project.creator[0]}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-muted-foreground">by {project.creator}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{project.category}</Badge>
                              <Badge className={getStatusColor(project.status)}>
                                {project.status.replace('-', ' ')}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-xl">${project.price}</div>
                            <div className="text-sm text-muted-foreground">
                              Submitted {new Date(project.submittedDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Pending for {Math.floor((Date.now() - new Date(project.submittedDate).getTime()) / (1000 * 60 * 60 * 24))} days</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Review
                            </Button>
                            <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Content Reports & Moderation</h2>
              <Input placeholder="Search reports..." className="max-w-xs" />
            </div>

            <div className="space-y-4">
              {reportedContent.map((report) => (
                <Card key={report.id}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold mb-1">{report.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Reported by {report.reporter} against {report.reportedUser}
                          </p>
                          <p className="text-sm"><strong>Reason:</strong> {report.reason}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline" className="capitalize">
                              {report.type}
                            </Badge>
                            <Badge className={getStatusColor(report.status)}>
                              {report.status}
                            </Badge>
                            <Badge className={getSeverityColor(report.severity)}>
                              {report.severity} priority
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {new Date(report.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Flag className="h-4 w-4" />
                          <span>Case #{report.id.toUpperCase()}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Contact Reporter
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Investigate
                          </Button>
                          <Button size="sm">
                            Take Action
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Platform Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>User Growth</span>
                      <span className="font-bold text-green-600">+{dashboardStats.userGrowth}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Revenue Growth</span>
                      <span className="font-bold text-green-600">+{dashboardStats.revenueGrowth}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Project Growth</span>
                      <span className="font-bold text-green-600">+{dashboardStats.projectGrowth}%</span>
                    </div>
                    <Progress value={85} className="h-3" />
                    <p className="text-sm text-muted-foreground">Platform health: Excellent</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Key Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">94.2%</div>
                      <div className="text-sm text-muted-foreground">User Satisfaction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">2.3%</div>
                      <div className="text-sm text-muted-foreground">Conversion Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">$187</div>
                      <div className="text-sm text-muted-foreground">Avg Transaction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">8.5</div>
                      <div className="text-sm text-muted-foreground">Days Avg Response</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Platform Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-medium">User Distribution</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Creators</span>
                        <span className="text-sm font-medium">65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                      <div className="flex justify-between">
                        <span className="text-sm">Customers</span>
                        <span className="text-sm font-medium">35%</span>
                      </div>
                      <Progress value={35} className="h-2" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium">Top Categories</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Web Design</span>
                        <span className="font-medium">2,847 projects</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Branding</span>
                        <span className="font-medium">1,923 projects</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Development</span>
                        <span className="font-medium">1,456 projects</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium">Revenue Sources</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Platform Fees</span>
                        <span className="font-medium">$28,456</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Premium Features</span>
                        <span className="font-medium">$12,847</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Advertising</span>
                        <span className="font-medium">$8,234</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}