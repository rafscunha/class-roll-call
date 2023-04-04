
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { AdminService } from 'src/services/admin.service';

export class SocketAuth {
    rollCallId: any
    constructor(private readonly adminService: AdminService){}

    async auth(header: any){
        try{
            this.rollCallId = header.headers["X-ROLLCALL-ID"]
            return true
            //return await this.adminService.verifyIfRollCallIsOpen(this.rollCallId)
            //TODO: RESTRICT MORE, A PROFESSOR DOES NOT SEE OTHER CALL
        }catch(error){
            return false
        }
    }


}