import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category.component';
import { IndustrialComponent } from './industrial/industrial.component';
import { ResidentialComponent } from './residential/residential.component';

const routes: Routes = [
  { 
  path: '',
  component: CategoryComponent,
 },
 {
  path:"industrial",
  component: IndustrialComponent
 },
 {
  path:"residential",
  component: ResidentialComponent
 }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
