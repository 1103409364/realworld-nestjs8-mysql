import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import * as argon2 from 'argon2';
import { IsEmail } from 'class-validator';
import { ArticleEntity } from '../article/article.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  @IsEmail()
  email: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: '' })
  image: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }
  // @ApiHideProperty()
  @ManyToMany((type) => ArticleEntity)
  @JoinTable()
  favorites: ArticleEntity[];

  @OneToMany((type) => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[];
}
