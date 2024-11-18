import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn, DeleteDateColumn
} from 'typeorm';
import {User} from "../User/User";
import {PostSubComment} from "./PostSubComment";

@Entity()
export class PostSubCommentLike {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn()
    createdAt: string;

    @ManyToOne(() => PostSubComment, postSubComment => postSubComment.postSubCommentLikes, {onDelete: "CASCADE"})
    postSubComment: PostSubComment;

    @ManyToOne(() => User, user => user.createdPostSubCommentLikes)
    createdByUser: User;

    @DeleteDateColumn()
    deletedAt?: Date;
}