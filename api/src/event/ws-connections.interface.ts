import {  Socket } from 'socket.io';


export class WsConnection{
    rollCallId: string;
    socket: any;
}

export enum WS_RESPONSE_TYPE{
    newQrCode = "NewQrCode",
    assignRollCall = "AssignRollCall",
    closeRollCall = "CloseRollCall"
}

export class WsPublishStudentAssign{
    name: string;
    ra: number;
    assignIn: Date;
    newQrCode?: string;
}

export class WsPublishNewQrCode{
    id: string;
}

export class WsPublishMessage{
    type: WS_RESPONSE_TYPE;
    data: WsPublishNewQrCode | WsPublishStudentAssign | null;
}