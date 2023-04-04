import { HttpException, HttpStatus, UnauthorizedException, CanActivate, Injectable, ExecutionContext     } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Professor } from "src/entities";
import { Repository } from "typeorm";
import * as md5 from 'md5';
import { JwtService } from '@nestjs/jwt';
import { Request } from "express";



@Injectable()
export class AuthService implements CanActivate {
    constructor(
        @InjectRepository(Professor)
        private readonly repositoryProfessor : Repository<Professor>,
        private jwtService: JwtService
    ){}

    async getJwt(authorization: string){
        try{
        let credential : any = authorization.split(" ")[1]
        credential = Buffer.from(credential, 'base64').toString().split(":")
        const professor = await this.repositoryProfessor.findOneBy({login: credential[0]})
            if (md5(credential[1]) === professor.password){
                const payload = {
                    login: professor.login,
                    name: professor.name,
                    period: professor.period
                }
                console.log("generating token...")
                return {access_token: await this.jwtService.signAsync(payload, {expiresIn:"1d"})}
            }else{
                throw new UnauthorizedException();
            }
        }catch(error){
            console.error(error)
            throw new HttpException("Invalid Credential", HttpStatus.FORBIDDEN)
        }
    }
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
          throw new UnauthorizedException();
        }
        try {
          const payload = await this.jwtService.verifyAsync(token);
          request['user'] = payload;
        } catch {
          console.log("deu ruim")
          throw new UnauthorizedException();
        }
        return true;
      }
    
      private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
      }
}