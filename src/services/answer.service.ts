     
      // async saveAnswers(questions: any[]) {
      //   const answers: Answer[] = [];
      //   const mediaFiles: Media[] = [];
    
      //   for (const question of questions) {
      //     const { questionId, content, media } = question;
    
      //     // Save the answer
      //     const answer = this.answerRepository.create({
      //       content,
      //       question: { id: questionId },
      //     });
      //     await this.answerRepository.save(answer);
      //     answers.push(answer);
    
      //     // Handle media files (if provided)
      //     if (media && media.length > 0) {
      //       for (const file of media) {
      //         mediaFiles.push(
      //           this.mediaRepository.create({
      //             url: `/uploads/${file.filename}`,
      //             type: file.type, // Expected 'image' or 'video' from the media object
      //             answer,
      //           }),
      //         );
      //       }
      //     }
      //   }
    
      //   // Save all media files in bulk (if any)
      //   if (mediaFiles.length > 0) {
      //     await this.mediaRepository.save(mediaFiles);
      //   }
    
      //   return {
      //     message: 'All answers saved successfully',
      //     answers,
      //   };
      // }
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer, CreateAnswersDTO,  } from 'src/entities/Book/Answers';
import { Media } from 'src/entities/Book/Media';
import { Question } from 'src/entities/Book/Question';
import { Repository } from 'typeorm';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer) private answerRepository: Repository<Answer>,
    @InjectRepository(Media) private mediaRepository: Repository<Media>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async saveAnswers(
    createAnswersDto: CreateAnswersDTO,
    files: any,
  ) {
    const savedAnswers = [];
  
    // Iterate through each answer provided in the DTO
    for (const answerData of createAnswersDto.answers) {
      const { questionId, content, media } = answerData;
      console.log(questionId);
      // Validate that the question exists in the database
      const question = await this.questionRepository.findOneBy({ id: questionId });
      if (!question) {
        throw new NotFoundException(`Question with ID ${questionId} not found.`);
      }
  
      // Save the answer to the database
      const answer = this.answerRepository.create({ content, question });
      await this.answerRepository.save(answer);

      // Handle associated media files (if any)
      if (media && files && files.length > 0) {
        const mediaEntities = media.map((mediaFile, index) => ({
          url: `/${files[index].path}`, // File path on the server
          type: mediaFile.type,         // Type of media (e.g., image, video)
          answer,                       // Associated answer entity
        }));
  
        console.log('Prepared media entities for saving:', mediaEntities);
  
        // Save the media entities to the database
        await this.mediaRepository.save(mediaEntities);
      }
  
      // Add the saved answer to the result list
      savedAnswers.push(answer);
    }
  
    return savedAnswers; // Return all saved answers
  }
  async fetchPage(pageId: number) {
    const page = await this.questionRepository
      .createQueryBuilder('answers')
      
      .getOne();

    if (!page) {
      throw new Error('Page not found');
    }

    return page;
  }

//Get the latest input 
  async findLatestAnswers(limit: number = 7): Promise<Answer[]> {
    const query = this.answerRepository
      .createQueryBuilder('my_answers')
      .leftJoinAndSelect('my_answers.question', 'question')
      .leftJoinAndSelect('my_answers.media', 'media')
      .orderBy('my_answers.id', 'DESC')
      .take(limit);

      
      return query.getMany();
  }

  // async findLatestAnswersByQuestionId(questionId: number, limit: number = 10): Promise<Answer[]> {
  //   return this.answerRepository
  //     .createQueryBuilder('answer')
  //     .leftJoinAndSelect('answer.question', 'question')
  //     .leftJoinAndSelect('answer.media', 'media')
  //     .where('question.id = :questionId', { questionId })
  //     .orderBy('answer.created_at', 'DESC')
  //     .take(limit)
  //     .getMany();
  // }

  // async findAnswerWithRelations(answerId: number): Promise<Answer> {
  //   return this.answerRepository
  //     .createQueryBuilder('answer')
  //     .leftJoinAndSelect('answer.question', 'question')
  //     .leftJoinAndSelect('answer.media', 'media')
  //     .where('answer.id = :answerId', { answerId })
  //     .getOne();
  // }

  // async findAnswersByDateRange(startDate: Date, endDate: Date): Promise<Answer[]> {
  //   return this.answerRepository
  //     .createQueryBuilder('answer')
  //     .leftJoinAndSelect('answer.question', 'question')
  //     .leftJoinAndSelect('answer.media', 'media')
  //     .where('answer.created_at BETWEEN :startDate AND :endDate', {
  //       startDate,
  //       endDate,
  //     })
  //     .orderBy('answer.created_at', 'DESC')
  //     .getMany();
  // }
}