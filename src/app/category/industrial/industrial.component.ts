import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataSharedService } from 'src/app/Service/data-shared.service';
import { Product } from 'src/app/Service/interfaces/product';
import { UrlencriptionService } from 'src/app/Service/urlencription.service';

@Component({
  selector: 'app-industrial',
  templateUrl: './industrial.component.html',
  styleUrls: ['./industrial.component.scss']
})
export class IndustrialComponent implements OnInit {
  public products: Product[]=[];
  public singleProducts: Product[]=[];
  public threeProducts: Product[]=[];
  constructor(private router:Router,public dataService:DataSharedService,private urlEncriptionService:UrlencriptionService){
  }
  
  async ngOnInit() {
    this.products = this.dataService.industrialProducts;
    await this.dataService.getCategoryIcon("singalPhase");
    await this.dataService.getCategoryIcon("threePhase");
    await this.dataService.fetchMoreProducts("Industrial");
    this.products = this.dataService.industrialProducts;
    this.singleProducts = this.products.filter((x)=>x.subcategory=="Single Phase");
    this.threeProducts = this.products.filter((x)=>x.subcategory=="Three Phase");
    
    
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

  navigate(type: string){
    this.router.navigate(['category/items-list'], { state: { products: this.products,subcategory:type } });

  }

  onProductClick(data){
    
    this.router.navigate(['/product/',this.urlEncriptionService.encrypt(data.id)])
  }

  public onFavouriteClick(data){
    this.dataService.addToFavorites(data.id)
  }
}
