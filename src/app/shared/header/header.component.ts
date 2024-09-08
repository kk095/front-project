import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DataSharedService } from 'src/app/Service/data-shared.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { filter } from 'rxjs';

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


  ngOnInit(){
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      const route = this.route.firstChild;
      if (route) {
        if(route.component?.name=="AboutComponent"){
          this.activetab="about";
        }else if(route.component?.name=="ContactComponent"){
          this.activetab="contact";
        }else if(route.component?.name=="CategoryComponent"){
          this.activetab="category";
        }
      }
    });
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
