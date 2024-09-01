import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
 import {AngularFirestore} from "@angular/fire/compat/firestore"
 import {AngularFireStorage} from "@angular/fire/compat/storage"
import { DataSharedService } from 'src/app/Service/data-shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public categories=[]

  public categoryItems=[];

  public activeCategory:any;

  public tempUrl:string="";

  constructor(private dateShared:DataSharedService){
    
  }
  
  ngOnInit(): void {
    this.getCategories();
    
  }
  
  getCategories(){
      this.dateShared.getCategory().subscribe(data =>{
        this.categories = data;
        this.activeCategory = data.filter((x)=>x.active==true)[0];
        this.getCategoryItems(this.activeCategory);
      })
  }

  getCategoryItems(data){
    this.dateShared.getCategoryItems(data).subscribe((data)=>{
      console.log(data);
      this.categoryItems = data;
    })
  }

  categoryClick(data:any){
    console.log(data);
    this.getCategoryItems(data);
    this.categories = this.categories.map((x)=>{
      if(x.id==data.id){
        x.active = true;
        this.activeCategory = x;
      }else{
        x.active = false
      }
      return x
    })

  }


}
