"use client";

import Link from "next/link";
import { ArrowRight, Play, Star, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  const stats = [
    { icon: Users, label: "Active Creators", value: "10K+" },
    { icon: TrendingUp, label: "Projects Sold", value: "50K+" },
    { icon: Star, label: "Average Rating", value: "4.9" },
  ];

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-background via-background to-muted/30 py-20 lg:py-28">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-linear-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-linear-to-tr from-purple-500/10 via-pink-500/10 to-blue-500/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <Badge 
            variant="outline" 
            className="mb-6 border-gradient bg-background/50 backdrop-blur-sm"
          >
            ✨ New: AI-powered project matching is now live!
          </Badge>

          {/* Main Heading */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight lg:text-6xl">
            Where Student{" "}
            <span className="bg-linear-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Creativity
            </span>{" "}
            Meets{" "}
            <span className="bg-linear-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Opportunity
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mb-8 text-lg text-muted-foreground lg:text-xl max-w-2xl mx-auto">
            The premier marketplace for creative students to showcase their portfolio, 
            sell digital products, and connect with clients from around the world.
          </p>

          {/* CTA Buttons */}
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/projects">
              <Button 
                size="lg" 
                className="bg-linear-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-base px-8"
              >
                Start Exploring Projects
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 hover:bg-muted/50 text-base px-8"
              onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-blue-500/10 to-purple-500/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="animate-bounce">
          <div className="h-6 w-4 rounded-full border-2 border-muted-foreground/30">
            <div className="mx-auto mt-1 h-1 w-1 rounded-full bg-muted-foreground/50 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}