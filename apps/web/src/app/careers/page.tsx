import Link from "next/link";
import { ArrowLeft, Briefcase, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CareersPage() {
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
                Team
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Help us empower the next generation of creative students and build the future of digital marketplaces.
            </p>
          </div>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border rounded-lg p-12 text-center">
            <Briefcase className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
            <h2 className="text-3xl font-bold mb-4">Career Opportunities Coming Soon</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're currently building our team and will be posting exciting career opportunities soon. 
              Check back later or reach out to us if you'd like to be part of our journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/contact">Get in Touch</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/">Explore Platform</Link>
              </Button>
            </div>
          </div>

          {/* Why Join Us */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Meaningful Work</h3>
              <p className="text-muted-foreground">
                Help creative students succeed and build sustainable careers
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-indigo-100 dark:bg-indigo-900/20 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Remote First</h3>
              <p className="text-muted-foreground">
                Work from anywhere in the world with flexible hours
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900/20 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Growth Focused</h3>
              <p className="text-muted-foreground">
                Learn, grow, and advance your career with us
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
