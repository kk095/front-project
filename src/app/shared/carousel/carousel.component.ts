import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {

  @Input()
  public images:any;

  public imageData:any=[];

  constructor(){

  }

  ngOnInit() {
    this.imageData = JSON.parse(this.images);
  }

}
