import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, AfterInsert } from 'typeorm';

@Entity({name:"rollCall"})
export class RollCall {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @Index({unique: false})
  period: number;

  @Column({type:"date", default: null})
  @Index({unique: false})
  date?: Date;

  @Column({default:true})
  isOpen: boolean;

  @CreateDateColumn({type:"datetime"})
  openIn: Date;

  @UpdateDateColumn({type:"datetime"})
  closedIn?: Date;


  @AfterInsert()
  afterInsert(){
    this.date = new Date()
  }
}