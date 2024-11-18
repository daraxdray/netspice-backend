import {
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
    ManyToMany,
    JoinTable,
    CreateDateColumn, DeleteDateColumn, Entity
} from 'typeorm';
import {PostComment} from "./PostComment";
import {IsAlphanumeric, IsArray, IsBoolean, IsNumber, IsOptional, IsUUID} from "class-validator";
import {User} from "../User/User";
import {PostLike} from "./PostLike";
import {PostImage} from "./PostImage";
import {FileSystemStoredFile, HasMimeType, IsFiles, MaxFileSize} from "nestjs-form-data";

export class ReportPostDto {
    @IsUUID()
    postId: string;
}

export class DeletePostDto {
    @IsUUID()
    id: string;
}

export class GetPostDetailsDto {
    @IsUUID()
    id: string;
}

export class CreatePostDto {
    @IsAlphanumeric()
    title: string;

    @IsAlphanumeric()
    description: string;

    @IsNumber()
    locationLat: string;

    @IsNumber()
    locationLon: string;

    @IsFiles()
    // @MaxFileSize(1e6, { each: true })
    @HasMimeType(['image/jpeg', 'image/png'], {each: true})
    images: FileSystemStoredFile[];
}

export class UpdatePostDto {
    @IsUUID()
    id: string;

    @IsAlphanumeric()
    title: string;

    @IsAlphanumeric()
    description: string;
}

@Entity()
export class Post {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn()
    createdAt: string;

    @Column()
    title: string;

    @Column({nullable: true, type: "double precision"})
    locationLat: number;

    @Column({nullable: true, type: "double precision"})
    locationLon: number;

    @Column({type: "boolean", nullable: false, default: false})
    isLocked: boolean;

    @Column({type: "longtext", nullable: true, default: null})
    lockReason: string;

    @Column({type: "longtext"})
    description: string;

    @ManyToOne(() => User, user => user.createdPosts, {nullable: true})
    createdByUser: User;

    @OneToMany(() => PostComment, postComment => postComment.post, {onDelete: "CASCADE"})
    comments: PostComment[];

    @OneToMany(() => PostImage, postImage => postImage.post, {onDelete: "CASCADE", eager: true})
    postImages: PostImage[];

    @OneToMany(() => PostLike, postLike => postLike.post, {onDelete: "CASCADE"})
    postLikes: PostLike[];

    @ManyToMany(() => User)
    @JoinTable()
    views: User[];

    @DeleteDateColumn()
    deletedAt?: Date;
}