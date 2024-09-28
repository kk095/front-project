import { Component, OnInit } from '@angular/core';
import { Title ,Meta} from '@angular/platform-browser';
import { DataSharedService } from 'src/app/Service/data-shared.service';
import { Router } from '@angular/router';
import { UrlencriptionService } from '../Service/urlencription.service';
import { Product } from '../Service/interfaces/product';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public products:Product[]=[];
  public activeCategory:string="Industrial";

  public tempUrl:string="";

  constructor(public dateShared:DataSharedService,private title:Title,private meta:Meta,private router:Router,private urlEncriptionService:UrlencriptionService) {
    this.title.setTitle("Kurston Home");
    this.meta.addTag({ name: 'description', content: 'Welcome to Kurston Home page, your trusted source for pump motors, This page shows wide range of our pump motor products' });
  }
  
  async ngOnInit() {
    await this.dateShared.getCategoryIcon("Industrial");
    await this.dateShared.getCategoryIcon("Residential");
    await this.dateShared.fetchInitialProducts(this.activeCategory);
    if(this.activeCategory=="Industrial"){
      this.products = this.dateShared.industrialProducts;
    }else if(this.activeCategory=="Residential"){
      this.products = this.dateShared.residentialProducts;
    }
    
  }
  
 

 

  async categoryClick(data:any){
    this.activeCategory = data;
    await this.dateShared.fetchInitialProducts(this.activeCategory);
    if(this.activeCategory=="Industrial"){
      this.products = this.dateShared.industrialProducts;
    }else if(this.activeCategory=="Residential"){
      this.products = this.dateShared.residentialProducts;
    }
    
  }

  onProductClick(data){
    
    this.router.navigate(['/product/',this.urlEncriptionService.encrypt(data.id)])
  }

  public onFavouriteClick(data){
    this.dateShared.addToFavorites(data.id)
  }

}
