import { createMock } from '@golevelup/ts-vitest';
import { Test } from '@nestjs/testing';
import 'reflect-metadata';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import * as getUser from 'src/common/utils/get-user';
import { PostsRepo } from 'src/posts/posts.repo';
import { LoggedInUser, User } from 'src/users/model/user.model';
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
      const mockedUser: User = { id: 'userId', name: 'Name', email: 'email' };
      const mockedLoggedInUser: LoggedInUser = {
        ...mockedUser,
        orgId: 'orgId',
        orgRole: EnumOrgRole.Member,
      };
      const mockedPost: Awaited<ReturnType<typeof postsRepo.getPost>> = {
        users: [
          {
            role: 'OWNER',
            user: { ...mockedUser, sub: null, id: 'userId2' },
          },
        ],
        id: 'post1',
        title: 'Post Title',
        body: 'Post Body',
        public: false,
        createdAt: new Date(),
        _count: {
          comments: 10,
        },
        deletedAt: null,
        orgId: null,
      };
      vi.spyOn(postsRepo, 'getPost').mockResolvedValue(mockedPost);
      vi.spyOn(getUser, 'getUserOrThrow').mockImplementation(
        () => mockedLoggedInUser,
      );

      expect(
        await permissionsService.checkPermission(
          {
            action: Action.Read,
            type: ResourceType.Post,
          },
          mockedPost.id,
        ),
      ).toBe(true);
    });
  });
});
