export { default as prisma } from './client';
export * from './generated/prisma';
export { PrismaClient } from './generated/prisma';

// Re-export all Prisma types for easy importing
export type {
  Category, CreatorProfile, CustomRequest, CustomRequestStatus, Dispute, DisputeStatus,
  LicenseType, Message,
  Notification, NotificationType, Order,
  OrderItem, OrderStatus, Payout, PayoutStatus, Product, ProductStatus, Project, ProjectStatus, RequestProposal, Review, TransactionStatus, TransactionType, User, UserRole,
  UserStatus, WalletTransaction
} from './generated/prisma';
