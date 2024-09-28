import { Component, OnInit } from '@angular/core';
import { DataSharedService } from '../Service/data-shared.service';
import { process } from '@progress/kendo-data-query';
import { State } from '@progress/kendo-data-query';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { SVGIcon, filePdfIcon } from "@progress/kendo-svg-icons";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  public filePdfIcon: SVGIcon = filePdfIcon;
  currentDate: Date = new Date(); 
  public state: State = {
    skip: 0,
    take: 10,
    filter: {
      logic: 'and',
      filters: [],
    },
  };
  
  public pageSize = 5;
  public buttonCount = 5;
  public sizes = [5, 10, 20, 50, 100, 150, 200, 250, 500];
  public gridData: any = process([], this.state);
  public messageList:any=[];

  constructor(private dataService:DataSharedService){

  }


  async ngOnInit() {
      this.messageList = await this.dataService.fetchMessages();
      this.gridData = process(this.messageList, this.state);
  }


  
  public dataStateChange(state: DataStateChangeEvent) {
    this.state = state;
    this.gridData = process(this.messageList, this.state);
  }
}
