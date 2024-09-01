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
//  import { ContactComponent } from './pages/contact/contact.component'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { PagesModule } from './pages/pages.module';

// import {AngularFireModule} from "@angular/fire/compat"
// import {AngularFireStorageModule} from "@angular/fire/compat/storage"
import { environment } from 'src/environments/environment';
import { firebaseConfig } from 'src/firebaseconfig';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    // ContactComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    BrowserAnimationsModule,
    SharedModule,
    PagesModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    // AngularFireModule.initializeApp(firebaseConfig),
    // AngularFireStorageModule
  
  ],
  providers: [
    CoreDataService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
