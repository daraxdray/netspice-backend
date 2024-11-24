import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, OneToMany, UpdateDateColumn } from 'typeorm';
import { Question } from './Question';
import { Media, MediaDTO } from './Media';
import { IsArray, IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';


export class AnswerDTO {
  @IsInt()
  questionId: number;

  @IsString()
  content: string;

  @IsArray()
  @Type(() => MediaDTO)
  media: MediaDTO[];
}

export class CreateAnswersDTO {
  @IsArray()
  @Type(() => AnswerDTO)
  answers: AnswerDTO[];
}
// FetchPageDto (Response DTO)
export class FetchPageDto {
  id: number;
  title: string;
  questions: {
    id: number;
    content: string;
    allowsMedia: boolean;
    answers: {
      id: number;
      content: string;
      media: { id: number; url: string; type: string }[];
    }[];
  }[];
}

@Entity('mytom_answers')
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Question, (question) => question.answers, { onDelete: 'CASCADE' })
  @JoinColumn()
  question: Question;

  @OneToMany(() => Media, (media) => media.answer, { cascade: true })
  media: Media[];


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}