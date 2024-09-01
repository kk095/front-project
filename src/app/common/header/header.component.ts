import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataSharedService } from 'src/app/Service/data-shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public isBarClicked:boolean=false;
  public activetab:string='home';


  @ViewChild("mobnav") mobdiv:any;

  constructor(private router:Router,private dataShared:DataSharedService){

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

}
