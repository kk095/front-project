import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataSharedService } from 'src/app/Service/data-shared.service';
import { Product } from 'src/app/Service/interfaces/product';
import { UrlencriptionService } from 'src/app/Service/urlencription.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent {
  public products : Product[] = [];
  public ShowProducts :Product[] = [];
  public subcategory:string;
  constructor(private router: Router,private dataService:DataSharedService,private urlEncriptionService:UrlencriptionService) { }

  ngOnInit(): void {
    // Retrieve the products array passed via router state
    this.subcategory = history.state.subcategory || null;
    console.log("subcategory received:", this.subcategory);
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
    console.log(this.ShowProducts);
    
  }


  onProductClick(data){
    
    this.router.navigate(['/product/',this.urlEncriptionService.encrypt(data.id)])
  }


}
