import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RollCall, QrCode, Student, Professor } from './entities';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SocketGateway } from './event/socket.gateway';
import { SocketAuth } from './event/socket.auth';
import { ErrorInterceptor } from './error.interceptor';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { RejectSocketInterceptor } from './event/ws.interceptor';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 3306),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'root',
      database: process.env.DB_DATABASE || 'chamada',
      entities: [RollCall, QrCode, Student, Professor],
      synchronize:  false,
    }),
    TypeOrmModule.forFeature([RollCall, QrCode, Student, Professor]),
    JwtModule.register({
      global: true,
      secret: process.env.AUTH_SECRET || "secret",
      signOptions: { expiresIn: '1d' },
    })
  ],
  controllers: [AppController, AdminController, AuthController],
  providers: [AppService, SocketGateway, SocketAuth, ErrorInterceptor, AdminService, AuthService, RejectSocketInterceptor],
})
export class AppModule {}
