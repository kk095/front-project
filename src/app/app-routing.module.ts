import { NgModule } from '@angular/core';
import { RouterModule, Routes,PreloadAllModules } from '@angular/router';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
 
  { path: 'contact', loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule) },
  { path: 'about', loadChildren: () => import('./about/about.module').then(m => m.AboutModule) },
  { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'category', loadChildren: () => import('./category/category.module').then(m => m.CategoryModule) },
 
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
 
  { path: 'favourite', loadChildren: () => import('./favourite/favourite.module').then(m => m.FavouriteModule) },
 
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
 
  { path: 'product/:id', loadChildren: () => import('./product/product.module').then(m => m.ProductModule) },
 
  { path: 'message', loadChildren: () => import('./message/message.module').then(m => m.MessageModule) },
 
  { path: '**', loadChildren: () => import('./notfound/notfound.module').then(m => m.NotfoundModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
