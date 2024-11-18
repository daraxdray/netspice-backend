import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreatePostDto, DeletePostDto, GetPostDetailsDto, Post, UpdatePostDto} from "../entities/Post/Post";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CreatePostLikeDto, DeletePostLikeDto, PostLike} from "../entities/Post/PostLike";
import {User} from "../entities/User/User";
import {PostImage} from "../entities/Post/PostImage";
import {ConfigService} from "@nestjs/config";
import {PostComment} from "../entities/Post/PostComment";
import {PostSubComment} from "../entities/Post/PostSubComment";

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post) private postRepository: Repository<Post>,
        @InjectRepository(PostComment) private postCommentRepository: Repository<PostComment>,
        @InjectRepository(PostSubComment) private postSubCommentRepository: Repository<PostSubComment>,
        @InjectRepository(PostLike) private postLikeRepository: Repository<PostLike>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(PostImage) private postImageRepository: Repository<PostImage>,
        private configService: ConfigService
    ) {
    }

    async createPostLike(createPostLikeDto: CreatePostLikeDto, currentUserId: string): Promise<void> {
        const newPostLike = new PostLike();
        newPostLike.post = await this.postRepository.findOne({where: {id: createPostLikeDto.postId}});

        const currentUser = await this.userRepository.findOne({
            where: {auth0Id: currentUserId}
        });
        newPostLike.createdByUser = currentUser;
        await this.postLikeRepository.save(newPostLike);
    }

    async createPost(createPostDto: CreatePostDto, currentUserId: string): Promise<void> {
        const newPost = new Post();
        newPost.title = createPostDto.title;
        newPost.description = createPostDto.description;
        newPost.locationLat = Number(createPostDto.locationLat);
        newPost.locationLon = Number(createPostDto.locationLon);
        newPost.postImages = [];

        newPost.createdByUser = await this.userRepository.findOne({
            where: {auth0Id: currentUserId}
        });

        await this.postRepository.save(newPost);

        for (const image of createPostDto.images) {
            const newPostImage = new PostImage();
            newPostImage.image = this.configService.get<string>("default.uploadedFileUrl") + "/" + image.path.split("/").slice(-1)[0];
            newPostImage.post = newPost;
            await this.postImageRepository.save(newPostImage);
        }

        createPostDto.images = null;
        console.log(createPostDto);
    }

    async deletePost(deletePostDto: DeletePostDto, currentUserId: string): Promise<void> {
        if (await this.hasUserPermissionsForPost(deletePostDto.id, currentUserId) == false) {
            throw new HttpException("User has no permissions to delete post " + deletePostDto.id, 500);
        }
        await this.postRepository.softRemove({id: deletePostDto.id});
    }

    async deletePostLike(deletePostLikeDto: DeletePostLikeDto, currentUserId: string): Promise<void> {
        let deletePostLike = null;

        deletePostLike = await this.postLikeRepository.findOne({
            where: {
                post: {
                    id: deletePostLikeDto.postId
                }
            },
            relations: {
                createdByUser: {}
            }
        });

        await this.postLikeRepository.softRemove(deletePostLike);
    }

    async updatePost(updatePostDto: UpdatePostDto, currentUserId: string): Promise<void> {
        if (await this.hasUserPermissionsForPost(updatePostDto.id, currentUserId) == false) {
            throw new HttpException("User has no permissions to update post " + updatePostDto.id, 500);
        }
        const existingPost = await this.postRepository.findOne({where: {id: updatePostDto.id}});
        existingPost.title = updatePostDto.title;
        existingPost.description = updatePostDto.description;
        await this.postRepository.save(existingPost);
    }

    async hasUserPermissionsForPost(currentPostId: string, userAuth0Id: string): Promise<boolean> {
        const currentUser = await this.userRepository.findOne({
            where: {
                auth0Id: userAuth0Id
            }
        });

        const currentPost = await this.postRepository.findOne({
            where: {
                id: currentPostId
            }
        });
        let currentPostIsCreatedByUser: boolean = false;
        if (currentPost.createdByUser.id == currentUser.id) {
            currentPostIsCreatedByUser = true;
        }

        return (currentPostIsCreatedByUser);
    }

    async getTrendPosts(userId: string): Promise<Post[]> {
        const posts = await this.postRepository.find({
            relations: {
                createdByUser: {},
                comments: {
                    createdByUser: {},
                    subComments: {createdByUser: {}}
                },
                postLikes: {
                    createdByUser: {}
                },
            }
        });

        const finalPosts = [];
        for (let i = 0; i < posts.length; i++) {
            const post = posts[i];
            if (post.createdByUser == null) {
                console.error("Post with id " + post.id + " has no createdByUser");
            } else {
                finalPosts.push(post);
            }
        }

        let finalPosts2 = [];
        for (let i = 0; i < finalPosts.length; i++) {
            const post = finalPosts[i];
            if (!finalPosts2.find(currentPostToCheck => currentPostToCheck.id == post.id)) {
                finalPosts2.push(post);
            }
        }

        finalPosts2.sort((a, b) => {
            return b.createdAt.getTime() - a.createdAt.getTime();
        });

        return finalPosts2;
    }

    async getPostDetails(getPostDetailsDto: GetPostDetailsDto, userAuth0Id) {
        const post = await this.postRepository.findOne({
            where: {
                id: getPostDetailsDto.id
            },
            relations: {
                comments: {
                    createdByUser: {},
                    postCommentLikes: {
                        createdByUser: {}
                    },
                    subComments: {
                        createdByUser: {},
                        postSubCommentLikes: {
                            createdByUser: {}
                        }
                    }
                },
                postLikes: {
                    createdByUser: {}
                },
                createdByUser: {}
            }
        });

        return post;
    }
}
