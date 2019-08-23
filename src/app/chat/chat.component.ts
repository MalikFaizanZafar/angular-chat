import { Component, OnInit, ViewChild } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import Message from "../Models/Message.model";
import { Observable } from "rxjs";
import { UserService } from "../user.service";
@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"]
})
export class ChatComponent implements OnInit {
  public users: number = 0;
  public showChatBox: boolean = true;
  public message: Message;
  private usersList = [];
  public messages = [];
  private userMessages: Observable<any[]>;
  private usersConversation= [];
  private currentUser;
  private selectedUser;

  @ViewChild("msgRef") msgRef;
  constructor(
    // private chatService: ChatService,
    private db: AngularFireDatabase,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem("chat-user"));
    this.db.database.ref('users').on('value', snapShot => {
      snapShot.forEach(user => {
        let userObj = {
          id: user.key,
          name: user.val().name,
          photo: user.val().photo
        }
        this.usersList.push(userObj)
      })
      this.usersList = this.usersList.filter(user => user.id != this.currentUser.id)
    })
    this.userMessages = this.db
      .list(`users-chats/user||${this.currentUser.id}`)
      .valueChanges();
    this.userMessages.subscribe(chatsObs => {
      this.messages = [];
      chatsObs.forEach(chatRef => {
        let newMessage = {
          sender: chatRef.sender,
          senderName: chatRef.senderName,
          text: chatRef.text,
          receiver: chatRef.receiver,
          date: chatRef.date
        };
        this.messages.push(newMessage);
      });
      if(this.selectedUser){
        this.usersConversation = this.messages.filter(msg => msg.sender == this.selectedUser.id || msg.receiver == this.selectedUser.id)
      }
    });
  }

  // addChat() {
  //   this.message = this.msgRef.nativeElement.value;
  //   this.messages.push(this.message);
  //   this.chatService.sendChat(this.msgRef.nativeElement.value);
  //   this.message = "";
  //   this.msgRef.nativeElement.value = "";
  // }
  onUserClicked(user) {
    this.selectedUser = user;
    this.showChatBox = !this.showChatBox;
    this.usersConversation = this.messages.filter(msg => msg.sender == this.selectedUser.id || msg.receiver == this.selectedUser.id)
    console.log("selectedUser is : ", this.selectedUser)
  }
  addMessage() {
    // console.log("this.currentUser is : ", this.currentUser);
    let newMessage = {
      sender: this.currentUser.id,
      senderName:  this.currentUser.name,
      text: this.msgRef.nativeElement.value,
      receiver: this.selectedUser.id,
      date: new Date().toISOString().split("T")[0]
    };
    let senderDbRef = this.db.database.ref(
      `users-chats/user||${this.currentUser.id}`
    );
    senderDbRef.push(newMessage);
    let receiverDbRef = this.db.database.ref(
      `users-chats/user||${this.selectedUser.id}`
    );
    receiverDbRef.push(newMessage);
    this.msgRef.nativeElement.value = "";
  }
}
