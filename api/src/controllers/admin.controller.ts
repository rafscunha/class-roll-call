import { Body, Controller, Delete, Get, Head, HttpStatus, Param, Patch, Post, Query, Req, Request, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { Response, query } from 'express';
import { AdminService } from 'src/services/admin.service';
import { ProfessorDto } from 'src/interfaces';
import { ErrorInterceptor } from 'src/error.interceptor';
import { AuthService } from 'src/services/auth.service';

@Controller("admin")
@UseGuards(AuthService)
export class AdminController {
  constructor(
    private readonly appService: AppService,
    private readonly adminService: AdminService
    ) {}


    @Post("professor")
    async createProfessor(
      @Body() professor: ProfessorDto,
      @Res() response: Response
      ){
      await this.adminService.createProfessor(professor)
      return response.status(HttpStatus.CREATED).send()
    }

    @Post("rollCall")
    async createRollCall(@Request() req){
      return await this.adminService.createRollCall(req.user.period)
    }

    @Patch("rollCall/:rollCallId")
    async closeRollCall( @Param() {rollCallId}:{rollCallId: string}){
      return await this.adminService.closeCallable(rollCallId)
    }

    @Get("rollCall/list")
    getListOfRollCall(){
      return true
    }

    @Get("rollCall/list/:rollCallId")
    getListOfStudentsAssigned(){
      return true
    }
}
