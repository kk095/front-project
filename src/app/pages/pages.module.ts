import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { CategoryComponent } from './category/category.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    HomeComponent,
    CategoryComponent,
    AboutComponent,
    ContactComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class PagesModule { }
