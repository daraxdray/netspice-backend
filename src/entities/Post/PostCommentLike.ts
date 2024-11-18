import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn, DeleteDateColumn
} from 'typeorm';
import {User} from "../User/User";
import {PostComment} from "./PostComment";

@Entity()
export class PostCommentLike {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn()
    createdAt: string;

    @ManyToOne(() => PostComment, postComment => postComment.postCommentLikes, {onDelete: "CASCADE"})
    postComment: PostComment;

    @ManyToOne(() => User, user => user.createdPostCommentLikes)
    createdByUser: User;

    @DeleteDateColumn()
    deletedAt?: Date;
}