import {
    Controller,
    Post,
    Body,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
    UploadedFiles,
    Req,
    Get,
} from '@nestjs/common';
import { AnyFilesInterceptor, FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { AnswerService } from '../services/answer.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateAnswersDTO } from 'src/entities/Book/Answers';

@Controller('answer')
export class AnswerController {
  constructor(private readonly answersService: AnswerService) {}

  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + '-' + file.originalname);
        },
      }),
    }),
  )
    @Post('save')
    async createAnswers(
      @Body() createAnswersDto: any,
      @UploadedFiles() files: { media?: Express.Multer.File[] },
  //     @Req() req: any,
  // @Body() createAnswersDto: CreateAnswersDTO,
    ) {
      const savedAnswers = await this.answersService.saveAnswers(
        createAnswersDto,
        files,
      );
      return { message: 'Answers saved successfully', savedAnswers };
    }

    @Get('fetch')
    async getPageAnswers(){
      try {
        const answers =  await this.answersService.findLatestAnswers(7);

        return {message:"All Answers fetched",data:answers};
      } catch (error) {
        console.error(error);
        throw new BadRequestException('Failed to fetch latest answers');
      }
    }
  
}