import { HttpException, Injectable } from '@nestjs/common';
import { QrCode } from '../entities/qrCode.entity';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from '../entities/student.entity';
import { EventEmitter2 } from "@nestjs/event-emitter";
import { WsPublishStudentAssign } from 'src/event/ws-connections.interface';
import { RollCall } from 'src/entities';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(QrCode)
    private readonly repositoryQrCode : Repository<QrCode>,
    @InjectRepository(Student)
    private readonly repositoryStudent : Repository<Student>,
    @InjectRepository(RollCall)
    private readonly repositoryRollCall : Repository<RollCall>,
    private readonly eventEmitter: EventEmitter2
  ){}

  //return QrCode uuid
  async createQrCodeUuid(rollCallId: string){
    const now = new Date()
    let newQrCodeId  = new QrCode()
    newQrCodeId.expiredIn = new Date(now.getTime() + 5 * 60 * 1000)
    newQrCodeId.rollCallId = rollCallId
    await this.repositoryQrCode.save(newQrCodeId)
    console.log("NEW UUID: ", newQrCodeId.id)
    return newQrCodeId.id
  }

  async assignRollCall(uuid: string, idCookie: string){
    let qrCodeRegistry = await this.repositoryQrCode.findOneBy({id:uuid})
    const existeRollCallOpen = await this.repositoryRollCall.exist({
      where:{
        id:qrCodeRegistry.rollCallId,
        isOpen: true
    }})

    if(!existeRollCallOpen){
      throw new HttpException("RollCall is Closed", 400)
    }

    if(!!qrCodeRegistry){
      if (!qrCodeRegistry.userId){
        const now = new Date();
        
        if(qrCodeRegistry.expiredIn >= now){
          let student = await this.repositoryStudent.findOneBy({uuid:idCookie})
          
          if(!!student){
            const studentAlreadyAssignThisCallable = await this.repositoryQrCode.exist({
              where:{
                userId: student.id,
                rollCallId: qrCodeRegistry.rollCallId
              }
            })
            if ( !studentAlreadyAssignThisCallable ){
              qrCodeRegistry.userId = student.id

              const response = await this.repositoryQrCode.save(qrCodeRegistry)
              const assignIn = response.assigned
              //trigger event
              this.eventEmitter.emit("RollCallAssigned",qrCodeRegistry.rollCallId, {
                name: student.name,
                ra: student.ra,
                assignIn: `${assignIn.getHours()}:${assignIn.getMinutes()}:${assignIn.getSeconds()}`,
                newQrCode: await this.createQrCodeUuid(qrCodeRegistry.rollCallId),
              })

              return response
            
            }else{
              throw new HttpException("Student Already assign this call", 400)
            }
          }else{
            throw new HttpException("Student not Found", 400)
          }
        }else{
          throw new HttpException("QrCode expired", 400)
        }
      }else{
        throw new HttpException("QrCode already used", 400)
      }
    }else{
      throw new HttpException("QrCode Id not found", 400)
    }
  }


  async createStudent(name: string, ra: number){
    const user = await this.repositoryStudent.findOne({where:{ra:ra}})
    if(!user){
      let student = new Student();
      student.name = name;
      student.ra = ra;
      student = await this.repositoryStudent.save(student)
      return student.uuid
    }else{
      return user.uuid
    }
  }
}
