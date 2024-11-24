import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Question } from './Question';
import { Answer } from './Answers';
import { IsString } from 'class-validator';


export class MediaDTO {
  @IsString()
  type: 'image' | 'video';

  @IsString()
  url: string;
}

@Entity('mytom_media')
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  type: 'image' | 'video';

  @ManyToOne(() => Answer, (answer) => answer.media, { onDelete: 'CASCADE' })
  @JoinColumn()
  answer: Answer;
}

