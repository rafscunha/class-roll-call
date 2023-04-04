import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {  MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {QrCode, RollCall, Professor, Student} from '../entities'
import * as bcrypt from 'bcrypt';
import { ProfessorDto } from 'src/interfaces';
import * as md5 from 'md5';
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(QrCode)
    private readonly repositoryQrCode : Repository<QrCode>,
    @InjectRepository(Student)
    private readonly Student : Repository<Student>,
    @InjectRepository(Professor)
    private readonly repositoryProfessor : Repository<Professor>,
    @InjectRepository(RollCall)
    private readonly repositoryRollCall : Repository<RollCall>,
    private readonly eventEmitter: EventEmitter2
  ){}


  async createProfessor(professor: ProfessorDto){
    const passHashed = md5(professor.password)
    try{
      await this.repositoryProfessor.insert({
          name: professor.name,
          period: professor.period,
          login: professor.login,
          password: passHashed
      })
    }catch(err){
      throw new HttpException("Cannot create new professor", 404)
    }
  }

  async createRollCall(period: number){
    const today = new Date()
    today.setHours(0)
    today.setMinutes(0)
    today.setSeconds(0)
    today.setMilliseconds(0)

    const existCallableOpen = await this.repositoryRollCall.findOne({
        where:{
            period: period,
            isOpen: true,
            openIn: MoreThan(today)
        }
    })
    if(! existCallableOpen){
        const response = await this.repositoryRollCall.insert({
            period: period
        })
        return response.identifiers[0]
    }else{
        throw new HttpException({error:"Roll Call already open",idRollCallAlreadyOpen: existCallableOpen.id, }, 404)
    }
  }

  async closeCallable(rollCallId: string){
    let callableRegister = await this.repositoryRollCall.findOneBy({id: rollCallId})
    console.log(callableRegister)
    if(!!callableRegister){
      callableRegister.isOpen = false
      await this.repositoryRollCall.save(callableRegister)
      this.eventEmitter.emit("CloseRollCall", rollCallId)
    }else{
      throw new HttpException("Roll Call does not exist", HttpStatus.CONFLICT)
    }
  }

  async verifyIfRollCallIsOpen(rollCallId: string){
    return await this.repositoryRollCall.exist({where:{
      id: rollCallId,
      isOpen: true
    }})
  }


  async getCallableList(period: number){
    const select = await this.repositoryRollCall.createQueryBuilder()
    .orderBy("rollCall.date", "DESC")
    .select("rollCall.id", "id")
    .addSelect("rollCall.date", "date")
    .addSelect("rollCall.isOpen", "isOpen")
    .from("rollCall", "rollCall")
    .where("rollCall.period = :period", {period: period})
    .getMany()
    return select
  }

  async getCallableStudentsAssign(rollCallId: string){
    const callable = await this.repositoryRollCall.findOneBy({id: rollCallId})
    const select = await this.repositoryQrCode.createQueryBuilder()
    .orderBy("qrCode.assigned", "DESC")
    .select("student.name", "name")
    .addSelect("student.ra", "ra")
    .addSelect("qrCode.assigned", "assigned")
    .from("qrCode", "qrCode")
    .innerJoinAndSelect("student", "student", "student.id = qrCode.userId")
    .where("student.id = :rollCallId",{rollCallId: rollCallId})
    .getMany()
    return {
        id:rollCallId,
        isOpen:callable.isOpen,
        openIn: callable.openIn,
        closedIn: callable.closedIn,
        students:select
    }
  }
}