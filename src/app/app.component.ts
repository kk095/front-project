import { Component } from '@angular/core';
import { CoreDataService } from './Service/core-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'project';


  constructor(private coreDataService: CoreDataService){

  }


  public apiCall(){
    this.coreDataService.getItem().subscribe((res)=>{
      console.log(res);
    })
  }

}
