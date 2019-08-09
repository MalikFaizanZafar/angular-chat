import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/database";
import Message from "../Models/Message.model";
import { Observable } from "rxjs";
import { UserService } from '../user.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  public users: number = 0;
  public showChatBox: boolean = true;
  public message: Message;
  public messages: Message[] = [];
  chats: Observable<any[]>;

  @ViewChild("msgRef") msgRef;
  constructor(
    // private chatService: ChatService,
    private db: AngularFireDatabase,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.chats = this.db.list("chat").valueChanges();
    console.log("chat user is : ", localStorage.getItem("chat-user"))
    this.chats.subscribe(chatsObs => {
      this.messages = [];
      chatsObs.forEach(chatRef => {
        let newMessage: Message = {
          user: chatRef.user,
          date: chatRef.date,
          content: chatRef.content
        };
        this.messages.push(newMessage);
      });
    });
  }

  // addChat() {
  //   this.message = this.msgRef.nativeElement.value;
  //   this.messages.push(this.message);
  //   this.chatService.sendChat(this.msgRef.nativeElement.value);
  //   this.message = "";
  //   this.msgRef.nativeElement.value = "";
  // }

  addMessage() {
    let newMessage: Message = {
      user: localStorage.getItem("chat-user"),
      date: new Date().toISOString().split("T")[0],
      content: this.msgRef.nativeElement.value
    };
    this.db.database.ref("chat").push(newMessage);
    this.msgRef.nativeElement.value = ''

  }

}
