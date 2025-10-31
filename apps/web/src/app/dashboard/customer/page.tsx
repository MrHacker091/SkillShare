"use client";

import { CreatorUpgradeForm } from "@/components/CreatorUpgradeForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  CreditCard,
  Download,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Search,
  Settings,
  ShoppingBag,
  Star,
  User
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock data for customer dashboard
const customerData = {
  profile: {
    name: "John Anderson",
    email: "john.anderson@email.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face",
    memberSince: "March 2024",
    totalSpent: 2847,
    projectsOwned: 12,
    favoriteCreators: 8,
  }
};

const orders = [
  {
    id: "ORD-001",
    projectTitle: "Modern E-commerce Website Design",
    creator: {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b635?w=32&h=32&fit=crop&crop=face",
    },
    amount: 299,
    status: "completed",
    orderDate: "2024-10-20",
    deliveryDate: "2024-10-25",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=120&fit=crop",
    rating: 5,
  },
  {
    id: "ORD-002",
    projectTitle: "Brand Identity Package",
    creator: {
      name: "Marcus Johnson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
    },
    amount: 399,
    status: "in-progress",
    orderDate: "2024-10-22",
    deliveryDate: "2024-10-28",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=120&fit=crop",
  },
  {
    id: "ORD-003",
    projectTitle: "Social Media Content Pack",
    creator: {
      name: "Emma Thompson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
    },
    amount: 149,
    status: "delivered",
    orderDate: "2024-10-18",
    deliveryDate: "2024-10-20",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=120&fit=crop",
    rating: 4,
  },
];

const favorites = [
  {
    id: "fav-1",
    type: "project",
    title: "React Dashboard Application",
    creator: "Alex Rivera",
    price: 599,
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=200&h=120&fit=crop",
    rating: 4.9,
    addedDate: "2024-10-15"
  },
  {
    id: "fav-2",
    type: "creator",
    name: "Maya Singh",
    title: "Full Stack Developer",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b635?w=64&h=64&fit=crop&crop=face",
    rating: 4.8,
    projects: 23,
    addedDate: "2024-10-12"
  },
  {
    id: "fav-3",
    type: "project",
    title: "Mobile App UI Design",
    creator: "Carlos Rodriguez",
    price: 399,
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=200&h=120&fit=crop",
    rating: 4.7,
    addedDate: "2024-10-10"
  },
];

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [orderFilter, setOrderFilter] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "in-progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "delivered": return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const filteredOrders = orderFilter === "all" ? orders : orders.filter(order => order.status === orderFilter);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80">
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={customerData.profile.avatar} alt={customerData.profile.name} />
                    <AvatarFallback>{customerData.profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{customerData.profile.name}</h3>
                    <p className="text-sm text-muted-foreground">{customerData.profile.email}</p>
                    <p className="text-xs text-muted-foreground">Member since {customerData.profile.memberSince}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">{customerData.profile.projectsOwned}</div>
                    <div className="text-xs text-muted-foreground">Projects Owned</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">${customerData.profile.totalSpent.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Total Spent</div>
                  </div>
                </div>

                <Button variant="outline" className="w-full mb-4">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-2">
                <Link href="/projects">
                  <Button variant="ghost" className="w-full justify-start">
                    <Search className="h-4 w-4 mr-2" />
                    Browse Projects
                  </Button>
                </Link>
                <Link href="/creators">
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Find Creators
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Messages
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment Methods
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {customerData.profile.name}! Here's what's happening with your projects.</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="orders">My Orders</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Creator Upgrade Section */}
                <CreatorUpgradeForm />

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Active Orders</p>
                          <p className="text-2xl font-bold">3</p>
                        </div>
                        <ShoppingBag className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Favorites</p>
                          <p className="text-2xl font-bold">{favorites.length}</p>
                        </div>
                        <Heart className="h-8 w-8 text-red-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">This Month</p>
                          <p className="text-2xl font-bold">$698</p>
                        </div>
                        <CreditCard className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Orders */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Orders</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("orders")}>
                      View All
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                          <img src={order.image} alt={order.projectTitle} className="w-16 h-16 rounded-lg object-cover" />
                          <div className="flex-1">
                            <h4 className="font-medium">{order.projectTitle}</h4>
                            <p className="text-sm text-muted-foreground">by {order.creator.name}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={getStatusColor(order.status)}>
                                {order.status.replace('-', ' ')}
                              </Badge>
                              <span className="text-sm text-muted-foreground">${order.amount}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <div className="flex gap-2">
                    <Button
                      variant={orderFilter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setOrderFilter("all")}
                    >
                      All Orders
                    </Button>
                    <Button
                      variant={orderFilter === "in-progress" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setOrderFilter("in-progress")}
                    >
                      In Progress
                    </Button>
                    <Button
                      variant={orderFilter === "completed" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setOrderFilter("completed")}
                    >
                      Completed
                    </Button>
                  </div>
                  <Input placeholder="Search orders..." className="max-w-xs" />
                </div>

                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          <img src={order.image} alt={order.projectTitle} className="w-full lg:w-48 h-32 rounded-lg object-cover" />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="font-semibold text-lg mb-1">{order.projectTitle}</h3>
                                <div className="flex items-center space-x-2 mb-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage src={order.creator.avatar} alt={order.creator.name} />
                                    <AvatarFallback>{order.creator.name[0]}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm text-muted-foreground">by {order.creator.name}</span>
                                </div>
                              </div>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status.replace('-', ' ')}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Order Date</p>
                                <p className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Delivery Date</p>
                                <p className="font-medium">{new Date(order.deliveryDate).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Amount</p>
                                <p className="font-medium">${order.amount}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Order ID</p>
                                <p className="font-medium font-mono">{order.id}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center space-x-2">
                                {order.rating && (
                                  <div className="flex items-center">
                                    {Array.from({ length: 5 }, (_, i) => (
                                      <Star key={i} className={`h-4 w-4 ${i < order.rating! ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="flex space-x-2">
                                {order.status === "delivered" && (
                                  <Button variant="outline" size="sm">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                  </Button>
                                )}
                                <Button variant="outline" size="sm">
                                  <MessageCircle className="h-4 w-4 mr-2" />
                                  Message
                                </Button>
                                {order.status === "completed" && !order.rating && (
                                  <Button size="sm">
                                    <Star className="h-4 w-4 mr-2" />
                                    Rate & Review
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Favorites Tab */}
              <TabsContent value="favorites" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Your Favorites</h2>
                  <Input placeholder="Search favorites..." className="max-w-xs" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {favorites.map((item) => (
                    <Card key={item.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        {item.type === "project" ? (
                          <div className="space-y-4">
                            <img src={item.image} alt={item.title} className="w-full h-32 rounded-lg object-cover" />
                            <div>
                              <h3 className="font-medium">{item.title}</h3>
                              <p className="text-sm text-muted-foreground">by {item.creator}</p>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center space-x-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm">{item.rating}</span>
                                </div>
                                <span className="font-bold">${item.price}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-4">
                            <Avatar className="w-16 h-16">
                              <AvatarImage src={item.avatar} alt={item.name} />
                              <AvatarFallback>{item.name![0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-sm text-muted-foreground">{item.title}</p>
                              <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span>{item.rating}</span>
                                </div>
                                <span>{item.projects} projects</span>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-xs text-muted-foreground">
                            Added {new Date(item.addedDate!).toLocaleDateString()}
                          </span>
                          <Button variant="ghost" size="sm">
                            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Full Name</label>
                          <Input defaultValue={customerData.profile.name} />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Email</label>
                          <Input defaultValue={customerData.profile.email} />
                        </div>
                      </div>
                      <Button>Save Changes</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Order Updates</p>
                            <p className="text-sm text-muted-foreground">Get notified about order status changes</p>
                          </div>
                          <Button variant="outline" size="sm">Enabled</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">New Projects</p>
                            <p className="text-sm text-muted-foreground">Weekly digest of new projects</p>
                          </div>
                          <Button variant="outline" size="sm">Enabled</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Marketing Emails</p>
                            <p className="text-sm text-muted-foreground">Promotional offers and updates</p>
                          </div>
                          <Button variant="outline" size="sm">Disabled</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Account Security</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button variant="outline">Change Password</Button>
                      <Button variant="outline">Enable Two-Factor Authentication</Button>
                      <Button variant="destructive">Delete Account</Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}