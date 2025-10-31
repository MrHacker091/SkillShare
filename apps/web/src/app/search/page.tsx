'use client'

import { CreatorCard } from '@/components/creator-card'
import { ProjectCard } from '@/components/project-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { featuredCreators, featuredProjects } from '@/lib/dummy-data'
import { ArrowLeft, Eye, Grid3X3, List, Search, Star, Users } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useMemo, useState } from 'react'

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get('q') || ''

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [activeTab, setActiveTab] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    setSearchQuery(initialQuery)
  }, [initialQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  // Extended data for search
  const allProjects = [
    ...featuredProjects,
    {
      id: "5",
      title: "Mobile App UI Design",
      description: "Complete mobile app design with user flow and interactive prototypes",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
      price: 399,
      category: "Mobile Design",
      creator: {
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
  ]

  const allCreators = [
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
    }
  ]

  // Search logic
  const searchResults = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()

    if (!query) {
      return {
        projects: [],
        creators: [],
        total: 0
      }
    }

    const matchingProjects = allProjects.filter(project =>
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.category.toLowerCase().includes(query) ||
      project.creator.name.toLowerCase().includes(query) ||
      project.tags?.some(tag => tag.toLowerCase().includes(query))
    )

    const matchingCreators = allCreators.filter(creator =>
      creator.name.toLowerCase().includes(query) ||
      creator.title.toLowerCase().includes(query) ||
      creator.location?.toLowerCase().includes(query) ||
      creator.skills.some(skill => skill.toLowerCase().includes(query))
    )

    return {
      projects: matchingProjects,
      creators: matchingCreators,
      total: matchingProjects.length + matchingCreators.length
    }
  }, [searchQuery, allProjects, allCreators])

  const getFilteredResults = () => {
    switch (activeTab) {
      case 'projects':
        return { items: searchResults.projects, type: 'projects' }
      case 'creators':
        return { items: searchResults.creators, type: 'creators' }
      default:
        return {
          items: [
            ...searchResults.projects.map(p => ({ ...p, type: 'project' })),
            ...searchResults.creators.map(c => ({ ...c, type: 'creator' }))
          ],
          type: 'all'
        }
    }
  }

  const { items, type } = getFilteredResults()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  Search Results
                </h1>
                <p className="text-muted-foreground mt-2">
                  {initialQuery && `Showing results for "${initialQuery}"`}
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search projects, creators, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg border-0 bg-background/80 backdrop-blur-sm shadow-lg focus-visible:ring-2"
              />
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Results Summary & Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-muted-foreground">
              {searchResults.total} results found
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center space-x-2">
            <Button
              variant={activeTab === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('all')}
            >
              All ({searchResults.total})
            </Button>
            <Button
              variant={activeTab === 'projects' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('projects')}
            >
              Projects ({searchResults.projects.length})
            </Button>
            <Button
              variant={activeTab === 'creators' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('creators')}
            >
              Creators ({searchResults.creators.length})
            </Button>
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

        {/* Results */}
        {searchQuery && items.length === 0 ? (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search terms or browse our categories
            </p>
            <div className="flex justify-center space-x-4">
              <Button onClick={() => router.push('/projects')}>
                Browse Projects
              </Button>
              <Button variant="outline" onClick={() => router.push('/creators')}>
                Browse Creators
              </Button>
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
            : 'space-y-6'
          }>
            {items.map((item: any) => {
              if (item.type === 'creator' || (!item.price && item.skills)) {
                return viewMode === 'grid' ? (
                  <CreatorCard key={item.id} {...item} />
                ) : (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={item.avatar} alt={item.name} />
                          <AvatarFallback>{item.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <Link href={`/creators/${item.id}`}>
                                <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                                  {item.name}
                                </h3>
                              </Link>
                              <p className="text-muted-foreground">{item.title}</p>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span>{item.rating} ({item.reviewCount})</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Users className="h-4 w-4" />
                                  <span>{item.completedProjects} projects</span>
                                </div>
                              </div>
                            </div>
                            <Badge variant="secondary">Creator</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              } else {
                return viewMode === 'grid' ? (
                  <ProjectCard key={item.id} {...item} />
                ) : (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-32 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <Link href={`/projects/${item.id}`}>
                                <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                                  {item.title}
                                </h3>
                              </Link>
                              <p className="text-muted-foreground mt-1 line-clamp-2">
                                {item.description}
                              </p>
                              <div className="flex items-center space-x-4 mt-3 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span>{item.rating} ({item.reviewCount})</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Eye className="h-4 w-4" />
                                  <span>{item.views}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-xl">${item.price}</div>
                              <Badge variant="outline" className="mt-2">
                                {item.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              }
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading search...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
