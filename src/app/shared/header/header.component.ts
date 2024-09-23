import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DataSharedService } from 'src/app/Service/data-shared.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { filter } from 'rxjs';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public isBarClicked:boolean=false;
  public activetab:string='home';
  public currentPath;


  @ViewChild("mobnav") mobdiv:any;

  constructor(private router:Router,private route:ActivatedRoute, public dataShared:DataSharedService,private auth:AngularFireAuth){
   
  }


  async ngOnInit(){
    await this.handleNavigation()
  }


 

async handleNavigation() {
  try {
    // Await the first occurrence of a NavigationEnd event
    await firstValueFrom(
      this.router.events.pipe(filter((event) => event instanceof NavigationEnd))
    );

    // Get the first child of the activated route
    const route = this.route.firstChild;

    // Log the URL of the route if available
    if (route) {
      let endpoint = route.snapshot.url[0].path;

      // Check the route's component name and set the active tab accordingly
      switch (endpoint) {
        case 'about':
          this.activetab = 'about';
          break;
        case 'contact':
          this.activetab = 'contact';
          break;
        case 'category':
          this.activetab = 'category';
          break;
        case 'favourite':
          this.activetab = 'favourite';
          break;
        case 'admin':
          this.activetab = 'admin';
          break;
        default:
          this.activetab = ''; // Optional, in case the component doesn't match any case
      }
    }
  } catch (error) {
    console.error('Error handling navigation:', error);
  }
}


  public onClickBar(val:boolean){
    this.isBarClicked=val;
    
  }

  public navigation(page:string){
    this.activetab=page;
    this.isBarClicked=false;
    if(page=='home'){
      this.router.navigate(['']);
    }else{
      this.router.navigate(['/'+page]);
    } 
  }

  logout(){
    this.dataShared.signOut();
  }

}
