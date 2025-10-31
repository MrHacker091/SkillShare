"use client";

import { RoleUpgradeCard } from "@/components/RoleUpgradeCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthSession } from "@/hooks/useAuthSession";
import {
  BarChart3,
  MessageSquare,
  PlusCircle,
  Settings,
  ShoppingBag,
  Star,
  TrendingUp,
  User
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Dashboard() {
  const { data: session, status } = useAuthSession();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated" && session?.user?.role === "CREATOR" && !hasRedirected.current) {
      console.log('🔄 Redirecting CREATOR to creator dashboard');
      hasRedirected.current = true;
      router.push("/dashboard/creator");
    }
  }, [status, router, session?.user?.role]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                <AvatarFallback className="text-lg">
                  {session.user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">Welcome back, {session.user?.name?.split(' ')[0] || 'User'}!</h1>
                <p className="text-muted-foreground">Ready to showcase your creativity?</p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={`border-0 text-white ${session.user?.role === 'CREATOR'
                ? 'bg-linear-to-r from-purple-500 to-pink-500'
                : 'bg-linear-to-r from-blue-500 to-indigo-500'
                }`}
            >
              {session.user?.role === 'CREATOR' ? '🎨 Creator' : '👤 Customer'}
            </Badge>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link href="/projects" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ShoppingBag className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Browse Projects</h3>
                    <p className="text-sm text-muted-foreground">Find amazing student work</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/creators" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <User className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Find Creators</h3>
                    <p className="text-sm text-muted-foreground">Connect with talented students</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Dashboard Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Link href="/projects" className="block">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>
                  Your latest interactions on SkillShare
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No recent activity yet</p>
                    <p className="text-sm">Start exploring projects to see activity here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Recommendations */}
          <Link href="/projects" className="block">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>Recommended for You</span>
                </CardTitle>
                <CardDescription>
                  Projects you might be interested in
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No recommendations yet</p>
                    <p className="text-sm">Browse projects to get personalized recommendations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Quick Actions Footer */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link href="/projects">
            <Button variant="outline">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Browse Projects
            </Button>
          </Link>
          <Link href="/creators">
            <Button variant="outline">
              <User className="mr-2 h-4 w-4" />
              Find Creators
            </Button>
          </Link>
          <Link href="/dashboard/settings">
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Account Settings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}