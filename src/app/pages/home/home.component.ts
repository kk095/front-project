import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  images = [
    {
      url:"../../../assets/images/poster1.jpg",
      title:"title1",
      des:"description1"
    },
    {
      url:"https://picsum.photos/id/100/600/300",
      title:"title -2",
      des:"description-2"
    },
    {
      url:"https://picsum.photos/id/200/600/300",
      title:"title-3",
      des:"description-3"
    }
  ]

  public categories=[
    {
      id:1,
      name:"Flow King",
      url:"../../../assets/images/pump1.png",
      active:true
    },
    {
      id:2,
      name:"Shallow Well",
      url:"../../../assets/images/pump2.png",
      active:false
    }

  ]

  public activeCategory={
      id:1,
      name:"Flow King",
      url:"../../../assets/images/pump1.png",
      active:true
  }

  public updatedImg:any;

  constructor(){
    
  }

  ngOnInit(): void {
      this.updatedImg = JSON.stringify(this.images)
  }
  

  categoryClick(data:any){
    console.log(data);
    this.categories = this.categories.map((x)=>{
      if(x.id==data.id){
        x.active = true
      }else{
        x.active = false
      }
      return x
    })
  }


}
