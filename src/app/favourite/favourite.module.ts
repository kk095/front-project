import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FavouriteRoutingModule } from './favourite-routing.module';
import { FavouriteComponent } from './favourite.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    FavouriteComponent
  ],
  imports: [
    CommonModule,
    FavouriteRoutingModule,
    SharedModule
  ]
})
export class FavouriteModule { }
