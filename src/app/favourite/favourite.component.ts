import { Component, OnInit } from '@angular/core';
import { DataSharedService } from '../Service/data-shared.service';
import { Product } from '../Service/interfaces/product';
import { Router } from '@angular/router';
import { UrlencriptionService } from '../Service/urlencription.service';

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.scss']
})
export class FavouriteComponent implements OnInit {

    products:Product[]=[];
  
    constructor(private dataService:DataSharedService,private router:Router,private urlEncriptionService:UrlencriptionService){
    }
    
    
    async ngOnInit() {
      await this.dataService.getFavoriteProducts();
      this.products = this.dataService.favouriteProducts;
      
    } 


    
  onProductClick(data){
    
    this.router.navigate(['/product/',this.urlEncriptionService.encrypt(data.id)])
  }

  async removeFavourite(data){    
    await this.dataService.removeFromFavorites(data.id)
    await this.dataService.getFavoriteProducts();
    this.products = this.dataService.favouriteProducts;
  }
} 
