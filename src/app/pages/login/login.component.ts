import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit  {

  public loggedInUser:{email:string, password:string};


  public showLoginPage:boolean = true;


  constructor(private auth:AngularFireAuth,private fb:FormBuilder){
  
  }

  ngOnInit() {
    this.getSignInUser();
  }

  public loginForm = this.fb.group({
    name:["",[Validators.required]],
    email:["",[Validators.email,Validators.required]],
    password:["",Validators.required]
  })

  async getSignInUser(){
    console.log("check");
    this.auth.user.subscribe(user => {
      if(user){
        this.loggedInUser.email = user.email;
      }
    })
  }

  login(){
    console.log(this.loginForm.value);
    this.auth.signInWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password).then((user) => {
      console.log(user);
    })
  }

  signup(){
    console.log("run..")
    this.auth.createUserWithEmailAndPassword(this.loginForm.value.email,this.loginForm.value.password).then(user =>{
      console.log("user :",user)
      user.user.updateProfile({displayName:this.loginForm.value.name})
    })
  }

  onToggle(page){
    if(page=="login"){
      this.showLoginPage=true;
    }else{
      this.showLoginPage=false;
    }
  }
}
