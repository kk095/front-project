import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataSharedService } from '../Service/data-shared.service';
import { Product } from '../Service/interfaces/product';
import { UrlencriptionService } from '../Service/urlencription.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  public residentialProducts:Product[]=[];
  public industrialProducts:Product[]=[];
  constructor(private router: Router,public dataService:DataSharedService,private urlEncriptionService:UrlencriptionService){
  }

  async ngOnInit() {
      await this.dataService.getCategoryIcon("Industrial");
      await this.dataService.getCategoryIcon("Residential");
      await this.dataService.fetchInitialProducts("Industrial");
      await this.dataService.fetchInitialProducts("Residential");
      this.residentialProducts = this.dataService.residentialProducts;
      this.industrialProducts = this.dataService.industrialProducts;
  }

  scroll(elementID: string, dir: string) {
    const scrollAmount = 200;  // The amount to scroll (can be adjusted)
    
    // Get the scrollable element by its ID
    const element = document.getElementById(elementID);
    
    if (element) {
      // Get current scroll position
      const currentScroll = element.scrollLeft;
      
      // Get the total scrollable width (max scroll point)
      const maxScroll = element.scrollWidth - element.clientWidth;
      
      // Scroll based on direction
      if (dir === 'right') {
        // Scroll to the right
        const newScroll = Math.min(currentScroll + scrollAmount, maxScroll);  // Ensure it does not exceed maxScroll
        element.scrollTo({ left: newScroll, behavior: 'smooth' });
      } else if (dir === 'left') {
        // Scroll to the left
        const newScroll = Math.max(currentScroll - scrollAmount, 0);  // Ensure it does not go below 0
        element.scrollTo({ left: newScroll, behavior: 'smooth' });
      }
    }
  }


  navigate(path: string){
    this.router.navigate(['/category/'+path]);

  }

  onProductClick(data){
    
    this.router.navigate(['/product/',this.urlEncriptionService.encrypt(data.id)])
  }

  public onFavouriteClick(data){
    this.dataService.addToFavorites(data.id)
  }

}
