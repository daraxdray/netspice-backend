import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
    ManyToMany,
    JoinTable,
    CreateDateColumn, DeleteDateColumn
} from 'typeorm';
import {Post} from "./Post";
import {IsAlphanumeric, IsOptional, IsUUID} from "class-validator";
import {User} from "../User/User";

export class DeletePostLikeDto {
    @IsUUID()
    postId: string;
}

export class CreatePostCommentRequestDto {
    @IsUUID()
    postId: string;

    @IsAlphanumeric()
    content: string;
}

export class CreatePostSubCommentRequestDto {
    @IsUUID()
    postCommentId: string;

    @IsAlphanumeric()
    content: string;
}

export class CreatePostLikeDto {
    @IsUUID()
    postId: string;
}

@Entity()
export class PostLike {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn()
    createdAt: string;

    @ManyToOne(() => Post, post => post.comments)
    post: Post;

    @ManyToOne(() => User, user => user.createdPostComments)
    createdByUser: User;

    @DeleteDateColumn()
    deletedAt?: Date;
}