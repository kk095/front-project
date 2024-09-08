import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from './carousel/carousel.component';
import { LoadingComponent } from './loading/loading.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LeafletMapComponent } from './leaflet-map/leaflet-map.component';



@NgModule({
  declarations: [
    CarouselComponent,
    LoadingComponent,
    HeaderComponent,
    FooterComponent,
    LeafletMapComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[CarouselComponent,LoadingComponent,HeaderComponent,FooterComponent,LeafletMapComponent]
})
export class SharedModule { }
