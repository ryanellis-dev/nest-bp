import { $Enums, PostRole } from '@prisma/client';
import { PostWithRole } from 'src/posts/model/post.model';
import { EnumPostRole } from '../model/post-role.model';

const ENUM_MAP = {
  [PostRole.OWNER]: EnumPostRole.Owner,
  [PostRole.EDITOR]: EnumPostRole.Editor,
  [PostRole.READER]: EnumPostRole.Reader,
};

export function prismaPostRoleToModel(role: PostRole | null) {
  return role ? ENUM_MAP[role] : null;
}

export function transformPostWithRole(
  post: Partial<PostWithRole> & {
    users: { userId: string; role: $Enums.PostRole }[];
  },
  userId: string,
) {
  const postWithRole = new PostWithRole({
    ...post,
    role: prismaPostRoleToModel(
      post.users?.find((u) => u.userId === userId)?.role || null,
    ),
  });
  return postWithRole;
}
