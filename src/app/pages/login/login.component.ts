import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {


  constructor(private auth:AngularFireAuth){

  }


  signup(){
    console.log("run..")
    this.auth.createUserWithEmailAndPassword("kk41110002@gmail.com","123KK@123").then(user =>{
      console.log("user :",user)
    })
  }
}
