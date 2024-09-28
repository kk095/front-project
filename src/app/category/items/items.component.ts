import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataSharedService } from 'src/app/Service/data-shared.service';
import { Product } from 'src/app/Service/interfaces/product';
import { UrlencriptionService } from 'src/app/Service/urlencription.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {
  public products : Product[] = [];
  public ShowProducts :Product[] = [];
  public subcategory:string;
  public loading = true;
  constructor(private router: Router,private dataService:DataSharedService,private urlEncriptionService:UrlencriptionService) { }

  ngOnInit(): void {
    // Retrieve the products array passed via router state
    this.subcategory = history.state.subcategory || null;
    if(this.subcategory=="single phase"||this.subcategory=="three phase"){
      this.products = this.dataService.industrialProducts;
      if(this.subcategory=="single phase"){
        this.ShowProducts = this.products.filter((x)=>x.subcategory=="Single Phase");
      }else{
        this.ShowProducts = this.products.filter((x)=>x.subcategory=="Three Phase");
      }
      
    }else if(this.subcategory=="Monoblock"||this.subcategory=="shallow well"){
      this.products = this.dataService.residentialProducts;
      
      if(this.subcategory=="Monoblock"){
        this.ShowProducts = this.products.filter((x)=>x.subcategory=="Monoblock");
      }else{
        this.ShowProducts = this.products.filter((x)=>x.subcategory=="Shallow Well");
        
      }

    }
    if(!!this.ShowProducts.length ==false){
      this.loadMore();
    }
    
  }


  async loadMore() {
    if(this.dataService.IsAllProducts){
      this.loading=false;
      return;
    }
      if(this.subcategory=="single phase"||this.subcategory=="three phase"){
        this.products = await this.dataService.fetchMoreProducts("Industrial");
        if(this.subcategory=="single phase"){
          this.ShowProducts = this.products.filter((x)=>x.subcategory=="Single Phase");
        }else{
          this.ShowProducts = this.products.filter((x)=>x.subcategory=="Three Phase");
        }
        
      }else if(this.subcategory=="Monoblock"||this.subcategory=="shallow well"){
        
        await this.dataService.fetchMoreProducts("Residential");
        this.products = this.dataService.residentialProducts;
        
        if(this.subcategory=="Monoblock"){
          this.ShowProducts = this.products.filter((x)=>x.subcategory=="Monoblock");
        }else{
          this.ShowProducts = this.products.filter((x)=>x.subcategory=="Shallow Well");
          
        }
  
      }

      
  }

  onProductClick(data){
    
    this.router.navigate(['/product/',this.urlEncriptionService.encrypt(data.id)])
  }


}
