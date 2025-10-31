"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<"customer" | "creator">("customer");

  // Get user type from URL parameters
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'creator') {
      setUserType(type);
    }
  }, [searchParams]);

  const getUserTypeConfig = () => {
    if (userType === "creator") {
      return {
        title: "Creator Login",
        description: "Access your creator dashboard and manage your projects",
        badge: "🎨 Student Creator",
        color: "from-purple-500 to-pink-500",
      };
    }
    return {
      title: "Customer Login",
      description: "Browse projects and hire talented student creators",
      badge: "👤 Customer",
      color: "from-blue-500 to-indigo-500",
    };
  };

  const config = getUserTypeConfig();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Store userType in a cookie for NextAuth callback to read
      document.cookie = `pendingUserType=${userType}; path=/; max-age=300`; // 5 minutes
      // Pass userType as a query parameter in the callback URL
      await signIn('google', {
        callbackUrl: `/dashboard?userType=${userType}`,
        redirect: true,
      });
    } catch (error) {
      console.error("Google sign in error:", error);
      alert('Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-linear-to-br from-blue-500/10 to-purple-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-linear-to-tr from-purple-500/10 to-pink-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back to Home */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to SkillShare
          </Link>
        </div>

        <Card className="shadow-xl border-0 bg-background/80 backdrop-blur-sm">
          <CardHeader className="space-y-4 text-center">
            {/* User Type Badge */}
            <Badge
              variant="outline"
              className={`self-center bg-linear-to-r ${config.color} text-white border-0`}
            >
              {config.badge}
            </Badge>

            <div>
              <CardTitle className="text-2xl font-bold">{config.title}</CardTitle>
              <CardDescription className="mt-2">
                {config.description}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Google OAuth Login */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-12 text-base"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {isLoading ? "Signing in..." : "Continue with Google"}
              </Button>
              <div className="text-xs text-muted-foreground text-center">
                Secure authentication powered by Google
              </div>
            </div>

            {/* User Type Switching */}
            <div className="text-center space-y-2 pt-4 border-t">
              <div className="text-xs text-muted-foreground">Looking for a different account type?</div>
              <div className="flex justify-center space-x-2">
                {userType !== "customer" && (
                  <Link href="/auth/login?type=customer">
                    <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                      👤 Customer
                    </Badge>
                  </Link>
                )}
                {userType !== "creator" && (
                  <Link href="/auth/login?type=creator">
                    <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                      🎨 Creator
                    </Badge>
                  </Link>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}