import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataSharedService } from 'src/app/Service/data-shared.service';
import { Product } from 'src/app/Service/interfaces/product';

@Component({
  selector: 'app-industrial',
  templateUrl: './industrial.component.html',
  styleUrls: ['./industrial.component.scss']
})
export class IndustrialComponent implements OnInit {
  public products: Product[]=[];
  constructor(private router:Router,public dataService:DataSharedService){
  }
  
  async ngOnInit() {
    let res = await this.dataService.getProductsByCategory("Industrial");
    console.log(this.dataService.industrialProducts);
    this.products = this.dataService.industrialProducts
    
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
}
