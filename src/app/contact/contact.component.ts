import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataSharedService } from 'src/app/Service/data-shared.service';
import {Title,Meta} from "@angular/platform-browser";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit  {
  public contactForm: FormGroup;
  public errorShow: boolean = false;
  public ContactDetails:any;
  public showAlert: boolean = false;

  constructor(private fb: FormBuilder,private dataService:DataSharedService,private title:Title,private meta:Meta) {
    this.title.setTitle("Kurston Contact");
    this.meta.addTag({ name: 'description', content: 'Welcome to Kurston contact page, your trusted source for pump motors, This page brings us closer to you' });
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
      this.dataService.getContactDetails().subscribe((res)=>{
        console.log(res);
        this.ContactDetails = res[0];
      })
  }

  async formSubmit() {
    if (this.contactForm.valid) {
      console.log('Form Submitted', this.contactForm.value);
      let res = await this.dataService.PostMessage(this.contactForm.value);
      if(!!res.id){
        this.showDataSentMessage();
        this.contactForm.reset();
      }
    }else{
      this.errorShow=true;
    }
  }


  showDataSentMessage(){
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 1500);
  }

  inputFocus(){
    console.log("focus input");
    this.errorShow=false
    
  }
}
