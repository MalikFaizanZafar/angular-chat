import { Component, ViewChild, OnInit, NgZone } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { UserService } from "../user.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public users: number = 0;
  public showChatBox: boolean = true;

  @ViewChild("msgRef") msgRef;
  constructor( public afAuth: AngularFireAuth,
    private userService : UserService,
    private router : Router,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
  }


  signInWithGoogle(){
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then(result => {
      let user = {
        socialId: result.additionalUserInfo.profile["id"],
        password: "12345",
        token: result.credential["accessToken"],
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
        gender: "",
        birthday: ""
      };
      // this.userService.setUser(user);
      localStorage.setItem('chat-user', user.name)
      this.ngZone.run(()=>  this.router.navigate(['chat']) )
    });
  }

}
