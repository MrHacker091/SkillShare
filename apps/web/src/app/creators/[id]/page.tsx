'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCart } from '@/contexts/CartContext'
import {
  Award,
  Check,
  Clock,
  DollarSign,
  Filter,
  Grid,
  Heart,
  List,
  MapPin,
  MessageCircle,
  MoreVertical,
  Share2,
  Star,
  Users
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

/**
 * CREATOR DETAIL PAGE - Database Integration Status
 * 
 * ✅ API Route Ready: /api/creators/[id] fetches real data from database
 * 
 * TODO: Convert this page to use API data instead of dummy data
 * Current setup uses static dummy data. The API route is ready and returns:
 * - Creator profile with bio, skills, stats
 * - All published projects
 * - All active products
 * - Reviews received
 * 
 * Next steps:
 * 1. Replace creatorsData with useEffect fetch from /api/creators/[id]
 * 2. Add loading states
 * 3. Handle error cases (creator not found, etc.)
 */

// Extended dummy data for creators
const creatorsData = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=400&fit=crop',
    title: 'UI/UX Design Expert',
    bio: 'Passionate UI/UX designer with 8+ years of experience creating beautiful, user-centered digital experiences. I specialize in mobile app design, web interfaces, and design systems.',
    location: 'San Francisco, CA',
    joinedDate: 'March 2022',
    rating: 4.9,
    totalReviews: 324,
    totalStudents: 2847,
    totalProjects: 12,
    responseTime: '2 hours',
    skills: ['UI Design', 'UX Research', 'Figma', 'Prototyping', 'Design Systems', 'Mobile Design'],
    languages: ['English', 'Spanish'],
    verified: true,
    topRated: true,
    services: [
      {
        id: 1,
        title: 'Mobile App UI Design',
        price: '$299',
        duration: '7 days',
        description: 'Complete mobile app UI design with modern aesthetics',
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop'
      },
      {
        id: 2,
        title: 'Website Redesign',
        price: '$599',
        duration: '14 days',
        description: 'Full website redesign with user experience optimization',
        image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=300&h=200&fit=crop'
      },
      {
        id: 3,
        title: 'Design System Creation',
        price: '$799',
        duration: '21 days',
        description: 'Comprehensive design system for your brand',
        image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=300&h=200&fit=crop'
      }
    ],
    portfolio: [
      {
        id: 1,
        title: 'E-commerce Mobile App',
        category: 'Mobile Design',
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
        likes: 156
      },
      {
        id: 2,
        title: 'SaaS Dashboard Design',
        category: 'Web Design',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
        likes: 203
      },
      {
        id: 3,
        title: 'Banking App Interface',
        category: 'Mobile Design',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop',
        likes: 178
      },
      {
        id: 4,
        title: 'Food Delivery App',
        category: 'Mobile Design',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
        likes: 234
      },
      {
        id: 5,
        title: 'Travel Booking Website',
        category: 'Web Design',
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
        likes: 189
      },
      {
        id: 6,
        title: 'Fitness App Design',
        category: 'Mobile Design',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        likes: 167
      }
    ],
    reviews: [
      {
        id: 1,
        author: 'Michael Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Sarah delivered exceptional work on our mobile app design. Her attention to detail and user experience expertise really showed in the final product.',
        project: 'Mobile App UI Design'
      },
      {
        id: 2,
        author: 'Emily Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        rating: 5,
        date: '1 month ago',
        comment: 'Amazing work! Sarah understood our vision perfectly and delivered designs that exceeded our expectations. Highly recommend!',
        project: 'Website Redesign'
      },
      {
        id: 3,
        author: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        rating: 5,
        date: '2 months ago',
        comment: 'Professional, creative, and responsive. Sarah created a design system that transformed our entire product line.',
        project: 'Design System Creation'
      }
    ],
    achievements: [
      'Top Rated Seller',
      'UI/UX Expert Certified',
      'Figma Community Leader',
      '500+ Projects Completed'
    ]
  }
]

export default function CreatorProfilePage() {
  const params = useParams()
  const router = useRouter()
  const creatorId = params.id as string

  // Find creator data (in real app, this would be fetched from API)
  const creator = creatorsData.find(c => c.id === creatorId) || creatorsData[0]

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [isFollowing, setIsFollowing] = useState(false)
  const { addItem, isInCart } = useCart()

  const portfolioFilters = ['all', 'mobile design', 'web design', 'ui/ux', 'branding']

  const filteredPortfolio = creator.portfolio.filter(item =>
    selectedFilter === 'all' ||
    item.category.toLowerCase().includes(selectedFilter.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image & Profile Header */}
      <div className="relative">
        <div className="h-64 bg-linear-to-r from-blue-600 to-purple-600 overflow-hidden">
          <Image
            src={creator.coverImage}
            alt="Cover"
            fill
            className="object-cover opacity-80"
          />
        </div>

        {/* Profile Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-6">
          <div className="max-w-7xl mx-auto flex items-end gap-6">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white">
                <AvatarImage src={creator.avatar} alt={creator.name} />
                <AvatarFallback className="text-2xl">{creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              {creator.verified && (
                <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-2">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 text-white">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{creator.name}</h1>
                {creator.topRated && (
                  <Badge className="bg-yellow-500 text-yellow-900">
                    <Award className="w-3 h-3 mr-1" />
                    Top Rated
                  </Badge>
                )}
              </div>
              <p className="text-xl text-gray-200 mb-2">{creator.title}</p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{creator.rating}</span>
                  <span className="text-gray-300">({creator.totalReviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{creator.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{creator.totalStudents} students</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setIsFollowing(!isFollowing)}
                className="flex items-center gap-2"
              >
                <Heart className={`w-4 h-4 ${isFollowing ? 'fill-current text-red-500' : ''}`} />
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
              <Link href={`/messages?creator=${params.id}`}>
                <Button className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Contact
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Profile
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Projects</span>
                  <span className="font-semibold">{creator.totalProjects}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Students</span>
                  <span className="font-semibold">{creator.totalStudents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg. Response Time</span>
                  <span className="font-semibold">{creator.responseTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold">{creator.joinedDate}</span>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {creator.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            <Card>
              <CardHeader>
                <CardTitle>Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {creator.languages.map((language, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{language}</span>
                      <span className="text-gray-600">Fluent</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {creator.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">{achievement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="services" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
              </TabsList>

              {/* Services Tab */}
              <TabsContent value="services" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {creator.services.map((service) => (
                    <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video relative">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">{service.title}</h3>
                        <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <span className="font-semibold">{service.price}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">{service.duration}</span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => addItem({
                              id: `service-${service.id}`,
                              title: service.title,
                              price: parseInt(service.price.replace('$', '')),
                              image: service.image,
                              creator: {
                                name: creator.name,
                                avatar: creator.avatar
                              },
                              type: 'service'
                            })}
                            disabled={isInCart(`service-${service.id}`)}
                          >
                            {isInCart(`service-${service.id}`) ? 'In Cart' : 'Add to Cart'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Portfolio Tab */}
              <TabsContent value="portfolio" className="space-y-6">
                {/* Portfolio Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      <select
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                        className="border rounded-md px-3 py-1 text-sm"
                      >
                        {portfolioFilters.map(filter => (
                          <option key={filter} value={filter}>
                            {filter === 'all' ? 'All Work' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Portfolio Grid */}
                <div className={viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
                }>
                  {filteredPortfolio.map((item) => (
                    <Card key={item.id} className={`overflow-hidden hover:shadow-lg transition-shadow ${viewMode === 'list' ? 'flex' : ''}`}>
                      <div className={`${viewMode === 'grid' ? 'aspect-4/3' : 'w-32 h-24'} relative`}>
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{item.category}</Badge>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{item.likes}</span>
                          </div>
                        </div>
                        <h3 className="font-semibold">{item.title}</h3>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Client Reviews</h3>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{creator.rating}</span>
                    <span className="text-gray-600">({creator.totalReviews} reviews)</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {creator.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage src={review.avatar} alt={review.author} />
                            <AvatarFallback>{review.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-semibold">{review.author}</h4>
                                <p className="text-sm text-gray-600">{review.project}</p>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-1 mb-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${i < review.rating
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-300'
                                        }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-600">{review.date}</span>
                              </div>
                            </div>

                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* About Tab */}
              <TabsContent value="about" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About Me</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{creator.bio}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>My Approach</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold">1. Understanding Your Needs</h4>
                      <p className="text-gray-700">I start every project by deeply understanding your business goals, target audience, and specific requirements.</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">2. Research & Strategy</h4>
                      <p className="text-gray-700">I conduct thorough research on your industry, competitors, and user behavior to inform design decisions.</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">3. Design & Iterate</h4>
                      <p className="text-gray-700">I create multiple design concepts, gather feedback, and iterate until we achieve the perfect solution.</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">4. Deliver & Support</h4>
                      <p className="text-gray-700">I provide comprehensive deliverables and ongoing support to ensure successful implementation.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}