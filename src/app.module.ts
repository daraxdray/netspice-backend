import {Module} from '@nestjs/common';
import {Post} from "./entities/Post/Post";
import {PostComment} from "./entities/Post/PostComment";
import {PostSubComment} from "./entities/Post/PostSubComment";
import {TypeOrmModule} from "@nestjs/typeorm";
import {MulterModule} from "@nestjs/platform-express";
import {ConfigModule} from '@nestjs/config';
import nodeConfig from "./envConfig/node.config";
import {PostController} from "./controller/post.controller";
import {PostService} from "./services/post.service";
import {PostLike} from "./entities/Post/PostLike";
import {User} from "./entities/User/User";
import {UserController} from "./controller/user.controller";
import {UserService} from "./services/user.service";
import {FileSystemStoredFile, NestjsFormDataModule} from "nestjs-form-data";
import {PostImage} from "./entities/Post/PostImage";
import {PostCommentLike} from "./entities/Post/PostCommentLike";
import {PostSubCommentLike} from "./entities/Post/PostSubCommentLike";
import {MailerModule} from "@nestjs-modules/mailer";
import { Answer } from './entities/Book/Answers';
import { Question } from './entities/Book/Question';
import { Page } from './entities/Book/Page';
import { AnswerController } from './controller/answer_controller';
import { AnswerService } from './services/answer.service';
import { Media } from './entities/Book/Media';
import { Book } from './entities/Book/Book';

const entities = [
    Post,
    PostLike,
    PostComment,
    PostSubComment,
    PostImage,
    User,
    PostCommentLike,
    PostSubCommentLike,
    Answer,
    Question,
    Media,
    Page,
    Book,
]

@Module({
    imports: [
        NestjsFormDataModule.config({
            storage: FileSystemStoredFile,
            fileSystemStoragePath: './uploads',
            autoDeleteFile: false
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            load: [nodeConfig],
        }),
        MulterModule.register({
            dest: './upload',
        }),
        
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST != null ? process.env.DB_HOST : '127.0.0.1',
            port: parseInt(process.env.DB_PORT) || 3306,
            username:
                process.env.DB_USERNAME != null ? process.env.DB_USERNAME : 'root',
            password:
                process.env.DB_PASSWORD != null ? process.env.DB_PASSWORD : '',
            database: process.env.DB_NAME || 'my-tom',
            entities: entities,
            // logging: ["query"],
            charset: 'utf8mb4',
            synchronize: process.env.SYNCHRONIZE != null ? process.env.SYNCHRONIZE == 'TRUE' : true,
            // autoLoadEntities: true,

            // process.env.SYNCHRONIZE != null
            //     ? process.env.SYNCHRONIZE == 'TRUE'
            //     : true,
        }),
        TypeOrmModule.forFeature(entities),
        MailerModule.forRoot({
            transport: {
                host: 'smtp.ionos.de',
                secure: true,
                auth: {
                    user: 'system@my-tom.com',
                    pass: 'examplePassword',
                },
            },
            defaults: {
                from: '"MyTom System" <system@my-tom.com>',
            },
        }),
        TypeOrmModule.forFeature([Page, Question, Answer,Media]),
        
    ],
    controllers: [PostController, UserController, AnswerController],
    providers: [PostService, UserService, AnswerService],
})
export class AppModule {
}
