import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: Socket) { 

  }

  sendChat(message){
    this.socket.emit('send', message);
  }

  receiveChat(){
    return this.socket.fromEvent('receive');
  }

  getUsers(){
    return this.socket.fromEvent('users');
  }

}