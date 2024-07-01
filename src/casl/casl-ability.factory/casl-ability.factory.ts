import {
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Comment } from 'src/comments/model/comment.model';
import { Action } from 'src/permission/model/action.model';
import { EnumOrgRole } from 'src/permission/model/org-role.model';
import { EnumPostRole } from 'src/permission/model/post-role.model';
import { PostWithRole } from 'src/posts/model/post.model';
import { LoggedInUser } from 'src/users/model/user.model';

type Subjects = InferSubjects<typeof PostWithRole | typeof Comment> | 'all';

export type AppAbility = PureAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForLoggedInUser(user: LoggedInUser) {
    const { can, build } = new AbilityBuilder(createMongoAbility);

    can(Action.Read, Comment);

    if (user.orgRole === EnumOrgRole.Admin) {
      can(Action.Manage, 'all'); // read-write access to everything
    }

    can(Action.Read, PostWithRole, {
      public: true,
    });

    can(Action.Read, PostWithRole, {
      role: { $in: [EnumPostRole.Reader, EnumPostRole.Editor] },
    });

    can(Action.Manage, PostWithRole, {
      role: EnumPostRole.Owner,
    });

    can(Action.Update, PostWithRole, {
      role: EnumPostRole.Editor,
    });

    can(Action.Update, Comment, {
      author: {
        id: user.id,
      },
    });

    return build({
      // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
