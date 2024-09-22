import { Component, OnInit } from '@angular/core';
import { UrlencriptionService } from '../Service/urlencription.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataSharedService } from '../Service/data-shared.service';
import { Product } from '../Service/interfaces/product';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  public productID: string = null;
  public product: Product=null;
  public similarProducts:Product[]= [];
  constructor(
    private urlEncriptionService: UrlencriptionService,
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataSharedService
  ) {
    this.productID =
      this.urlEncriptionService.decrypt(
        this.route.snapshot.paramMap.get('id') ?? ''
      ) ?? '';
  }


  async ngOnInit() {
      await this.getproduct();
      console.log(this.router.url);
      console.log(window.location.href);
      
  }


  async getproduct(id=null){
    if(!!id){
      this.productID = id;
    }
    let res = await this.dataService.fetchProductDetails(this.productID);
    this.product = res;
    window.scrollTo(0, 0);
    if(this.product.category=="Industrial"){
      if(this.dataService.industrialProducts.length>0){
        this.similarProducts = this.dataService.industrialProducts;
      }else{
        await this.dataService.fetchMoreProducts(this.product.category);
        this.similarProducts = this.dataService.industrialProducts;
      }
    }else if(this.product.category=="Residential"){
      if(this.dataService.residentialProducts.length>0){
        this.similarProducts = this.dataService.residentialProducts;
      }else{
        await this.dataService.fetchMoreProducts(this.product.category);
        this.similarProducts = this.dataService.residentialProducts;
      }
    }
  }

  

  onProductClick(data){
    
    this.router.navigate(['/product/',this.urlEncriptionService.encrypt(data.id)])
    this.getproduct(data.id);
  }

  scroll(elementID: string, dir: string) {
    const scrollAmount = 200; // The amount to scroll (can be adjusted)

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
        const newScroll = Math.min(currentScroll + scrollAmount, maxScroll); // Ensure it does not exceed maxScroll
        element.scrollTo({ left: newScroll, behavior: 'smooth' });
      } else if (dir === 'left') {
        // Scroll to the left
        const newScroll = Math.max(currentScroll - scrollAmount, 0); // Ensure it does not go below 0
        element.scrollTo({ left: newScroll, behavior: 'smooth' });
      }
    }
  }

  onShareClick(){
    if (navigator.share) {
      navigator.share({
        title: this.product.title,
        text: 'I found this amazing Product!',
        url: window.location.href
      }).then(() => {
        console.log('Thanks for sharing!');
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      alert('Web Share API not supported in your browser. Use the share buttons below.');
    }
  }

  addFavorite(){
    this.dataService.addToFavorites(this.productID)
  }
}
