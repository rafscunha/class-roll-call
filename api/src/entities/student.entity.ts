import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, BeforeInsert } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity({name:"student"})
export class Student {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({type:"uuid", nullable:true})
  uuid: string;

  @Column()
  name: string;

  @Column()
  ra: number;

  @CreateDateColumn()
  created: Date;

  @BeforeInsert()
  beforeInsert(){
    this.uuid = uuidv4()
  }
}