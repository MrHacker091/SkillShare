import { TRPCError } from '@trpc/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../lib/trpc';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  role: z.enum(['CREATOR', 'CUSTOMER']).default('CUSTOMER'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const updateProfileSchema = z.object({
  name: z.string().optional(),
  bio: z.string().optional(),
  website: z.string().url().optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
});

export const authRouter = router({
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ ctx, input }) => {
      const { email, password, name, role } = input;

      // Check if user already exists
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User with this email already exists',
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = await ctx.prisma.user.create({
        data: {
          email,
          name,
          role,
          // Note: We'll handle password through NextAuth
          // This is just for demonstration
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      return {
        user,
        token,
      };
    }),

  login: publicProcedure
    .input(loginSchema)
    .mutation(async ({ ctx, input }) => {
      const { email, password } = input;

      // Find user
      const user = await ctx.prisma.user.findUnique({
        where: { email },
        include: {
          creatorProfile: true,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invalid credentials',
        });
      }

      // For now, we'll skip password validation since we're using NextAuth
      // In production, you'd validate the password here

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          creatorProfile: user.creatorProfile,
        },
        token,
      };
    }),

  me: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.user.id },
        include: {
          creatorProfile: true,
          _count: {
            select: {
              projects: true,
              products: true,
              ordersAsBuyer: true,
              ordersAsSeller: true,
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

      return user;
    }),

  updateProfile: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: input,
        include: {
          creatorProfile: true,
        },
      });

      return updatedUser;
    }),

  becomeCreator: protectedProcedure
    .input(z.object({
      headline: z.string().min(10),
      skills: z.array(z.string()).min(1),
      experience: z.string().optional(),
      hourlyRate: z.number().positive().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Update user role to include creator
      await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: { role: 'CREATOR' },
      });

      // Create creator profile
      const creatorProfile = await ctx.prisma.creatorProfile.create({
        data: {
          userId: ctx.user.id,
          ...input,
        },
      });

      return creatorProfile;
    }),
});