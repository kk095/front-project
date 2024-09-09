import { Component, OnInit } from '@angular/core';
import { DataSharedService } from 'src/app/Service/data-shared.service';
import {Title,Meta} from "@angular/platform-browser";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  public aboutUs:any;
  public reviews:any;
  constructor(private dataService: DataSharedService,private title:Title,private meta :Meta){
    this.title.setTitle("Kurston About page");  
    this.meta.addTag({ name: 'description', content: 'Welcome to Kurston about page, your trusted source for pump motors, this page shows kurston quality' });
  }


  ngOnInit(): void {
      this.dataService.getAboutUs().subscribe((res)=>{
        this.aboutUs = res[0];
      })
      this.dataService.getReviews().subscribe((res)=>{
        this.reviews = res;
      })
  }
}
