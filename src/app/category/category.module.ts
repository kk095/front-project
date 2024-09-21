import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryComponent } from './category.component';
import { ResidentialComponent } from './residential/residential.component';
import { IndustrialComponent } from './industrial/industrial.component';
import { ItemsComponent } from './items/items.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    CategoryComponent,
    ResidentialComponent,
    IndustrialComponent,
    ItemsComponent,
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    SharedModule
  ]
})
export class CategoryModule { }
