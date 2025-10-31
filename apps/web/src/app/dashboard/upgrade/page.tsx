"use client";

import { RoleUpgradeCard } from "@/components/RoleUpgradeCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthSession } from "@/hooks/useAuthSession";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UpgradePage() {
  const { data: session, status } = useAuthSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated" && session?.user?.role === "CREATOR") {
      // Redirect creators back to their dashboard
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

  if (!session || session.user?.role === "CREATOR") {
    return null;
  }

  const handleUpgradeSuccess = () => {
    // Redirect to creator dashboard after successful upgrade
    router.push("/dashboard/creator");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Become a Creator</h1>
            <p className="text-muted-foreground text-lg">
              Unlock your potential and start showcasing your work to the world
            </p>
          </div>
        </div>

        {/* Upgrade Card */}
        <div className="flex justify-center">
          <div className="max-w-2xl w-full">
            <RoleUpgradeCard onUpgradeSuccess={handleUpgradeSuccess} />
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">💼</span>
                <span>Showcase Your Portfolio</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Display your best work and attract potential customers with a professional portfolio
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">💰</span>
                <span>Earn Money</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monetize your skills and creativity by selling your projects to other students
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">🎯</span>
                <span>Build Your Brand</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Establish yourself as a recognized creator in your field and grow your reputation
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}