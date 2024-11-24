import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    CreateDateColumn,
  } from 'typeorm';
  import { Page } from './Page';
  import { Answer } from './Answers';
  
  @Entity('mytom_questions')
  export class Question {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    question_text: string;
  
    @OneToMany(() => Answer, (answer) => answer.question)
    answers: Answer[];
  
    @ManyToOne(() => Page, (page) => page.questions)
    page: Page;


    @CreateDateColumn()
    created_at: Date;


  }