"use client";

import PaymentForm from "@/components/payment/PaymentForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/contexts/CartContext";
import { featuredProjects } from "@/lib/dummy-data";
import {
  Award,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Eye,
  Flag,
  Heart,
  MessageCircle,
  Share2,
  Shield,
  ShoppingCart,
  Star,
  Users,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { use, useState, useEffect } from "react";

interface ProjectDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * PROJECT DETAIL PAGE - Database Integration Status
 * 
 * ✅ API Route Ready: /api/projects/[id] fetches real data from database
 * 
 * TODO: Convert this page to use API data instead of dummy data
 * Current blocker: Dummy data has many fields (gallery, FAQ, requirements, deliveryTime, 
 * revisions, features) that don't exist in current Prisma schema. 
 * 
 * Next steps:
 * 1. Extend Project schema with additional fields OR
 * 2. Create separate models for ProjectGallery, ProjectFAQ, ProjectFeatures
 * 3. Replace getProjectById() with API fetch
 * 4. Map database fields to UI components
 */

// Extended project data for detail view
const getProjectById = (id: string) => {
  const baseProject = featuredProjects.find(p => p.id === id);
  if (!baseProject) return null;

  return {
    ...baseProject,
    gallery: [
      baseProject.image,
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=600&fit=crop"
    ],
    deliveryTime: "5-7 days",
    revisions: "3 included",
    languages: ["English", "Spanish"],
    skills: baseProject.tags,
    features: [
      "Source files included",
      "Commercial use license",
      "Responsive design",
      "Cross-browser compatible",
      "SEO optimized",
      "Documentation included"
    ],
    faq: [
      {
        question: "What file formats will I receive?",
        answer: "You'll receive all source files including PSD, Figma, HTML/CSS, and any other relevant formats for your project."
      },
      {
        question: "Do you provide revisions?",
        answer: "Yes! This package includes 3 rounds of revisions to ensure you're completely satisfied with the final result."
      },
      {
        question: "How long will delivery take?",
        answer: "Standard delivery is 5-7 business days. Rush delivery options are available for an additional fee."
      }
    ],
    requirements: [
      "Detailed brief about your business and goals",
      "Brand colors and fonts (if you have them)",
      "Examples of designs you like",
      "Content and images you want to include"
    ],
    creator: {
      ...baseProject.creator,
      id: baseProject.creator.id,
      title: "Senior UI/UX Designer",
      university: "Stanford University",
      major: "Computer Science",
      memberSince: "January 2023",
      responseTime: "2 hours",
      completedProjects: 127,
      totalEarnings: 28450,
      bio: "Passionate UI/UX designer with 5+ years of experience creating beautiful, user-centered designs. I specialize in e-commerce, SaaS, and mobile applications. My goal is to help businesses succeed through exceptional design.",
      skills: ["Figma", "Adobe XD", "Photoshop", "Illustrator", "Principle", "React"],
      languages: ["English", "Mandarin"],
      certifications: ["Google UX Design Certificate", "Adobe Certified Expert"]
    },
    reviews: [
      {
        id: "review-1",
        user: "John Anderson",
        userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
        rating: 5,
        date: "2024-10-15",
        comment: "Absolutely fantastic work! Sarah exceeded my expectations and delivered exactly what I was looking for. The design is clean, modern, and perfectly captures my brand. Highly recommended!"
      },
      {
        id: "review-2",
        user: "Emily Rodriguez",
        userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
        rating: 5,
        date: "2024-10-10",
        comment: "Professional, fast, and great communication throughout the project. The final design was pixel-perfect and ready to implement immediately."
      },
      {
        id: "review-3",
        user: "Michael Chen",
        userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
        rating: 4,
        date: "2024-10-05",
        comment: "Great designer with attention to detail. Minor revisions were handled quickly and professionally. Will definitely work with again."
      }
    ],
    similarProjects: [
      {
        id: "2",
        title: "Animated Logo & Brand Identity",
        creator: "Marcus Johnson",
        price: 199,
        image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop",
        rating: 4.8
      },
      {
        id: "3",
        title: "React Dashboard Application",
        creator: "Alex Rivera",
        price: 599,
        image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=200&fit=crop",
        rating: 4.9
      }
    ]
  };
};

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLiked, setIsLiked] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const { addItem, isInCart } = useCart();

  const resolvedParams = use(params);
  const project = getProjectById(resolvedParams.id);

  if (!project) {
    notFound();
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === project.gallery.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? project.gallery.length - 1 : prev - 1
    );
  };

  const averageRating = project.reviews.reduce((sum, review) => sum + review.rating, 0) / project.reviews.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/projects" className="hover:text-foreground">Projects</Link>
          <span>/</span>
          <span className="text-foreground">{project.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative aspect-video bg-muted rounded-t-lg overflow-hidden">
                  <img
                    src={project.gallery[currentImageIndex]}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {project.gallery.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </div>

                {/* Thumbnail Navigation */}
                <div className="p-4">
                  <div className="flex space-x-2 overflow-x-auto">
                    {project.gallery.map((image, index) => (
                      <button
                        key={index}
                        className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${index === currentImageIndex ? 'border-primary' : 'border-muted'
                          }`}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img src={image} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Details Tabs */}
            <Card>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <CardHeader>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews ({project.reviews.length})</TabsTrigger>
                    <TabsTrigger value="faq">FAQ</TabsTrigger>
                    <TabsTrigger value="seller">About Seller</TabsTrigger>
                  </TabsList>
                </CardHeader>

                <CardContent>
                  <TabsContent value="overview" className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4">What You Get</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {project.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-4">Requirements</h3>
                      <ul className="space-y-2">
                        {project.requirements.map((requirement, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-primary font-bold text-sm mt-0.5">•</span>
                            <span className="text-sm">{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-4">Skills & Technologies</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="reviews" className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Customer Reviews</h3>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < averageRating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                            ))}
                          </div>
                          <span className="font-medium">{averageRating.toFixed(1)}</span>
                          <span className="text-sm text-muted-foreground">({project.reviews.length} reviews)</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Flag className="h-4 w-4 mr-2" />
                        Report
                      </Button>
                    </div>

                    <div className="space-y-6">
                      {project.reviews.map((review) => (
                        <div key={review.id} className="border-b pb-6 last:border-b-0">
                          <div className="flex items-start space-x-4">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={review.userAvatar} alt={review.user} />
                              <AvatarFallback>{review.user[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <p className="font-medium">{review.user}</p>
                                  <div className="flex items-center space-x-2">
                                    <div className="flex items-center">
                                      {Array.from({ length: 5 }, (_, i) => (
                                        <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                                      ))}
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(review.date).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="faq" className="space-y-4">
                    {project.faq.map((item, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">{item.question}</h4>
                        <p className="text-sm text-muted-foreground">{item.answer}</p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="seller" className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={project.creator.avatar} alt={project.creator.name} />
                        <AvatarFallback>{project.creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-bold text-lg">{project.creator.name}</h3>
                          {project.creator.isVerified && (
                            <Award className="h-5 w-5 text-blue-500 fill-blue-500" />
                          )}
                        </div>
                        <p className="text-muted-foreground mb-1">{project.creator.title}</p>
                        <p className="text-sm text-muted-foreground">{project.creator.university} • {project.creator.major}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Member since</p>
                            <p className="font-medium">{project.creator.memberSince}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Response time</p>
                            <p className="font-medium">{project.creator.responseTime}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Projects completed</p>
                            <p className="font-medium">{project.creator.completedProjects}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Total earnings</p>
                            <p className="font-medium">${project.creator.totalEarnings.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm leading-relaxed">{project.creator.bio}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Skills & Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.creator.skills.map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Languages</h4>
                      <div className="flex space-x-4 text-sm">
                        {project.creator.languages.map((language) => (
                          <span key={language} className="flex items-center space-x-1">
                            <span>{language}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Certifications</h4>
                      <div className="space-y-2">
                        {project.creator.certifications.map((cert) => (
                          <div key={cert} className="flex items-center space-x-2">
                            <Shield className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <Card className="sticky top-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">PKR {(project.price * 280).toLocaleString()}</CardTitle>
                    <p className="text-sm text-muted-foreground">${project.price} USD</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsLiked(!isLiked)}
                    className={isLiked ? "text-red-500" : ""}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{project.deliveryTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{project.revisions}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Dialog open={showPayment} onOpenChange={setShowPayment}>
                    <DialogTrigger asChild>
                      <Button className="w-full" size="lg">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Buy Now - PKR {(project.price * 280).toLocaleString()}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <PaymentForm
                        projectId={project.id}
                        creatorId={project.creator.id}
                        amount={project.price * 280} // Convert USD to PKR
                        title={project.title}
                        onSuccess={(paymentId) => {
                          setShowPayment(false);
                          // Handle successful payment
                          console.log('Payment successful:', paymentId);
                        }}
                        onCancel={() => setShowPayment(false)}
                      />
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    onClick={() => addItem({
                      id: project.id,
                      title: project.title,
                      price: project.price,
                      image: project.image,
                      creator: project.creator,
                      type: 'project'
                    })}
                    disabled={isInCart(project.id)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {isInCart(project.id) ? 'In Cart' : 'Add to Cart'}
                  </Button>

                  <Link href={`/messages?creator=${project.creator.id}`} className="w-full">
                    <Button variant="outline" className="w-full" size="lg">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact Seller
                    </Button>
                  </Link>
                </div>

                <div className="flex justify-center space-x-4 pt-4 border-t">
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Flag className="h-4 w-4 mr-2" />
                    Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Creator Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">About the Creator</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`/creators/${project.creator.id}`} className="block">
                  <div className="flex items-center space-x-3 hover:bg-muted/50 -m-2 p-2 rounded-lg transition-colors">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={project.creator.avatar} alt={project.creator.name} />
                      <AvatarFallback>{project.creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1">
                        <p className="font-medium truncate">{project.creator.name}</p>
                        {project.creator.isVerified && (
                          <Award className="h-4 w-4 text-blue-500 fill-blue-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{project.creator.title}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{project.rating}</span>
                        <span className="text-xs text-muted-foreground">({project.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>

            {/* Project Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Project Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span>Views</span>
                  </div>
                  <span className="font-medium">{project.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    <span>Likes</span>
                  </div>
                  <span className="font-medium">{project.likes}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Published</span>
                  </div>
                  <span className="font-medium">Oct 2024</span>
                </div>
              </CardContent>
            </Card>

            {/* Similar Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Similar Projects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.similarProjects.map((similar) => (
                  <Link key={similar.id} href={`/projects/${similar.id}`}>
                    <div className="flex space-x-3 hover:bg-muted/50 -m-2 p-2 rounded-lg transition-colors">
                      <img
                        src={similar.image}
                        alt={similar.title}
                        className="w-16 h-12 rounded object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">{similar.title}</p>
                        <p className="text-xs text-muted-foreground">{similar.creator}</p>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{similar.rating}</span>
                          </div>
                          <span className="text-sm font-bold">${similar.price}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}