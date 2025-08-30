import { AbilityBuilder, PureAbility } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { Comment, Post, PostRole, Site } from '@prisma/client';
import { Action } from 'src/permission/model/action.model';
import { EnumOrgRole } from 'src/permission/model/org-role.model';
import { LoggedInUser } from 'src/users/model/user.model';

// type Subjects = InferSubjects<typeof PostWithRole | typeof Comment> | 'all';

export type AppAbility = PureAbility<
  [
    Action,
    (
      | Subjects<{
          Post: Post;
          Comment: Comment;
          Site: Site;
        }>
      | 'all'
    ),
  ],
  PrismaQuery
>;

@Injectable()
export class CaslAbilityFactory {
  createForLoggedInUser(user: LoggedInUser) {
    const { can, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);

    if (user.orgRole === EnumOrgRole.Admin) {
      can(Action.Manage, 'all'); // read-write access to everything
    }

    can(Action.Read, 'Post', {
      public: true,
    });

    can(Action.Read, 'Post', {
      users: {
        some: {
          userId: user.id,
          role: {
            in: [PostRole.OWNER, PostRole.EDITOR, PostRole.READER],
          },
        },
      },
    });

    can(Action.Manage, 'Post', {
      users: {
        some: {
          userId: user.id,
          role: {
            in: [PostRole.OWNER, PostRole.EDITOR],
          },
        },
      },
    });

    can(Action.Update, 'Post', {
      users: {
        some: {
          userId: user.id,
          role: {
            in: [PostRole.EDITOR],
          },
        },
      },
    });

    can(Action.Read, 'Comment', {
      post: {
        users: {
          some: {
            userId: user.id,
            role: {
              in: [PostRole.OWNER, PostRole.EDITOR, PostRole.READER],
            },
          },
        },
      },
    });

    can(Action.Create, 'Comment');

    can(Action.Update, 'Comment', {
      author: {
        id: user.id,
      },
    });

    return build();
  }
}
