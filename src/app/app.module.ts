import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { ChatComponent } from './chat/chat.component';
import { HomeComponent } from './home/home.component';

// const config: SocketIoConfig = { url: 'http://localhost:3000', options: {}};

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    // SocketIoModule.forRoot(config),
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyBVuIpEpE4Ke9xam26eRzVZItTslj6iTMY",
      authDomain: "subquch-d4369.firebaseapp.com",
      databaseURL: "https://subquch-d4369.firebaseio.com",
      projectId: "subquch-d4369",
      storageBucket: "gs://subquch-d4369.appspot.com",
      messagingSenderId: "54989238851"
    }),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent},
      { path: 'chat', component: ChatComponent}
    ])
    // AngularFireStorageModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
