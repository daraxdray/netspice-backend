import {Body, Controller, Get, Post, Req, UseGuards, UseInterceptors} from '@nestjs/common';
import {UserAuthGuard} from "../guards/UserAuthGuard";
import {SentryInterceptor} from "../interceptors/sentry.interceptor";
import {
    CreatePostDto,
    DeletePostDto,
    GetPostDetailsDto,
    UpdatePostDto
} from "../entities/Post/Post";
import {PostService} from "../services/post.service";
import {
    CreatePostLikeDto,
    DeletePostLikeDto
} from "../entities/Post/PostLike";
import {UserAuthGuardInterceptor} from "../interceptors/userAuthGuard.interceptor";
import {FormDataRequest} from "nestjs-form-data";

@Controller('post')
@UseInterceptors(SentryInterceptor)
export class PostController {

    constructor(private readonly postService: PostService) {

    }

    @Post("getPostDetails")
    @UseInterceptors(UserAuthGuardInterceptor)
    getPostDetails(@Body() getPostDetailsDto: GetPostDetailsDto, @Req() request: RequestWithUserIdInterface) {
        return this.postService.getPostDetails(getPostDetailsDto, request.userAuth0Id);
    }

    // Create, Update & Delete Post
    @UseGuards(UserAuthGuard)
    @Post("createPost")
    @FormDataRequest()
    createPost(@Body() createPostDto: CreatePostDto, @Req() request: RequestWithUserIdInterface) {
        return this.postService.createPost(createPostDto, request.userAuth0Id);
    }

    @UseGuards(UserAuthGuard)
    @Post("deletePost")
    deletePost(@Body() deletePostDto: DeletePostDto, @Req() request: RequestWithUserIdInterface) {
        return this.postService.deletePost(deletePostDto, request.userAuth0Id);
    }

    @UseGuards(UserAuthGuard)
    @Post("updatePost")
    updatePost(@Body() updatePostDto: UpdatePostDto, @Req() request: RequestWithUserIdInterface) {
        return this.postService.updatePost(updatePostDto, request.userAuth0Id);
    }

    // Create and delete post likes
    @UseGuards(UserAuthGuard)
    @Post("createPostLike")
    createPostLike(@Body() createPostLikeDto: CreatePostLikeDto, @Req() request: RequestWithUserIdInterface) {
        return this.postService.createPostLike(createPostLikeDto, request.userAuth0Id);
    }

    @UseGuards(UserAuthGuard)
    @Post("deletePostLike")
    deletePostLike(@Body() deletePostLikeDto: DeletePostLikeDto, @Req() request: RequestWithUserIdInterface) {
        return this.postService.deletePostLike(deletePostLikeDto, request.userAuth0Id);
    }
}
