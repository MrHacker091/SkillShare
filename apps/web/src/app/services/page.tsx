"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle2, Clock, Search, Star, Users } from "lucide-react";
import { useState } from "react";

const services = [
  {
    id: "web-design",
    title: "Custom Website Design",
    description: "Professional website design tailored to your brand and business goals",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=250&fit=crop",
    category: "Design",
    pricing: {
      basic: { price: 299, title: "Landing Page", features: ["Single page design", "Mobile responsive", "Basic SEO", "2 revisions"] },
      standard: { price: 599, title: "Business Website", features: ["5-page website", "Mobile responsive", "Contact forms", "SEO optimization", "5 revisions"] },
      premium: { price: 999, title: "E-commerce Store", features: ["Custom e-commerce design", "Product catalog", "Payment integration", "Admin panel", "Unlimited revisions"] }
    },
    deliveryTime: "5-7 days",
    rating: 4.9,
    reviewCount: 127,
    providersCount: 24,
    tags: ["Figma", "Adobe XD", "Responsive", "SEO"]
  },
  {
    id: "brand-identity",
    title: "Brand Identity Design",
    description: "Complete brand package including logo, colors, typography, and guidelines",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop",
    category: "Branding",
    pricing: {
      basic: { price: 199, title: "Logo Design", features: ["Custom logo design", "3 concepts", "Vector files", "2 revisions"] },
      standard: { price: 399, title: "Brand Package", features: ["Logo + variations", "Color palette", "Typography guide", "Business card design", "5 revisions"] },
      premium: { price: 699, title: "Complete Identity", features: ["Full brand package", "Brand guidelines", "Social media kit", "Stationery design", "Unlimited revisions"] }
    },
    deliveryTime: "3-5 days",
    rating: 4.8,
    reviewCount: 89,
    providersCount: 18,
    tags: ["Illustrator", "Photoshop", "Brand Strategy", "Print Design"]
  },
  {
    id: "web-development",
    title: "Web Application Development",
    description: "Full-stack web applications built with modern technologies",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop",
    category: "Development",
    pricing: {
      basic: { price: 799, title: "Simple App", features: ["Frontend + Backend", "User authentication", "Database setup", "Basic features"] },
      standard: { price: 1499, title: "Business App", features: ["Advanced features", "Admin dashboard", "API integration", "Payment processing", "Testing"] },
      premium: { price: 2999, title: "Enterprise App", features: ["Complex functionality", "Scalable architecture", "Third-party integrations", "Deployment", "3 months support"] }
    },
    deliveryTime: "2-4 weeks",
    rating: 4.9,
    reviewCount: 64,
    providersCount: 15,
    tags: ["React", "Node.js", "TypeScript", "Database"]
  },
  {
    id: "content-creation",
    title: "Social Media Content",
    description: "Engaging social media posts, stories, and video content for your brand",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=250&fit=crop",
    category: "Content",
    pricing: {
      basic: { price: 149, title: "Weekly Posts", features: ["10 social posts", "2 platforms", "Content calendar", "Basic graphics"] },
      standard: { price: 299, title: "Complete Package", features: ["20 posts + stories", "4 platforms", "Video content", "Hashtag research", "Analytics"] },
      premium: { price: 599, title: "Premium Content", features: ["30 posts + videos", "All platforms", "Reels/TikToks", "Influencer outreach", "Monthly strategy call"] }
    },
    deliveryTime: "Weekly delivery",
    rating: 4.7,
    reviewCount: 156,
    providersCount: 32,
    tags: ["Canva", "Video Editing", "Instagram", "TikTok"]
  },
  {
    id: "video-production",
    title: "Video Production & Editing",
    description: "Professional video editing, motion graphics, and animation services",
    image: "https://images.unsplash.com/photo-1574717024663-472b4bf191cb?w=400&h=250&fit=crop",
    category: "Video",
    pricing: {
      basic: { price: 199, title: "Basic Edit", features: ["Video editing", "Color correction", "Audio sync", "Up to 5 minutes"] },
      standard: { price: 399, title: "Professional Edit", features: ["Advanced editing", "Motion graphics", "Sound design", "Up to 15 minutes"] },
      premium: { price: 799, title: "Complete Production", features: ["Full production", "3D animations", "Custom graphics", "Unlimited length", "Multiple formats"] }
    },
    deliveryTime: "5-10 days",
    rating: 4.8,
    reviewCount: 73,
    providersCount: 21,
    tags: ["After Effects", "Premiere Pro", "Motion Graphics", "3D"]
  },
  {
    id: "mobile-app",
    title: "Mobile App Development",
    description: "Native and cross-platform mobile applications for iOS and Android",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
    category: "Development",
    pricing: {
      basic: { price: 1299, title: "Simple App", features: ["Single platform", "5 screens", "Basic features", "App store submission"] },
      standard: { price: 2499, title: "Feature-Rich App", features: ["Cross-platform", "10+ screens", "Advanced features", "Backend integration", "Push notifications"] },
      premium: { price: 4999, title: "Enterprise App", features: ["Complex functionality", "Custom design", "Real-time features", "Analytics", "Maintenance included"] }
    },
    deliveryTime: "4-8 weeks",
    rating: 4.9,
    reviewCount: 45,
    providersCount: 12,
    tags: ["React Native", "Flutter", "iOS", "Android"]
  }
];

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All");

  const categories = ["All", "Design", "Development", "Branding", "Content", "Video"];
  const priceRanges = ["All", "Under $300", "$300-$800", "$800-$2000", "$2000+"];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || service.category === selectedCategory;

    let matchesPrice = true;
    if (selectedPriceRange !== "All") {
      const basicPrice = service.pricing.basic.price;
      switch (selectedPriceRange) {
        case "Under $300":
          matchesPrice = basicPrice < 300;
          break;
        case "$300-$800":
          matchesPrice = basicPrice >= 300 && basicPrice <= 800;
          break;
        case "$800-$2000":
          matchesPrice = basicPrice >= 800 && basicPrice <= 2000;
          break;
        case "$2000+":
          matchesPrice = basicPrice > 2000;
          break;
      }
    }

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/20 dark:via-emerald-950/20 dark:to-teal-950/20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Professional{" "}
              <span className="bg-linear-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Student Services
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Get high-quality digital services from talented students at affordable prices.
              From web design to mobile apps, find the perfect service for your needs.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search services, skills, or technologies..."
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
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range}
                      onClick={() => setSelectedPriceRange(range)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedPriceRange === range
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                        }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Service Level</h3>
                <div className="space-y-2">
                  {["Basic", "Standard", "Premium"].map((level) => (
                    <button
                      key={level}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors flex items-center justify-between"
                    >
                      <span>{level}</span>
                      <Badge variant="outline" className="text-xs">
                        {level === "Basic" ? "Quick" : level === "Standard" ? "Popular" : "Best Value"}
                      </Badge>
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
                <p className="text-muted-foreground">
                  Showing {filteredServices.length} services
                  {selectedCategory !== "All" && ` in "${selectedCategory}"`}
                </p>
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredServices.map((service) => (
                <Card key={service.id} className="hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-background/90 text-foreground">
                        {service.category}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="font-bold text-xl mb-2">{service.title}</h3>
                      <p className="text-muted-foreground mb-4">{service.description}</p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{service.rating} ({service.reviewCount})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{service.deliveryTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{service.providersCount} providers</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-6">
                        {service.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Pricing Tiers */}
                    <div className="space-y-4">
                      {Object.entries(service.pricing).map(([tier, details]) => (
                        <div key={tier} className={`border rounded-lg p-4 ${tier === 'standard' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-semibold capitalize">{tier}</h4>
                              <p className="text-sm text-muted-foreground">{details.title}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg">${details.price}</div>
                              {tier === 'standard' && (
                                <Badge variant="default" className="text-xs mt-1">
                                  Most Popular
                                </Badge>
                              )}
                            </div>
                          </div>

                          <ul className="space-y-1 mb-4">
                            {details.features.map((feature, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>

                          <Button
                            className="w-full"
                            variant={tier === 'standard' ? 'default' : 'outline'}
                          >
                            Get Started
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Services
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
