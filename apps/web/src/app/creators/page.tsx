"use client";

import { CreatorCard } from "@/components/creator-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { featuredCreators } from "@/lib/dummy-data";
import { Award, ChevronDown, Grid3X3, List, MapPin, Search, Star, Users, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function CreatorsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("All");
  const [sortBy, setSortBy] = useState("Popular");
  const [selectedExperience, setSelectedExperience] = useState("All");
  const [minRate, setMinRate] = useState<number | "">("");
  const [maxRate, setMaxRate] = useState<number | "">("");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [apiCreators, setApiCreators] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const skills = [
    "All", "Web Design", "Graphic Design", "Video Editing", "Photography",
    "Writing", "Marketing", "Development", "3D Design", "Animation", "Full Stack Development",
    "UI/UX Design", "Motion Graphics", "3D Modeling", "Video Production"
  ];

  const sortOptions = [
    "Popular", "Rating", "Most Projects", "Newest", "Lowest Rate", "Highest Rate"
  ];

  const experienceLevels = ["All", "Beginner", "Intermediate", "Advanced", "Expert"];

  // Fetch creators from API with filters
  useEffect(() => {
    const fetchCreators = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          search: searchQuery,
          skill: selectedSkill,
          sortBy: sortBy,
          page: '1',
          limit: '20'
        });

        if (minRate) params.set('minRate', minRate.toString());
        if (maxRate) params.set('maxRate', maxRate.toString());

        const response = await fetch(`/api/creators?${params}`);
        if (response.ok) {
          const data = await response.json();
          setApiCreators(data.creators || []);
        } else {
          console.error('Failed to fetch creators:', response.statusText);
          setApiCreators([]);
        }
      } catch (error) {
        console.error('Error fetching creators:', error);
        setApiCreators([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreators();
  }, [searchQuery, selectedSkill, sortBy, minRate, maxRate]);

  // Use real API creators or fallback to featured creators for demo
  const allCreators = apiCreators.length > 0 ? apiCreators : [
    ...featuredCreators,
    {
      id: "creator-5",
      name: "Maya Singh",
      title: "Full Stack Developer & Designer",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b635?w=128&h=128&fit=crop&crop=face",
      coverImage: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=96&fit=crop",
      location: "San Francisco, CA",
      skills: ["Full Stack Development", "UI/UX Design", "React"],
      rating: 4.9,
      reviewCount: 67,
      completedProjects: 23,
      isVerified: true,
      responseTime: "1 hour",
      startingPrice: 45,
    },
    {
      id: "creator-6",
      name: "Carlos Rodriguez",
      title: "Motion Graphics & 3D Artist",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=face",
      coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=96&fit=crop",
      location: "Chicago, IL",
      skills: ["Motion Graphics", "3D Modeling", "Video Production"],
      rating: 4.8,
      reviewCount: 42,
      completedProjects: 31,
      isVerified: false,
      responseTime: "2 hours",
      startingPrice: 38,
    },
  ];

  // Enhanced filtering and sorting logic for creators
  const filteredAndSortedCreators = useMemo(() => {
    let filtered = allCreators.filter(creator => {
      // Search filter
      const matchesSearch = searchQuery === "" ||
        creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        creator.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.location?.toLowerCase().includes(searchQuery.toLowerCase());

      // Skill filter
      const matchesSkill = selectedSkill === "All" || creator.skills.some(skill =>
        skill.toLowerCase().includes(selectedSkill.toLowerCase())
      );

      // Experience level filter (based on completed projects)
      const matchesExperience = selectedExperience === "All" || (() => {
        const projects = creator.completedProjects || 0;
        switch (selectedExperience) {
          case "Beginner": return projects < 10;
          case "Intermediate": return projects >= 10 && projects < 25;
          case "Advanced": return projects >= 25 && projects < 50;
          case "Expert": return projects >= 50;
          default: return true;
        }
      })();

      // Rate filter
      const matchesMinRate = minRate === "" || (creator.startingPrice || 0) >= minRate;
      const matchesMaxRate = maxRate === "" || (creator.startingPrice || 0) <= maxRate;

      // Rating filter
      const matchesRating = selectedRating === null || creator.rating >= selectedRating;

      return matchesSearch && matchesSkill && matchesExperience && matchesMinRate && matchesMaxRate && matchesRating;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "Rating":
          return b.rating - a.rating;
        case "Most Projects":
          return (b.completedProjects || 0) - (a.completedProjects || 0);
        case "Newest":
          // Simulate newest by ID (higher ID = more recent)
          return parseInt(b.id.split('-')[1]) - parseInt(a.id.split('-')[1]);
        case "Lowest Rate":
          return (a.startingPrice || 0) - (b.startingPrice || 0);
        case "Highest Rate":
          return (b.startingPrice || 0) - (a.startingPrice || 0);
        case "Popular":
        default:
          // Popular based on combination of rating, reviews, and projects
          const aPopularity = a.rating * 100 + a.reviewCount + (a.completedProjects || 0) * 2;
          const bPopularity = b.rating * 100 + b.reviewCount + (b.completedProjects || 0) * 2;
          return bPopularity - aPopularity;
      }
    });

    return filtered;
  }, [allCreators, searchQuery, selectedSkill, selectedExperience, minRate, maxRate, selectedRating, sortBy]);

  // Clear all filters function
  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedSkill("All");
    setSelectedExperience("All");
    setMinRate("");
    setMaxRate("");
    setSelectedRating(null);
    setSortBy("Popular");
  };

  // Check if any filters are active
  const hasActiveFilters = searchQuery !== "" || selectedSkill !== "All" || selectedExperience !== "All" ||
    minRate !== "" || maxRate !== "" || selectedRating !== null || sortBy !== "Popular";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-linear-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-orange-950/20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Meet Talented{" "}
              <span className="bg-linear-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                Student Creators
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Connect with skilled students from top universities around the world.
              Browse portfolios, read reviews, and hire the perfect creator for your project.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name, skills, or university..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg border-0 bg-background/80 backdrop-blur-sm shadow-lg focus-visible:ring-2"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Skills</h3>
                <div className="space-y-2">
                  {skills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => setSelectedSkill(skill)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedSkill === skill
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                        }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Experience Level</h3>
                <div className="space-y-2">
                  {experienceLevels.map((level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedExperience(level)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedExperience === level
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                        }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Starting Rate ($)</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={minRate}
                      onChange={(e) => setMinRate(e.target.value === "" ? "" : parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-muted-foreground">-</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={maxRate}
                      onChange={(e) => setMaxRate(e.target.value === "" ? "" : parseInt(e.target.value))}
                      className="flex-1"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setMinRate("");
                      setMaxRate("");
                    }}
                  >
                    Clear Rate Filter
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Rating</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedRating(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedRating === null ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                  >
                    All Ratings
                  </button>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setSelectedRating(rating)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${selectedRating === rating
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                        }`}
                    >
                      <div className="flex items-center">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm">& Up</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <p className="text-muted-foreground">
                  Showing {filteredAndSortedCreators.length} creators
                  {selectedSkill !== "All" && ` skilled in "${selectedSkill}"`}
                </p>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    className="flex items-center gap-2"
                  >
                    <X className="h-3 w-3" />
                    Clear Filters
                  </Button>
                )}
              </div>

              <div className="flex items-center space-x-4">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-background border border-input px-4 py-2 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {sortOptions.map((option) => (
                      <option key={option} value={option}>
                        Sort by: {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center border rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Creators Grid */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedCreators.map((creator) => (
                  <CreatorCard key={creator.id} {...creator} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAndSortedCreators.map((creator) => (
                  <Card key={creator.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <Avatar className="w-20 h-20">
                          <AvatarImage src={creator.avatar} alt={creator.name} />
                          <AvatarFallback>{creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <Link href={`/creators/${creator.id}`}>
                                <h3 className="font-semibold text-lg hover:text-primary transition-colors flex items-center gap-2">
                                  {creator.name}
                                  {creator.isVerified && (
                                    <Award className="h-4 w-4 text-blue-500 fill-blue-500" />
                                  )}
                                </h3>
                              </Link>
                              <p className="text-muted-foreground">{creator.title}</p>
                              <p className="text-sm text-muted-foreground">{creator.location}</p>

                              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span>{creator.rating} ({creator.reviewCount} reviews)</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Users className="h-4 w-4" />
                                  <span>{creator.completedProjects} projects</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>Responds in {creator.responseTime}</span>
                                </div>
                              </div>

                              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                Skilled in {creator.skills.join(", ")}. Available for custom projects and collaborations.
                              </p>

                              <div className="flex flex-wrap gap-1 mt-3">
                                {creator.skills.slice(0, 3).map((skill) => (
                                  <Badge key={skill} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {creator.skills.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{creator.skills.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="font-bold text-xl">From ${creator.startingPrice}</div>
                              <Badge variant="outline" className="mt-2">
                                {creator.isVerified ? "Verified" : "New"}
                              </Badge>
                              <div className="text-sm text-muted-foreground mt-2">
                                Responds in {creator.responseTime}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Creators
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
