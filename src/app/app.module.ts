import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreDataService } from './Service/core-data.service';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import {RouterModule} from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
 import { ContactComponent } from './pages/contact/contact.component'; 

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule
  ],
  providers: [
    CoreDataService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
