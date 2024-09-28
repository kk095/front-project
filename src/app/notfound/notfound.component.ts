import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { DataSharedService } from '../Service/data-shared.service';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.scss']
})
export class NotfoundComponent implements OnInit {
  constructor(private router:Router,private dataService:DataSharedService){
  }

  ngOnInit() {
   
  }
  navigate(){
    this.router.navigate(['']);
  }
}
