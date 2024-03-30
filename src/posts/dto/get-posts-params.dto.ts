import { IsOptional, IsUUID } from 'class-validator';

export class GetPostsQueryDto {
  @IsOptional()
  @IsUUID()
  author?: string;
}
