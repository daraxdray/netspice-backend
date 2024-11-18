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
import {PostComment} from "./PostComment";
import {IsAlphanumeric, IsOptional, IsUUID} from "class-validator";
import {User} from "../User/User";
import {PostSubCommentLike} from "./PostSubCommentLike";

export class ReportPostSubCommentDto {
    @IsUUID()
    postSubCommentId: string;
}

export class DeletePostSubCommentDto {
    @IsUUID()
    id: string;
}

export class CreatePostSubCommentDto {
    @IsAlphanumeric()
    content: string;

    @IsUUID()
    commentId: string;
}

@Entity()
export class PostSubComment {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn()
    createdAt: string;

    @Column()
    content: string;

    @ManyToOne(() => User, user => user.createdPostSubComments)
    createdByUser: User;

    @ManyToOne(() => PostComment, postComment => postComment.subComments)
    postComment: PostComment;

    @OneToMany(() => PostSubCommentLike, postSubCommentLike => postSubCommentLike.postSubComment, {onDelete: "CASCADE"})
    postSubCommentLikes: PostSubCommentLike[];

    @DeleteDateColumn()
    deletedAt?: Date;
}