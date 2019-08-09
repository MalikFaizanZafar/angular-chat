import { Component, ViewChild } from "@angular/core";
// import { ChatService } from "./chat.service";
import { AngularFireDatabase } from "@angular/fire/database";
import Message from "./Models/Message.model";
import { Observable } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  public users: number = 0;
  public showChatBox: boolean = true;
  public message: Message;
  public messages: Message[] = [];
  chats: Observable<any[]>;

  @ViewChild("msgRef") msgRef;
  constructor(
    // private chatService: ChatService,
    private db: AngularFireDatabase
  ) {}

  ngOnInit() {
    this.chats = this.db.list("chat").valueChanges();
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
      user: "Malik Faizan Zafar",
      date: new Date().toISOString().split("T")[0],
      content: this.msgRef.nativeElement.value
    };
    this.db.database.ref("chat").push(newMessage);
    this.msgRef.nativeElement.value = ''

  }
}
