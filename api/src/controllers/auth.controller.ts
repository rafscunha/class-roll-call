
import { Body, Controller, Delete, Get, Headers, HttpStatus, Param, Patch, Post, Query, Req, Res, UseInterceptors } from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';


@Controller("auth")
export class AuthController {
    constructor (private readonly authService: AuthService){}

    @Post()
    async auth(@Headers() headers){
        return await this.authService.getJwt(headers.authorization)
    }
}