import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
            bio: true,
            location: true,
            createdAt: true,
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
            }
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        },
        products: {
          where: {
            status: "ACTIVE"
          },
          select: {
            id: true,
            title: true,
            price: true,
            currency: true,
            licenseType: true,
            sales: true,
          }
        }
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.project.update({
      where: { id },
      data: { views: { increment: 1 } }
    });

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}
