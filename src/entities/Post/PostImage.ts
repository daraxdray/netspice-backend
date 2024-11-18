import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn
} from 'typeorm';
import {Post} from "./Post";

@Entity()
export class PostImage {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn()
    createdAt: string;

    @ManyToOne(() => Post, post => post.comments)
    post: Post;

    @Column()
    image: string;
}