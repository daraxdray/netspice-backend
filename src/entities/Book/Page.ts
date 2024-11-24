import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    ManyToOne,
  } from 'typeorm';
  import { Question } from './Question';
import { Book } from './Book';
  
  @Entity('mytom_pages')
  export class Page {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'varchar', length: 255 })
    title: string;
  
    @Column({ type: 'text', nullable: true })
    description: string;
  
    @Column({ name: 'created_by' })
    createdBy: number; // User ID of the creator
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @ManyToOne(() => Book, (book) => book.pages)
    book: Book;

    @OneToMany(() => Question, (question) => question.page)
    questions: Question[];
  }