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
  public showGroupChatBox: boolean = true;
  public message: Message;
  private usersList = [];
  private groupsList = [];
  public messages = [];
  private userMessages: Observable<any[]>;
  private groupMessages: Observable<any[]>;
  private usersConversation = [];
  private groupConversation = [];
  private groupMessagesArray = [];
  private currentUser;
  private selectedUser;
  private selectedGroup;

  @ViewChild("msgRef") msgRef;
  @ViewChild("groupMsgRef") groupMsgRef;
  constructor(
    // private chatService: ChatService,
    private db: AngularFireDatabase,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem("chat-user"));

    this.db.database.ref("group-chats").on("value", snapShot => {
      this.groupsList = [];
      snapShot.forEach(group => {
        let groupObj = {
          id: group.key,
          name: group.val().name,
          photo: group.val().photo
        };
        this.groupsList.push(groupObj);
      });
      this.selectedGroup = this.groupsList[0]
    });

    this.db.database.ref("users").on("value", snapShot => {
      snapShot.forEach(user => {
        let userObj = {
          id: user.key,
          name: user.val().name,
          photo: user.val().photo
        };
        this.usersList.push(userObj);
      });
      this.usersList = this.usersList.filter(
        user => user.id != this.currentUser.id
      );
    });
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
      if (this.selectedUser) {
        this.usersConversation = this.messages.filter(
          msg =>
            msg.sender == this.selectedUser.id ||
            msg.receiver == this.selectedUser.id
        );
      }
    });
    this.groupMessages = this.db
      .list(`group-messages`)
      .valueChanges();
    this.groupMessages.subscribe(chatsObs => {
      this.groupMessagesArray = [];
      chatsObs.forEach(chatRef => {
        let newMessage = {
          sender: chatRef.sender,
          senderName: chatRef.senderName,
          groupId: chatRef.groupId,
          text: chatRef.text,
          date: chatRef.date
        };
        this.groupMessagesArray.push(newMessage);
      });
      if (this.selectedGroup) {
        this.groupConversation = this.groupMessagesArray.filter(msg => msg.groupId == this.selectedGroup.id);
      }
    });
  }

  onUserClicked(user) {
    this.selectedUser = user;
    this.showChatBox = !this.showChatBox;
    this.usersConversation = this.messages.filter(
      msg =>
        msg.sender == this.selectedUser.id ||
        msg.receiver == this.selectedUser.id
    );
  }

  onGroupClicked(group) {
    this.selectedGroup = group;
    this.showGroupChatBox = !this.showGroupChatBox;
    this.groupConversation = this.groupMessagesArray.filter(msg => msg.groupId == this.selectedGroup.id);
  }

  addMessage() {
    // console.log("this.currentUser is : ", this.currentUser);
    let newMessage = {
      sender: this.currentUser.id,
      senderName: this.currentUser.name,
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

  addMessageToGroup() {
    let newMessage = {
      sender: this.currentUser.id,
      senderName: this.currentUser.name,
      groupId: this.selectedGroup.id,
      text: this.groupMsgRef.nativeElement.value,
      date: new Date().toISOString().split("T")[0]
    };
    let senderDbRef = this.db.database.ref(
      `group-messages`
    );
    senderDbRef.push(newMessage);
    this.groupMsgRef.nativeElement.value = "";
  }
}
