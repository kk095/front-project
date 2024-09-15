import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { DataSharedService } from 'src/app/Service/data-shared.service';
import {Title,Meta} from "@angular/platform-browser";
import { User } from '../Service/interfaces/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit  {

  public loggedInUser:User={id:null,name:null,email:null,role:null};


  public showLoginPage:boolean = true;

  public errorMsg:string = "";


  constructor(private auth:AngularFireAuth,private fb:FormBuilder,private router:Router,private dataService:DataSharedService,private title:Title,private meta :Meta){
    this.title.setTitle("Kurston Login");
    this.meta.addTag({ name: 'description', content: 'Welcome to Kurston Login page, your trusted source for pump motors, This page make us family' });
    this.dataService.getSignInUser();

  }

  ngOnInit() {
    this.getSignInUser();
    
  }

  getSignInUser(){
    if(!!this.dataService.loggedInUser.email){
      this.onToggle("home");
    }
  }

  public loginForm = this.fb.group({
    email:["",[Validators.required]],
    password:["",Validators.required]
  })
  public signupForm = this.fb.group({
    name:["",[Validators.required]],
    email:["",[Validators.email,Validators.required]],
    password:["",Validators.required]
  })

  

  async login(){
    let res:any = await this.dataService.login(this.loginForm.value);
    if(!!res?.email==false){
      this.errorMsg = res;
    }else{
      this.onToggle("home");
    }
  }

  async signup(){
    let res:any = await this.dataService.signup(this.signupForm.value);
    if(res.signup==false){
      this.errorMsg = res.msg;
    }else{
      if(!!this.loggedInUser.email){
        this.onToggle("home");
      }else{
        this.onToggle("login");
      }
    }
  }

  onToggle(page){
    if(page=="login"){
      this.showLoginPage=true;
    }else if(page=="signup"){
      this.showLoginPage=false;
    }else if("home"){
      this.router.navigate(['']);
    }
  }
}
