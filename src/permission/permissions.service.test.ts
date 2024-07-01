import { createMock } from '@golevelup/ts-vitest';
import { Test } from '@nestjs/testing';
import 'reflect-metadata';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import * as getUser from 'src/common/utils/get-user';
import { PostsRepo } from 'src/posts/posts.repo';
import { LoggedInUser } from 'src/users/model/user.model';
import { mockPrismaPosts, mockPrismaUsers } from 'test/mocks';
import { beforeEach, describe, it, vi } from 'vitest';
import { Action } from './model/action.model';
import { EnumOrgRole } from './model/org-role.model';
import { ResourceType } from './model/resources.model';
import { PermissionsService } from './permissions.service';

describe('PermissionsService', () => {
  let permissionsService: PermissionsService;
  let postsRepo: PostsRepo;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PermissionsService, PostsRepo, CaslAbilityFactory],
    })
      .useMocker(createMock)
      .compile();

    permissionsService = moduleRef.get<PermissionsService>(PermissionsService);
    postsRepo = moduleRef.get<PostsRepo>(PostsRepo);
  });

  describe('checkPermission', () => {
    it('should allow a user to read their own posts', async () => {
      const mockUser = mockPrismaUsers[0];
      const mockLoggedInUser: LoggedInUser = {
        ...mockUser,
        orgId: 'orgId',
        orgRole: EnumOrgRole.Admin,
      };
      const mockPost: Awaited<ReturnType<typeof postsRepo.getPostWithRole>> = {
        ...mockPrismaPosts[0],
        users: [
          {
            role: 'OWNER',
            userId: mockLoggedInUser.id,
          },
        ],
        _count: {
          comments: 10,
        },
      };
      vi.spyOn(postsRepo, 'getPostWithRole').mockResolvedValue(mockPost);
      vi.spyOn(getUser, 'getUserOrThrow').mockImplementation(
        () => mockLoggedInUser,
      );

      expect(
        await permissionsService.checkPermission(
          {
            action: Action.Read,
            type: ResourceType.Post,
          },
          mockPost.id,
        ),
      ).toBe(true);
    });
  });
});
