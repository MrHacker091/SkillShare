import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const skill = searchParams.get('skill')
    const minRate = searchParams.get('minRate')
    const maxRate = searchParams.get('maxRate')
    const experience = searchParams.get('experience')
    const sortBy = searchParams.get('sortBy') || 'Popular'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    // Build where clause for filtering
    const where: any = {
      role: 'CREATOR',
      status: 'ACTIVE',
      creatorProfile: {
        isNot: null
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
        {
          creatorProfile: {
            skills: {
              hasSome: [search]
            }
          }
        }
      ]
    }

    if (skill && skill !== 'All') {
      where.creatorProfile = {
        ...where.creatorProfile,
        skills: {
          has: skill
        }
      }
    }

    if (minRate || maxRate) {
      const rateFilter: any = {}
      if (minRate) rateFilter.gte = parseFloat(minRate)
      if (maxRate) rateFilter.lte = parseFloat(maxRate)

      where.creatorProfile = {
        ...where.creatorProfile,
        hourlyRate: rateFilter
      }
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' }
    switch (sortBy) {
      case 'Popular':
        orderBy = {
          creatorProfile: {
            totalSales: 'desc'
          }
        }
        break
      case 'Rating':
        orderBy = {
          creatorProfile: {
            averageRating: 'desc'
          }
        }
        break
      case 'Most Projects':
        orderBy = {
          creatorProfile: {
            portfolioCount: 'desc'
          }
        }
        break
      case 'Newest':
        orderBy = { createdAt: 'desc' }
        break
      case 'Lowest Rate':
        orderBy = {
          creatorProfile: {
            hourlyRate: 'asc'
          }
        }
        break
      case 'Highest Rate':
        orderBy = {
          creatorProfile: {
            hourlyRate: 'desc'
          }
        }
        break
    }

    const creators = await prisma.user.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        creatorProfile: true,
        projects: {
          where: {
            status: 'PUBLISHED',
            visibility: true
          },
          take: 3,
          orderBy: {
            createdAt: 'desc'
          },
          select: {
            id: true,
            title: true,
            thumbnail: true,
            images: true
          }
        },
        _count: {
          select: {
            projects: {
              where: {
                status: 'PUBLISHED'
              }
            },
            reviewsReceived: true
          }
        }
      }
    })

    // Transform to match frontend expectations
    const transformedCreators = creators.map(creator => ({
      id: creator.id,
      name: creator.name || 'Unknown Creator',
      title: creator.creatorProfile?.headline || 'Creator',
      avatar: creator.avatar || '',
      coverImage: creator.creatorProfile ?
        `https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&h=96&fit=crop` : '',
      location: creator.location || '',
      skills: creator.creatorProfile?.skills || [],
      rating: Number(creator.creatorProfile?.averageRating) || 0,
      reviewCount: creator._count.reviewsReceived,
      completedProjects: creator._count.projects,
      responseTime: '2 hours', // This could be calculated from message response times
      isVerified: creator.creatorProfile?.isVerifiedCreator || creator.isVerified,
      startingPrice: Number(creator.creatorProfile?.hourlyRate) || 0,
      portfolio: creator.projects.map(project => ({
        id: project.id,
        title: project.title,
        image: project.thumbnail || project.images[0] || ''
      }))
    }))

    const totalCount = await prisma.user.count({ where })

    return NextResponse.json({
      success: true,
      creators: transformedCreators,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching creators:', error)
    return NextResponse.json({ error: 'Failed to fetch creators' }, { status: 500 })
  }
}