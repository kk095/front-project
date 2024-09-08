import { Component, OnInit } from '@angular/core';
import { DataSharedService } from 'src/app/Service/data-shared.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  public aboutUs:any;
  public reviews:any;
  constructor(private dataService: DataSharedService){

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
