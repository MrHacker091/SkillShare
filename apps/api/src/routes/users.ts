import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../lib/trpc';

export const userRouter = router({
  getProfile: publicProcedure
    .input(z.object({
      userId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
        include: {
          creatorProfile: true,
          projects: {
            where: { status: 'PUBLISHED' },
            take: 6,
            orderBy: { createdAt: 'desc' },
          },
          products: {
            where: { status: 'ACTIVE' },
            take: 6,
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: {
              projects: { where: { status: 'PUBLISHED' } },
              products: { where: { status: 'ACTIVE' } },
              reviewsReceived: true,
              followers: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      // Don't return sensitive information for public profiles
      const { email, phone, ...publicProfile } = user;

      return publicProfile;
    }),

  searchCreators: publicProcedure
    .input(z.object({
      query: z.string().optional(),
      skills: z.array(z.string()).optional(),
      page: z.number().default(1),
      limit: z.number().min(1).max(50).default(12),
    }))
    .query(async ({ ctx, input }) => {
      const { query, skills, page, limit } = input;
      const offset = (page - 1) * limit;

      let where: any = {
        role: 'CREATOR' as const,
        status: 'ACTIVE' as const,
        creatorProfile: {
          isNot: null,
        },
      };

      // Add skills filter if provided
      if (skills && skills.length > 0) {
        where.creatorProfile.skills = {
          hasSome: skills,
        };
      }

      // Add query filter if provided
      if (query) {
        where.OR = [
          { name: { contains: query, mode: 'insensitive' as const } },
          { creatorProfile: { headline: { contains: query, mode: 'insensitive' as const } } },
        ];
      }

      const [creators, total] = await Promise.all([
        ctx.prisma.user.findMany({
          where,
          include: {
            creatorProfile: true,
            _count: {
              select: {
                projects: { where: { status: 'PUBLISHED' } },
                products: { where: { status: 'ACTIVE' } },
                reviewsReceived: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip: offset,
          take: limit,
        }),
        ctx.prisma.user.count({ where }),
      ]);

      return {
        creators: creators.map(({ email, phone, ...creator }) => creator),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  followUser: protectedProcedure
    .input(z.object({
      userId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = input;

      if (userId === ctx.user.id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot follow yourself',
        });
      }

      // Check if user exists
      const userToFollow = await ctx.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!userToFollow) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      // Check if already following
      const existingFollow = await ctx.prisma.follow.findUnique({
        where: {
          followerId_followeeId: {
            followerId: ctx.user.id,
            followeeId: userId,
          },
        },
      });

      if (existingFollow) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Already following this user',
        });
      }

      const follow = await ctx.prisma.follow.create({
        data: {
          followerId: ctx.user.id,
          followeeId: userId,
        },
      });

      return follow;
    }),

  unfollowUser: protectedProcedure
    .input(z.object({
      userId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = input;

      const follow = await ctx.prisma.follow.findUnique({
        where: {
          followerId_followeeId: {
            followerId: ctx.user.id,
            followeeId: userId,
          },
        },
      });

      if (!follow) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Not following this user',
        });
      }

      await ctx.prisma.follow.delete({
        where: {
          followerId_followeeId: {
            followerId: ctx.user.id,
            followeeId: userId,
          },
        },
      });

      return { success: true };
    }),

  getFollowing: protectedProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().min(1).max(50).default(20),
    }))
    .query(async ({ ctx, input }) => {
      const { page, limit } = input;
      const offset = (page - 1) * limit;

      const [following, total] = await Promise.all([
        ctx.prisma.follow.findMany({
          where: { followerId: ctx.user.id },
          include: {
            followee: {
              include: {
                creatorProfile: true,
                _count: {
                  select: {
                    projects: { where: { status: 'PUBLISHED' } },
                    products: { where: { status: 'ACTIVE' } },
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip: offset,
          take: limit,
        }),
        ctx.prisma.follow.count({
          where: { followerId: ctx.user.id },
        }),
      ]);

      return {
        following: following.map(({ followee }) => {
          const { email, phone, ...publicProfile } = followee;
          return publicProfile;
        }),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),
});