import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Comment } from 'src/comments/model/comment.model';
import { Action } from 'src/permission/model/action.model';
import { EnumOrgRole } from 'src/permission/model/org-role.model';
import { Post } from 'src/posts/model/post.model';
import { LoggedInUser } from 'src/users/model/user.model';

type Subjects = InferSubjects<typeof Post | typeof Comment> | 'all';

export type AppAbility = PureAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForLoggedInUser(user: LoggedInUser) {
    const { can, cannot, build } = new AbilityBuilder<
      PureAbility<[Action, Subjects]>
    >(PureAbility as AbilityClass<AppAbility>);

    if (user.orgRole === EnumOrgRole.Admin) {
      can(Action.Manage, 'all'); // read-write access to everything
    } else {
      can(Action.Read, 'all'); // read-only access to everything
    }

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
