import { OnEvent } from '@nestjs/event-emitter';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  WsConnection,
  WsPublishMessage,
  WS_RESPONSE_TYPE,
  WsPublishStudentAssign,
} from './ws-connections.interface';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { SocketAuth } from './socket.auth';
import { AppService } from 'src/services/app.service';
import { AdminService } from 'src/services/admin.service';

@WebSocketGateway()
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  server: Server;
  connectionsManager: WsConnection[] = [];
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly authService: SocketAuth,
    private readonly appService: AppService,
    private readonly adminService: AdminService,
  ) {}

  afterInit(server: Server) {
    this.server = server;
    console.log('Socket Init');
  }
  async handleConnection(client: any, ...args: any[]) {
    const rollCallId = args[0].url.split('=')[1];
    const accessValidate = await this.adminService.verifyIfRollCallIsOpen(
      rollCallId,
    );
    if (accessValidate) {
      console.log('connecting');
      const connection: WsConnection = {
        rollCallId: rollCallId,
        socket: client,
      };
      this.connectionsManager.push(connection);
      this.eventEmitter.emit('SubscribeRollCall', connection);
    } else {
      client.close();
    }
  }

  handleDisconnect(client: Socket) {
    console.log('disconnecting');
    const index = this.connectionsManager.findIndex((value: WsConnection) => {
      return value.socket == client;
    });
    this.connectionsManager.splice(index, 1);
  }

  private sendMessage(id: string, message: any) {
    this.connectionsManager.map((client) => {
      if (client.rollCallId == id) {
        client.socket.send(JSON.stringify(message));
      }
    });
  }

  private disconnectOfRollCall(rollCallId: string) {
    this.connectionsManager.map((client) => {
      if (client.rollCallId == rollCallId) {
        client.socket.close();
      }
    });
  }

  @OnEvent('SubscribeRollCall', { async: true })
  async publishToNewConnection(payload: WsConnection) {
    const message = {
      type: WS_RESPONSE_TYPE.newQrCode,
      data: {
        id: await this.appService.createQrCodeUuid(payload.rollCallId),
      },
    };
    payload.socket.send(JSON.stringify(message));
  }

  @OnEvent('RollCallAssigned')
  publishRollCallAssigned(rollCallId: string, student: WsPublishStudentAssign) {
    console.log('RollCallAssigned');
    const message = {
      type: WS_RESPONSE_TYPE.assignRollCall,
      data: student,
    };
    this.sendMessage(rollCallId, message);
  }

  @OnEvent('CloseRollCall')
  publishCloseRollCall(rollCallId: string) {
    const message = {
      type: WS_RESPONSE_TYPE.closeRollCall,
      data: null,
    };
    this.sendMessage(rollCallId, message);
    this.disconnectOfRollCall(rollCallId);
  }
}
