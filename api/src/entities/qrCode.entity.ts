import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({name:"qrCode"})
export class QrCode {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  rollCallId: string;

  @Column({default:null, nullable: true})
  userId: number;

  @Column({type:"datetime"})
  expiredIn: Date;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  assigned: Date;

}