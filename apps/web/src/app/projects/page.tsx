"use client";

import { ProjectCard } from "@/components/project-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { featuredProjects } from "@/lib/dummy-data";
import { ChevronDown, Eye, Grid3X3, Heart, List, Plus, Search, Star, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function ProjectsPage() {
    const { data: session } = useSession();
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState("Popular");
    const [minPrice, setMinPrice] = useState<number | "">("");
    const [maxPrice, setMaxPrice] = useState<number | "">("");
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [apiProjects, setApiProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const categories = [
        "All", "Web Design", "Branding", "Development", "Social Media",
        "Photography", "Video Editing", "3D Design", "Writing", "Marketing", "Mobile Design"
    ];

    const sortOptions = [
        "Popular", "Latest", "Price: Low to High", "Price: High to Low", "Rating", "Most Liked"
    ];

    // Fetch projects from API with filters
    useEffect(() => {
        const fetchProjects = async () => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams({
                    search: searchQuery,
                    category: selectedCategory,
                    sortBy: sortBy,
                    page: '1',
                    limit: '20'
                });

                if (minPrice) params.set('minPrice', minPrice.toString());
                if (maxPrice) params.set('maxPrice', maxPrice.toString());

                const response = await fetch(`/api/projects?${params}`);
                if (response.ok) {
                    const data = await response.json();
                    setApiProjects(data.projects || []);
                } else {
                    console.error('Failed to fetch projects:', response.statusText);
                    // Fallback to dummy data if API fails
                    setApiProjects([]);
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
                // Fallback to dummy data if API fails
                setApiProjects([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, [searchQuery, selectedCategory, sortBy, minPrice, maxPrice]);

    // Use real API projects or fallback to featured projects for demo
    const allProjects = apiProjects.length > 0 ? apiProjects : [
        ...featuredProjects,
        {
            id: "5",
            title: "Mobile App UI Design",
            description: "Complete mobile app design with user flow and interactive prototypes",
            image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
            price: 399,
            category: "Mobile Design",
            creator: {
                id: "maya_patel",
                name: "Maya Patel",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b635?w=32&h=32&fit=crop&crop=face",
                isVerified: true,
            },
            rating: 4.9,
            reviewCount: 34,
            likes: 189,
            views: 987,
            tags: ["Figma", "Mobile", "Prototype", "UI/UX"],
        },
        {
            id: "6",
            title: "Product Photography Package",
            description: "Professional product photos with post-processing and multiple angles",
            image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=250&fit=crop",
            price: 249,
            category: "Photography",
            creator: {
                id: "david_kim",
                name: "David Kim",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
                isVerified: false,
            },
            rating: 4.7,
            reviewCount: 28,
            likes: 145,
            views: 654,
            tags: ["Photography", "Lightroom", "Product", "Commercial"],
        },
    ];

    // Enhanced filtering and sorting logic
    const filteredAndSortedProjects = useMemo(() => {
        let filtered = allProjects.filter(project => {
            // Search filter
            const matchesSearch = searchQuery === "" ||
                project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

            // Category filter
            const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;

            // Price filter
            const matchesMinPrice = minPrice === "" || project.price >= minPrice;
            const matchesMaxPrice = maxPrice === "" || project.price <= maxPrice;

            // Rating filter
            const matchesRating = selectedRating === null || project.rating >= selectedRating;

            return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesRating;
        });

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "Price: Low to High":
                    return a.price - b.price;
                case "Price: High to Low":
                    return b.price - a.price;
                case "Rating":
                    return b.rating - a.rating;
                case "Most Liked":
                    return b.likes - a.likes;
                case "Latest":
                    // Simulate latest by ID (higher ID = more recent)
                    return parseInt(b.id) - parseInt(a.id);
                case "Popular":
                default:
                    // Popular based on combination of rating, likes, and views
                    const aPopularity = a.rating * 100 + a.likes + a.views * 0.1;
                    const bPopularity = b.rating * 100 + b.likes + b.views * 0.1;
                    return bPopularity - aPopularity;
            }
        });

        return filtered;
    }, [allProjects, searchQuery, selectedCategory, minPrice, maxPrice, selectedRating, sortBy, apiProjects]);

    // Clear all filters function
    const clearAllFilters = () => {
        setSearchQuery("");
        setSelectedCategory("All");
        setMinPrice("");
        setMaxPrice("");
        setSelectedRating(null);
        setSortBy("Popular");
    };

    // Check if any filters are active
    const hasActiveFilters = searchQuery !== "" || selectedCategory !== "All" ||
        minPrice !== "" || maxPrice !== "" || selectedRating !== null || sortBy !== "Popular";

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Discover Amazing{" "}
                            <span className="bg-linear-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                                Student Projects
                            </span>
                        </h1>
                        <p className="text-lg text-muted-foreground mb-8">
                            Browse thousands of creative projects from talented students across various disciplines.
                            Find the perfect digital product or hire creators for custom work.
                        </p>

                        {/* CTA for authenticated users */}
                        {session && (
                            <div className="mb-6">
                                <Link href="/projects/create">
                                    <Button size="lg" className="bg-linear-to-r from-purple-500 to-pink-500 hover:opacity-90">
                                        <Plus className="mr-2 h-5 w-5" />
                                        Create Your Project
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {/* Search Bar */}
                        <div className="relative max-w-2xl">
                            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search projects, creators, or skills..."
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
                                <h3 className="font-semibold mb-4">Categories</h3>
                                <div className="space-y-2">
                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === category
                                                ? "bg-primary text-primary-foreground"
                                                : "hover:bg-muted"
                                                }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-4">Price Range</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Input
                                            type="number"
                                            placeholder="Min"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value === "" ? "" : parseInt(e.target.value))}
                                            className="flex-1"
                                        />
                                        <span className="text-muted-foreground">-</span>
                                        <Input
                                            type="number"
                                            placeholder="Max"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value === "" ? "" : parseInt(e.target.value))}
                                            className="flex-1"
                                        />
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => {
                                            setMinPrice("");
                                            setMaxPrice("");
                                        }}
                                    >
                                        Clear Price Filter
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
                            <div>
                                <div className="flex items-center gap-4">
                                    <p className="text-muted-foreground">
                                        Showing {filteredAndSortedProjects.length} results
                                        {selectedCategory !== "All" && ` for "${selectedCategory}"`}
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

                        {/* Projects Grid */}
                        {viewMode === "grid" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredAndSortedProjects.map((project) => (
                                    <ProjectCard key={project.id} {...project} />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredAndSortedProjects.map((project) => (
                                    <Card key={project.id} className="hover:shadow-lg transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex gap-6">
                                                <img
                                                    src={project.image}
                                                    alt={project.title}
                                                    className="w-32 h-24 object-cover rounded-lg"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <Link href={`/projects/${project.id}`}>
                                                                <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                                                                    {project.title}
                                                                </h3>
                                                            </Link>
                                                            <p className="text-muted-foreground mt-1 line-clamp-2">
                                                                {project.description}
                                                            </p>
                                                            <div className="flex items-center space-x-4 mt-3 text-sm text-muted-foreground">
                                                                <div className="flex items-center space-x-1">
                                                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                                    <span>{project.rating} ({project.reviewCount})</span>
                                                                </div>
                                                                <div className="flex items-center space-x-1">
                                                                    <Heart className="h-4 w-4" />
                                                                    <span>{project.likes}</span>
                                                                </div>
                                                                <div className="flex items-center space-x-1">
                                                                    <Eye className="h-4 w-4" />
                                                                    <span>{project.views}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-bold text-xl">${project.price}</div>
                                                            <Badge variant="outline" className="mt-2">
                                                                {project.category}
                                                            </Badge>
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
                                Load More Projects
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
