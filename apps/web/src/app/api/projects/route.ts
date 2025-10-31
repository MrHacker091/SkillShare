import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    // Build where clause for filtering
    const where: any = {
      status: 'PUBLISHED',
      visibility: true
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ]
    }

    if (category && category !== 'All') {
      where.category = { name: category }
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' }
    switch (sortBy) {
      case 'Popular':
        orderBy = { viewCount: 'desc' }
        break
      case 'Latest':
        orderBy = { createdAt: 'desc' }
        break
      case 'Price: Low to High':
        orderBy = [{ products: { price: 'asc' } }]
        break
      case 'Price: High to Low':
        orderBy = [{ products: { price: 'desc' } }]
        break
      case 'Rating':
        orderBy = { averageRating: 'desc' }
        break
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatar: true,
            creatorProfile: {
              select: {
                isVerifiedCreator: true
              }
            }
          }
        },
        category: {
          select: {
            name: true,
            slug: true
          }
        },
        products: {
          select: {
            id: true,
            price: true,
            status: true
          },
          where: {
            status: 'ACTIVE'
          },
          orderBy: {
            price: 'asc'
          },
          take: 1
        }
      }
    })

    // Transform to match frontend expectations
    const transformedProjects = projects.map((project: any) => ({
      id: project.id,
      title: project.title,
      slug: project.slug,
      description: project.description,
      image: project.thumbnail || (Array.isArray(project.images) && project.images[0]) || '',
      price: project.products[0]?.price || 0,
      category: project.category?.name || 'Uncategorized',
      creator: {
        id: project.owner.id,
        name: project.owner.name || 'Unknown Creator',
        avatar: project.owner.avatar || '',
        isVerified: project.owner.creatorProfile?.isVerifiedCreator || false
      },
      rating: 0, // TODO: Calculate from reviews when implemented
      reviewCount: 0, // TODO: Count from reviews when implemented
      likes: project.likes || 0,
      views: project.views || 0,
      tags: project.tags || []
    }))

    const totalCount = await prisma.project.count({ where })

    return NextResponse.json({
      success: true,
      projects: transformedProjects,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, categoryId, tags, images, thumbnail, demoUrl, repoUrl } = body

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create new project in database
    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        tags: tags || [],
        images: images || [],
        thumbnail,
        demoUrl,
        repoUrl,
        categoryId,
        ownerId: session.user.id,
        status: 'DRAFT',
        visibility: true
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        category: true
      }
    })

    return NextResponse.json({
      success: true,
      project: newProject,
      message: 'Project created successfully'
    })

  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}