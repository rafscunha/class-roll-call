import { Body, Controller, Get, Head, HttpException, HttpStatus, Param, Patch, Post, Query, Req, Res } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { Response, Request, query } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
    ) {}

  // @Get("/qrCode/:rollCallId")
  // async getUuid(
  //   @Param() {rollCallId}:{rollCallId: string}
  // ): Promise<any> {
  //   const uuid = await this.appService.createQrCodeUuid(rollCallId);
  //   return {uuid:uuid}
  // }

  @Get("ping")
  ping(){
    return null
  }

  @Post("assign")
  async createUser(
    @Body() {name, ra}:{name:string, ra:number},
    @Res() response: Response
  ){
    const studentId = await this.appService.createStudent(name, ra)
    return response.status(HttpStatus.CREATED).send({studentId: studentId})
  }

  @Get("assign/:qrCodeId/:studentId")
  async assignCall(
    @Param() {qrCodeId, studentId}:{qrCodeId:string, studentId: string},
    @Res() response: Response
  ){
    console.log(studentId)
    if (!studentId){
      throw new HttpException("studentId not found", 400)
    }
    await this.appService.assignRollCall(qrCodeId, studentId)
    return response.status(HttpStatus.ACCEPTED).send()
  }

  // @Get("validate/:qrCodeId")
  // async checkAlreadyUsed(
  //   @Param() {qrCodeId}:{qrCodeId:string},
  //   @Res() response: Response
  //   ){
  //   const result = await this.appService.checkIfAlreadyUsed(qrCodeId)
  //   return response.status(HttpStatus.OK).send({qrCodeUsed:result})
  // }

}
