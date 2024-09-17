import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/Service/interfaces/product';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent {
  public products : Product[] = [];
  public subcategory:string;
  constructor(private router: Router) { }

  ngOnInit(): void {
    // Retrieve the products array passed via router state
    this.products = history.state.products || [];
    this.subcategory = history.state.subcategory || null;
    console.log("subcategory received:", this.subcategory);
    this.products = this.products.filter((e)=>e.subcategory.toLowerCase()==this.subcategory.toLowerCase());
    console.log("Products:", this.products);
  }

  products2 = [
    {
      title: 'Product 1',
      description: 'This is the description for product 1.',
      image: 'https://via.placeholder.com/150'  // Replace with actual image URL
    },
    {
      title: 'Product 2',
      description: 'This is the description for product 2.',
      image: 'https://via.placeholder.com/150'
    },
    {
      title: 'Product 2',
      description: 'This is the description for product 2.',
      image: 'https://via.placeholder.com/150'
    },
    {
      title: 'Product 2',
      description: 'This is the description for product 2.',
      image: 'https://via.placeholder.com/150'
    },
    {
      title: 'Product 2',
      description: 'This is the description for product 2.',
      image: 'https://via.placeholder.com/150'
    },
    {
      title: 'Product 2',
      description: 'This is the description for product 2.',
      image: 'https://via.placeholder.com/150'
    },
    {
      title: 'Product 2',
      description: 'This is the description for product 2.',
      image: 'https://via.placeholder.com/150'
    },
    {
      title: 'Product 2',
      description: 'This is the description for product 2.',
      image: 'https://via.placeholder.com/150'
    },
    {
      title: 'Product 2',
      description: 'This is the description for product 2.',
      image: 'https://via.placeholder.com/150'
    },
    {
      title: 'Product 2',
      description: 'This is the description for product 2.',
      image: 'https://via.placeholder.com/150'
    },
    {
      title: 'Product 2',
      description: 'This is the description for product 2.',
      image: 'https://via.placeholder.com/150'
    },
    {
      title: 'Product 2',
      description: 'This is the description for product 2.',
      image: 'https://via.placeholder.com/150'
    },
    {
      title: 'Product 2',
      description: 'This is the description for product 2.',
      image: 'https://via.placeholder.com/150'
    },
    {
      title: 'Product 2',
      description: 'This is the description for product 2.',
      image: 'https://via.placeholder.com/150'
    },
    {
      title: 'Product 2',
      description: 'This is the description for product 2.',
      image: 'https://via.placeholder.com/150'
    },
    {
      title: 'Product 2',
      description: 'This is the description for product 2.',
      image: 'https://via.placeholder.com/150'
    },
    {
      title: 'Product 2',
      description: 'This is the description for product 2.',
      image: 'https://via.placeholder.com/150'
    },
    {
      title: 'Product 2',
      description: 'This is the description for product 2.',
      image: 'https://via.placeholder.com/150'
    },
    {
      title: 'Product 2',
      description: 'This is the description for product 2.',
      image: 'https://via.placeholder.com/150'
    },
    {
      title: 'Product 2',
      description: 'This is the description for product 2.',
      image: 'https://via.placeholder.com/150'
    },
    {
      title: 'Product 2',
      description: 'This is the description for product 2.',
      image: 'https://via.placeholder.com/150'
    },
    // Add more products here
  ];
}
