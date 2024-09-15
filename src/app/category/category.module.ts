import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryComponent } from './category.component';
import { ResidentialComponent } from './residential/residential.component';
import { IndustrialComponent } from './industrial/industrial.component';
import { ItemsComponent } from './items/items.component';
import { TruncatePipe } from '../Service/truncate.pipe';



@NgModule({
  declarations: [
    CategoryComponent,
    ResidentialComponent,
    IndustrialComponent,
    ItemsComponent,
    TruncatePipe
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
  ]
})
export class CategoryModule { }
