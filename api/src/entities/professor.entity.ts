import { Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn } from 'typeorm';


@Entity({name:"professor"})
export class Professor {
  @PrimaryGeneratedColumn("increment")
  id?: number;

  @Column()
  period: number;

  @Column()
  name: string;

  @Column()
  @Index({unique: true})
  login: string;

  @Column()
  password: string;

  @CreateDateColumn()
  created: Date;
}