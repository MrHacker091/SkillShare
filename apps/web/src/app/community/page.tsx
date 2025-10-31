import Link from "next/link";
import { ArrowLeft, Users, MessageCircle, Heart, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20">
        <div className="container mx-auto px-4 py-20">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Join Our{" "}
              <span className="bg-linear-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                Community
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with creative students, share your work, and grow together.
            </p>
          </div>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border rounded-lg p-12 text-center">
            <Users className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
            <h2 className="text-3xl font-bold mb-4">Community Features Coming Soon</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're building an amazing community space where creators can connect, collaborate, 
              and inspire each other. Stay tuned!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/creators">Browse Creators</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Get Updates</Link>
              </Button>
            </div>
          </div>

          {/* What's Coming */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-8 text-center">What's Coming</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Forums & Discussions</h4>
                <p className="text-muted-foreground">
                  Share ideas, ask questions, and learn from other creators
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-indigo-100 dark:bg-indigo-900/20 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-indigo-600" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Creator Spotlights</h4>
                <p className="text-muted-foreground">
                  Get featured and discover amazing work from fellow students
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 dark:bg-purple-900/20 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Collaboration Opportunities</h4>
                <p className="text-muted-foreground">
                  Find partners for projects and grow your network
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
