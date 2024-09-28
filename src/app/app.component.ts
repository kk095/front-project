import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DataSharedService } from './Service/data-shared.service';
import { LoadingService } from './Service/loading.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'project';
  public showHeaderFooter=true;

  constructor(private router:Router,public dataService:DataSharedService,public loadingService:LoadingService){
    
    this.router.events.subscribe((event) => { 
      if (event instanceof NavigationEnd) {
        this.showHeaderFooter = !['/login'].includes(event.urlAfterRedirects);
      }
    });
  }
  
  async ngOnInit() {
    await this.dataService.getSignInUser();
  }
  

}
