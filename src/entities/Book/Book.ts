import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../User/User'
import { Page } from './Page';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  coverPageUrl: string;

  @ManyToOne(() => User, (user) => user.books)
  user: User;

  @OneToMany(() => Page, (page) => page.book)
  pages: Page[];

  @OneToMany(() => Book, (book) => book.user)
  books: Book[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}