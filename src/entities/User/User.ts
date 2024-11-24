import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    CreateDateColumn, DeleteDateColumn
} from 'typeorm';
import {Post} from "../Post/Post";
import {PostSubComment} from "../Post/PostSubComment";
import {PostLike} from "../Post/PostLike";
import {PostSubCommentLike} from "../Post/PostSubCommentLike";
import {PostCommentLike} from "../Post/PostCommentLike";
import {PostComment} from "../Post/PostComment";
import {IsAlphanumeric, IsUUID} from "class-validator";
import { Book } from '../Book/Book';

export class ReportUserDto {
    @IsUUID()
    userId: string;
}

export class GetUserDetailsDto {
    @IsAlphanumeric()
    userId: string;
}

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn()
    createdAt: string;

    @Column({nullable: true})
    auth0Id: string;

    @Column()
    name: string;

    @Column({type: "longtext"})
    description: string;

    @Column({type: "timestamp", nullable: true})
    birthDate: Date;

    @Column({nullable: true})
    image: string;

    @OneToMany(() => PostComment, postComment => postComment.createdByUser, {onDelete: "CASCADE"})
    createdPostComments: PostComment[];

    @OneToMany(() => PostCommentLike, postCommentLike => postCommentLike.createdByUser, {onDelete: "CASCADE"})
    createdPostCommentLikes: PostComment[];

    @OneToMany(() => PostSubCommentLike, postSubCommentLike => postSubCommentLike.createdByUser, {onDelete: "CASCADE"})
    createdPostSubCommentLikes: PostComment[];

    @OneToMany(() => PostLike, postLike => postLike.createdByUser, {onDelete: "CASCADE"})
    createdPostLikes: PostLike[];

    @OneToMany(() => PostSubComment, postSubComment => postSubComment.createdByUser, {onDelete: "CASCADE"})
    createdPostSubComments: PostSubComment[];

    @OneToMany(() => Post, post => post.createdByUser, {onDelete: "CASCADE"})
    createdPosts: Post[];

    @DeleteDateColumn()
    deletedAt?: Date;

    @OneToMany(() => Book, (book) => book.user)
    books: Book[];

    iAmFollowing: boolean = false;
    isBlocked: boolean = false;

    upvoteCount: number = 0;
}