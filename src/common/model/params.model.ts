import { CommentParamsDto } from 'src/comments/dto/comment-params.dto';
import { PostParamsDto } from 'src/posts/dto/post-params.dto';
import { UserParamsDto } from 'src/users/dto/user-params.dto';

interface CombinedParams
  extends PostParamsDto,
    CommentParamsDto,
    UserParamsDto {}

export type Params = Partial<CombinedParams>;
