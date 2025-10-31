"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthSession } from "@/hooks/useAuthSession";
import {
  Activity,
  Award,
  BarChart3,
  DollarSign,
  Edit,
  Eye,
  MessageCircle,
  MoreHorizontal,
  PieChart,
  Plus,
  Settings,
  Star,
  TrendingUp,
  Upload,
  Users
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function CreatorDashboard() {
  const { data: session, status } = useAuthSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // Dynamic data based on session
  const creatorData = {
    profile: {
      name: session?.user?.name || "Creator",
      title: "Digital Creator", // This would come from user profile in real app
      avatar: session?.user?.image || "",
      coverImage: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&h=200&fit=crop",
      university: "University", // This would come from user profile
      major: "Digital Arts", // This would come from user profile
      memberSince: "Recently joined",
      isVerified: false, // This would be based on verification status
      rating: 0, // This would be calculated from reviews
      reviewCount: 0,
      totalEarnings: 0, // This would come from earnings data
      activeProjects: 0, // This would be calculated from projects
      completedOrders: 0, // This would come from order history
    }
  };

  // Empty state for projects and orders (would be fetched from database)
  const projects: any[] = [];
  const recentOrders: any[] = [];

  const analytics = {
    thisMonth: {
      earnings: 0,
      orders: 0,
      views: 0,
      conversionRate: 0
    },
    lastMonth: {
      earnings: 0,
      orders: 0,
      views: 0,
      conversionRate: 0
    }
  };

  const hasRedirected = useRef(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated" && session?.user?.role !== "CREATOR" && !hasRedirected.current) {
      console.log('🔄 Redirecting NON-CREATOR away from creator dashboard');
      hasRedirected.current = true;
      router.push("/dashboard");
    }
  }, [status, router, session?.user?.role]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session || session.user?.role !== "CREATOR") {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "draft": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "paused": return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "in-progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "delivered": return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const earningsGrowth = ((analytics.thisMonth.earnings - analytics.lastMonth.earnings) / analytics.lastMonth.earnings * 100).toFixed(1);
  const ordersGrowth = ((analytics.thisMonth.orders - analytics.lastMonth.orders) / analytics.lastMonth.orders * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Image */}
      <div className="h-48 bg-linear-to-r from-blue-600 via-indigo-500 to-purple-500 relative">
        <img
          src={creatorData.profile.coverImage}
          alt="Cover"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-linear-to-r from-blue-600/20 via-indigo-500/20 to-purple-500/20" />
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Sidebar */}
          <div className="lg:w-80">
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar className="w-24 h-24 mb-4 ring-4 ring-background">
                    <AvatarImage src={creatorData.profile.avatar} alt={creatorData.profile.name} />
                    <AvatarFallback>{creatorData.profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-xl">{creatorData.profile.name}</h3>
                    {creatorData.profile.isVerified && (
                      <Award className="h-5 w-5 text-blue-500 fill-blue-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{creatorData.profile.title}</p>
                  <p className="text-xs text-muted-foreground">{creatorData.profile.university}</p>
                  <p className="text-xs text-muted-foreground">{creatorData.profile.major}</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{creatorData.profile.rating}</span>
                      <span className="text-sm text-muted-foreground">({creatorData.profile.reviewCount})</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Earnings</span>
                    <span className="font-bold text-green-600">${creatorData.profile.totalEarnings.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Projects</span>
                    <span className="font-medium">{creatorData.profile.activeProjects}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Completed Orders</span>
                    <span className="font-medium">{creatorData.profile.completedOrders}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" asChild>
                    <Link href="/projects/create">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Project
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/profile">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Earnings</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${analytics.thisMonth.earnings}</div>
                    <div className="text-xs text-green-600">+{earningsGrowth}%</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Orders</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{analytics.thisMonth.orders}</div>
                    <div className="text-xs text-green-600">+{ordersGrowth}%</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Views</span>
                  </div>
                  <div className="font-bold">{analytics.thisMonth.views.toLocaleString()}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Creator Dashboard</h1>
              <p className="text-muted-foreground">Manage your projects, track earnings, and grow your creative business.</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="projects">My Projects</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Performance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">This Month Earnings</p>
                          <p className="text-2xl font-bold text-green-600">${analytics.thisMonth.earnings}</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-green-500" />
                      </div>
                      <div className="mt-2">
                        <Progress value={75} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">75% of monthly goal</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Active Orders</p>
                          <p className="text-2xl font-bold">{recentOrders.filter(o => o.status === 'in-progress').length}</p>
                        </div>
                        <Users className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Views</p>
                          <p className="text-2xl font-bold">{projects.reduce((sum, p) => sum + p.views, 0).toLocaleString()}</p>
                        </div>
                        <Eye className="h-8 w-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Conversion Rate</p>
                          <p className="text-2xl font-bold">{analytics.thisMonth.conversionRate}%</p>
                        </div>
                        <BarChart3 className="h-8 w-8 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Recent Orders</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setActiveTab("orders")}>
                        View All
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentOrders.slice(0, 3).map((order) => (
                          <div key={order.id} className="flex items-center space-x-4">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={order.buyerAvatar} alt={order.buyer} />
                              <AvatarFallback>{order.buyer[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{order.projectTitle}</p>
                              <p className="text-xs text-muted-foreground">by {order.buyer}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold">${order.amount}</p>
                              <Badge className={`${getStatusColor(order.status)} text-xs`}>
                                {order.status.replace('-', ' ')}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Top Performing Projects</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setActiveTab("projects")}>
                        View All
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {projects
                          .filter((p: any) => p.status === 'active')
                          .sort((a: any, b: any) => b.earnings - a.earnings)
                          .slice(0, 3)
                          .map((project: any) => (
                            <Link key={project.id} href={`/projects/${project.id}`} className="flex items-center space-x-4 hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors">
                              <img src={project.image} alt={project.title} className="w-12 h-12 rounded-lg object-cover" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{project.title}</p>
                                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                  <span>{project.orders} orders</span>
                                  <span>•</span>
                                  <span>{project.views} views</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-green-600">${project.earnings}</p>
                              </div>
                            </Link>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Projects Tab */}
              <TabsContent value="projects" className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex gap-2">
                    <Link href="/projects/create">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Project
                      </Button>
                    </Link>
                  </div>
                  <Input placeholder="Search projects..." className="max-w-xs" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {projects.map((project: any) => (
                    <Card key={project.id} className="hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img src={project.image} alt={project.title} className="w-full h-48 object-cover rounded-t-lg" />
                        <div className="absolute top-4 left-4">
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4">
                          <Button variant="ghost" size="icon" className="bg-background/80 hover:bg-background">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {project.tags.map((tag: string) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-center text-sm">
                            <div>
                              <p className="font-bold">{project.views.toLocaleString()}</p>
                              <p className="text-muted-foreground">Views</p>
                            </div>
                            <div>
                              <p className="font-bold">{project.orders}</p>
                              <p className="text-muted-foreground">Orders</p>
                            </div>
                            <div>
                              <p className="font-bold text-green-600">${project.earnings}</p>
                              <p className="text-muted-foreground">Earned</p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-4 border-t">
                            <span className="font-bold text-lg">${project.price}</span>
                            <div className="flex space-x-2">
                              <Link href={`/projects/${project.id}/edit`}>
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/projects/${project.id}`}>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-6">
                <div className="space-y-4">
                  {recentOrders.map((order: any) => (
                    <Card key={order.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={order.buyerAvatar} alt={order.buyer} />
                              <AvatarFallback>{order.buyer[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{order.projectTitle}</h4>
                              <p className="text-sm text-muted-foreground">Ordered by {order.buyer}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(order.orderDate).toLocaleDateString()} • Due {new Date(order.deliveryDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">${order.amount}</div>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.replace('-', ' ')}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                          <Link href={`/messages?user=${order.buyer}`}>
                            <Button variant="outline" size="sm">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Message
                            </Button>
                          </Link>
                          {order.status === 'in-progress' && (
                            <Button size="sm" onClick={() => {
                              // Placeholder for deliver work functionality
                              alert(`Deliver work for order ${order.id} - This would open a delivery modal`);
                            }}>
                              <Upload className="h-4 w-4 mr-2" />
                              Deliver Work
                            </Button>
                          )}
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
                        Earnings Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>This Month</span>
                          <span className="font-bold text-green-600">${analytics.thisMonth.earnings}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Last Month</span>
                          <span className="font-bold">${analytics.lastMonth.earnings}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Growth</span>
                          <span className="font-bold text-green-600">+{earningsGrowth}%</span>
                        </div>
                        <Progress value={75} className="h-3" />
                        <p className="text-sm text-muted-foreground">On track to exceed last month by 26%</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        Project Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {projects.filter(p => p.status === 'active').map((project, index) => (
                          <div key={project.id} className="flex justify-between items-center">
                            <span className="text-sm truncate">{project.title}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-muted rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full"
                                  style={{ width: `${(project.earnings / Math.max(...projects.map(p => p.earnings))) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium w-12 text-right">${project.earnings}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Key Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{analytics.thisMonth.conversionRate}%</div>
                        <div className="text-sm text-muted-foreground">Conversion Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">${(analytics.thisMonth.earnings / analytics.thisMonth.orders).toFixed(0)}</div>
                        <div className="text-sm text-muted-foreground">Avg Order Value</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{projects.filter(p => p.status === 'active').length}</div>
                        <div className="text-sm text-muted-foreground">Active Projects</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{creatorData.profile.rating}</div>
                        <div className="text-sm text-muted-foreground">Avg Rating</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
