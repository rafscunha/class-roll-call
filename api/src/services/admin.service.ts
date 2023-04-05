import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {  IsNull, MoreThan, Not, Repository } from 'typeorm';
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
    private readonly repositoryStudent : Repository<Student>,
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
    return await this.repositoryRollCall.find({
      where:{period:period},
      order: {openIn: "DESC"}
    })
  }

  async getCallableStudentsAssign(rollCallId: string){
    const callable = await this.repositoryRollCall.findOneBy({id: rollCallId})
    let students = []
    let qrCodes = await this.repositoryQrCode.find({
      where: {
        rollCallId:rollCallId,
        userId: Not(IsNull())
      },
      order: {assigned:"DESC"}
    })
    for(const qrCode of qrCodes){
      const student = await this.repositoryStudent.findOneBy({id:qrCode.userId})
      students.push({
        name:student.name,
        ra: student.ra,
        assigned: `${qrCode.assigned.getHours()}:${qrCode.assigned.getMinutes()}:${qrCode.assigned.getSeconds()}`
      })
    }
    return {
      id:rollCallId,
      isOpen:callable.isOpen,
      openIn: callable.openIn,
      closedIn: callable.closedIn,
      students: students
    }
  }
}