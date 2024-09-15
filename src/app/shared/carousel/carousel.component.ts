import { Component, Input, OnInit } from '@angular/core';
import { DataSharedService } from 'src/app/Service/data-shared.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {



  public imageData:any=[];

  constructor(public DataShared:DataSharedService){

  }

  ngOnInit() {
    this.getPosters();
  }


  async getPosters(){
    await this.DataShared.fetchPosters();
  }

}
