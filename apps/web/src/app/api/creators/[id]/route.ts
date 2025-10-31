import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const creator = await prisma.user.findUnique({
      where: { 
        id,
        role: "CREATOR"
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: false, // Don't expose email
        avatar: true,
        bio: true,
        location: true,
        website: true,
        createdAt: true,
        isVerified: true,
        creatorProfile: {
          select: {
            headline: true,
            skills: true,
            experience: true,
            hourlyRate: true,
            portfolioCount: true,
            totalSales: true,
            averageRating: true,
            totalReviews: true,
            isVerifiedCreator: true,
            badges: true,
          }
        },
        projects: {
          where: {
            status: "PUBLISHED",
            visibility: true,
          },
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            thumbnail: true,
            images: true,
            tags: true,
            views: true,
            likes: true,
            createdAt: true,
            category: {
              select: {
                name: true,
                slug: true,
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          }
        },
        products: {
          where: {
            status: "ACTIVE"
          },
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            price: true,
            currency: true,
            licenseType: true,
            sales: true,
            views: true,
          },
          orderBy: {
            sales: "desc"
          }
        },
        reviewsReceived: {
          select: {
            id: true,
            rating: true,
            title: true,
            content: true,
            createdAt: true,
            reviewer: {
              select: {
                name: true,
                avatar: true,
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          },
          take: 10
        },
        _count: {
          select: {
            projects: true,
            products: true,
            followers: true,
          }
        }
      }
    });

    if (!creator) {
      return NextResponse.json(
        { error: "Creator not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, creator });
  } catch (error) {
    console.error("Error fetching creator:", error);
    return NextResponse.json(
      { error: "Failed to fetch creator" },
      { status: 500 }
    );
  }
}
