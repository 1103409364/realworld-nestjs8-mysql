import {
  Get,
  Post,
  Body,
  Put,
  Delete,
  Query,
  Param,
  Controller,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiTags,
  ApiBody,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { ArticleService } from "./article.service";
import { User } from "../user/user.decorator";
import { CreateArticleDto, CreateCommentDto, CreateCommentRO } from "./dto";
import { ArticlesRO, ArticleRO } from "./article.interface";
import { CommentsRO } from "./article.interface";
import { CreateArticleRO } from "./dto/create-article.dto";
import { UpdateArticleDto, UpdateArticleRO } from "./dto/update-article.dto";

@ApiBearerAuth()
@ApiTags("articles")
@Controller("articles")
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({ summary: "Get all articles" })
  @ApiResponse({ status: 200, description: "Return all articles." })
  @ApiQuery({ name: "tag", required: false })
  @ApiQuery({ name: "author", required: false })
  @ApiQuery({ name: "favorite", required: false })
  @ApiQuery({ name: "limit", required: false })
  @ApiQuery({ name: "offset", required: false })
  @Get()
  async findAll(
    @Query() query,
    @User("id") userId: number,
  ): Promise<ArticlesRO> {
    return await this.articleService.findAll(query, userId);
  }

  @ApiOperation({ summary: "Get you feed" })
  @ApiResponse({ status: 200, description: "Return articles." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiQuery({ name: "offset", description: "offset", required: false })
  @ApiQuery({ name: "limit", description: "limit", required: false })
  @Get("feed")
  async getFeed(
    @User("id") userId: number,
    @Query() query,
  ): Promise<ArticlesRO> {
    return await this.articleService.findFeed(userId, query);
  }

  @ApiOperation({ summary: "Get article by slug" })
  // 参数 slug 写上类型注解，可以省略 ApiParam 装饰器，swagger 会自动推断
  // @ApiParam({ name: 'slug', description: 'article slug', required: true })
  @Get(":slug")
  async findOne(
    @Param("slug") slug: string,
    @User("id") userId: number,
  ): Promise<ArticleRO> {
    return await this.articleService.findOne(slug, userId);
  }

  @ApiOperation({ summary: "Get article comments" })
  @Get(":slug/comments")
  async findComments(@Param("slug") slug: string): Promise<CommentsRO> {
    return await this.articleService.findComments(slug);
  }

  @ApiOperation({ summary: "Create article" })
  @ApiResponse({
    status: 201,
    description: "The article has been successfully created.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiBody({ type: CreateArticleRO })
  @Post()
  async create(
    @User("id") userId: number,
    @Body("article") articleData: CreateArticleDto,
  ) {
    return this.articleService.create(userId, articleData);
  }

  @ApiOperation({ summary: "Update article" })
  @ApiResponse({
    status: 201,
    description: "The article has been successfully updated.",
  })
  @ApiBody({ type: UpdateArticleRO })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @Put(":slug")
  async update(
    @Param("slug") slug: string,
    @Body("article") articleData: UpdateArticleDto,
  ) {
    // Todo: update slug also when title gets changed
    return this.articleService.update(slug, articleData);
  }

  @ApiOperation({ summary: "Delete article" })
  @ApiParam({ name: "slug", description: "article slug", required: true })
  @ApiResponse({
    status: 201,
    description: "The article has been successfully deleted.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @Delete(":slug")
  async delete(@Param() params) {
    return this.articleService.delete(params.slug);
  }

  @ApiOperation({ summary: "Create comment" })
  @ApiResponse({
    status: 201,
    description: "The comment has been successfully created.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiBody({ type: CreateCommentRO })
  @Post(":slug/comments")
  async createComment(
    @Param("slug") slug: string,
    @Body("comment") createCommentDto: CreateCommentDto,
    @User("id") userId: number,
  ) {
    return await this.articleService.addComment(slug, createCommentDto, userId);
  }

  @ApiOperation({ summary: "Delete comment" })
  @ApiResponse({
    status: 201,
    description: "The article has been successfully deleted.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @Delete(":slug/comments/:id")
  async deleteComment(@Param("slug") slug: string, @Param("id") id: number) {
    return await this.articleService.deleteComment(slug, id);
  }

  @ApiOperation({ summary: "Favorite article" })
  @ApiResponse({
    status: 201,
    description: "The article has been successfully favorite.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @Post(":slug/favorite")
  async favorite(@User("id") userId: number, @Param("slug") slug: string) {
    return await this.articleService.favorite(userId, slug);
  }

  @ApiOperation({ summary: "Unfavorite article" })
  @ApiResponse({
    status: 201,
    description: "The article has been successfully unfavorite.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @Delete(":slug/favorite")
  async unFavorite(@User("id") userId: number, @Param("slug") slug: string) {
    return await this.articleService.unFavorite(userId, slug);
  }
}
