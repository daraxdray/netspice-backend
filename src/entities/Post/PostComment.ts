import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
    CreateDateColumn, DeleteDateColumn
} from 'typeorm';
import {Post} from "./Post";
import {PostSubComment} from "./PostSubComment";
import {IsAlphanumeric, IsOptional, IsUUID} from "class-validator";
import {User} from "../User/User";
import {PostCommentLike} from "./PostCommentLike";

export class ReportPostCommentDto {
    @IsUUID()
    postCommentId: string;
}

export class DeletePostCommentDto {
    @IsUUID()
    id: string;
}

export class CreatePostCommentDto {
    @IsAlphanumeric()
    content: string;

    @IsUUID()
    postId: string;
}

@Entity()
export class PostComment {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn()
    createdAt: string;

    @Column()
    content: string;

    @ManyToOne(() => Post, post => post.comments)
    post: Post;

    @ManyToOne(() => User, user => user.createdPostComments)
    createdByUser: User;

    @OneToMany(() => PostSubComment, postSubComment => postSubComment.postComment, {onDelete: "CASCADE"})
    subComments: PostSubComment[];

    @OneToMany(() => PostCommentLike, postCommentLike => postCommentLike.postComment, {onDelete: "CASCADE"})
    postCommentLikes: PostCommentLike[];

    @DeleteDateColumn()
    deletedAt?: Date;
}