import { createId } from '@paralleldrive/cuid2';
import { Post as PrismaPost, User as PrismaUser } from '@prisma/client';

export const mockOrgIds = [createId(), createId(), createId()];

export function mockPrismaPostTemplate(data?: Partial<PrismaPost>): PrismaPost {
  const id = createId();
  return {
    id,
    title: `Mock Post - ${id.slice(4)}`,
    public: false,
    body: `Mock Body for Post ${id.slice(4)}`,
    createdAt: new Date(),
    deletedAt: null,
    orgId: mockOrgIds[0],
    ...data,
  };
}

export const mockPrismaPosts: PrismaPost[] = [
  mockPrismaPostTemplate(),
  mockPrismaPostTemplate(),
  mockPrismaPostTemplate(),
];

export function mockPrismaUserTemplate(data?: Partial<PrismaUser>): PrismaUser {
  const id = createId();
  return {
    id,
    name: `Mock User ${id.slice(4)}`,
    email: `mock-email-${id.slice(4)}$@test.org`,
    ...data,
  };
}

export const mockPrismaUsers: PrismaUser[] = [
  mockPrismaUserTemplate(),
  mockPrismaUserTemplate(),
  mockPrismaUserTemplate(),
];
