// Temporary in-memory storage for demo purposes
// In production, use a proper database

export interface CreatorUser {
  email: string;
  password: string;
  name: string;
  firstName: string;
  lastName: string;
  university: string;
  major: string;
  isVerified: boolean;
  createdAt: Date;
}

export interface CustomerUser {
  email: string;
  password: string;
  name: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  createdAt: Date;
}

// Global storage for users
export const creatorUsers = new Map<string, CreatorUser>();
export const customerUsers = new Map<string, CustomerUser>();