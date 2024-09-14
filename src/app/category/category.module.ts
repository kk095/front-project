import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryComponent } from './category.component';
import { ResidentialComponent } from './residential/residential.component';
import { IndustrialComponent } from './industrial/industrial.component';


@NgModule({
  declarations: [
    CategoryComponent,
    ResidentialComponent,
    IndustrialComponent
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule
  ]
})
export class CategoryModule { }
