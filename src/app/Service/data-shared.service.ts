import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { catchError, finalize, lastValueFrom, map, Observable, of, take } from 'rxjs';
import { LoadingService } from './loading.service';
import { Router } from '@angular/router';
import { User,UserTable } from '../interfaces/user';
import firebase from 'firebase/compat/app';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class DataSharedService implements OnInit {
  private _posters: any = [];
  private _categories: any = [];
  private _categoriesItems:any={}
  public loggedInUser:User={id:null,name:null,email:null,role:null};
  public products:Product[]=[];
  public residentialProducts:Product[]=[];
  public industrialProducts:Product[]=[];

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private auth:AngularFireAuth,
    private loadingService:LoadingService,
    private router:Router
  ) {}



  ngOnInit(): void {
  }

  /****************************************************************************************************************** 
                                        PRODUCTS

***************************************************************************************************************** */


async getResidentialProducts() {
  if(this.residentialProducts.length > 0){
    return this.residentialProducts;
  }
  this.residentialProducts=[];
  try {
    const productsRef = this.firestore.collection('products', ref => ref.where('category', '==', 'residential'));

    const productsSnapshot = await lastValueFrom(productsRef.get());

    const products = productsSnapshot.docs.map(doc => doc.data() as Product);

    console.log("Residential products:", products);
    this.residentialProducts = products;
    return this.residentialProducts;  // Return or process the list of residential products
  } catch (e) {
    console.log('Error fetching residential products:', e);
    return this.residentialProducts;;
  }
}
async getIndustrialProducts() {
  if(this.industrialProducts.length > 0){
    return this.industrialProducts;
  }
  this.industrialProducts=[];
  try {
    const productsRef = this.firestore.collection('products', ref => ref.where('category', '==', 'industrial'));

    const productsSnapshot = await lastValueFrom(productsRef.get());

    const products = productsSnapshot.docs.map(doc => doc.data() as Product);

    console.log("Industrial products:", products);
    this.industrialProducts = products;
    return this.industrialProducts;  // Return or process the list of residential products
  } catch (e) {
    console.log('Error fetching industrial products:', e);
    return this.industrialProducts;;
  }
}



  public getPosters(): Observable<any[]> {
    if(this._posters.length>0){
      return of(this._posters);
    }
    //this.loadingService.show();
    return this.firestore
      .collection('/posters')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((action) => {
            const data = action.payload.doc.data() as any;
            const id = action.payload.doc.id;
            //this.loadingService.hide();
            this._posters = [...this._posters,{id,...data}]
            return { id, ...data };
          })
        ),
        catchError(error => {
          console.error('Error fetching category items:', error);
          //this.loadingService.hide();
          return of([]);  
        })
      )
  }

  public getContactDetails():Observable<any[]>{
    //this.loadingService.show();
    return this.firestore.collection("/contacts").snapshotChanges().pipe(
      map((actions)=>
        actions.map((action)=>{
          const data = action.payload.doc.data() as any;
          const id = action.payload.doc.id;
          //this.loadingService.hide();
          return { id, ...data };
        })
      )
    )
  }

  public async PostMessage(data){
    try{
      let res = await this.firestore.collection("/messages").add(data);
      return res;
    }catch(err){
      console.log(err);
      return err;
    }
  }

  public getAboutUs():Observable<any[]>{
    //this.loadingService.show();
    return this.firestore.collection("/about").snapshotChanges().pipe(
      map((actions)=>
        actions.map((action)=>{
          const data = action.payload.doc.data() as any;
          const id = action.payload.doc.id;
          //this.loadingService.hide();
          return { id, ...data };
        })
      )
    )
  }
  public getReviews():Observable<any[]>{
    //this.loadingService.show();
    return this.firestore.collection("/reviews").snapshotChanges().pipe(
      map((actions)=>
        actions.map((action)=>{
          const data = action.payload.doc.data() as any;
          const id = action.payload.doc.id;
          //this.loadingService.hide();
          return { id, ...data };
        })
      )
    )
  }


  public getCategory(): Observable<any[]> {
    if(this._categories.length> 0){
      return of(this._categories);
    }
    //this.loadingService.show();
    return this.firestore
      .collection('/categories')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((action) => {
            const data = action.payload.doc.data() as any;
            const id = action.payload.doc.id;
            //this.loadingService.hide();
            this._categories = [...this._categories,{id,...data}];
            return { id, ...data };
          })
        )
      );
  }

  
public getCategoryItems(data): Observable<any[]> {
  
  //this.loadingService.show();
  let url = "/categories/" + data.id + "/items";
  
  return this.firestore
    .collection(url)
    .snapshotChanges()
    .pipe(
      map((actions) => {
        if (actions.length === 0) {
          //this.loadingService.hide();
        }
        return actions.map((action) => {
          const newdata = action.payload.doc.data() as any;
          const id = action.payload.doc.id;
          //this.loadingService.hide();
          return { id, ...newdata };
        });
      }),
      catchError((error) => {
        //this.loadingService.hide();
        console.error('Error fetching category items:', error);
        return of([]);
      })
    );
}


/****************************************************************************************************************** 
                                        Favourite

***************************************************************************************************************** */

async addToFavorites(productId: string) {
  try{
    const favoritesRef = this.firestore.collection('favorites').doc(this.loggedInUser.id);
    let res = await favoritesRef.set({
      productIds: firebase.firestore.FieldValue.arrayUnion(productId)
    }, { merge: true });
    console.log("favourite adding:",res);
  }catch(e){
    console.log(e);
  }
}

removeFromFavorites(productId: string) {
  return this.firestore.collection('favorites').doc(this.loggedInUser.id).update({
    productIds: firebase.firestore.FieldValue.arrayRemove(productId)  // Correct Firebase FieldValue usage
  });
}

/****************************************************************************************************************** 
                                        AUTHENTICATION

***************************************************************************************************************** */

  getSignInUser(){
    //this.loadingService.show();
    this.auth.user.subscribe(user => {
      if(user){
        this.loggedInUser.id = user.uid;
        this.loggedInUser.email = user.email;
        this.loggedInUser.name = user.displayName;
        this.firestore.collection('users').doc(user.uid).get().subscribe(userTable=>{
          const userData = userTable.data() as UserTable | undefined;;
          if(!!userData){
            this.loggedInUser.role = userData.role;
          }
          if(this.router.url=="/login"){
            this.router.navigate([""]);
          }
        })
        console.log("logged user :",this.loggedInUser);
      }else{
        //this.loadingService.hide();
      }
    })
  }

  async login(form:any){
    this.loadingService.show();
    try{
      let user = await this.auth.signInWithEmailAndPassword(form.email, form.password);
      this.loggedInUser.id = user.user.uid;
      this.loggedInUser.email = user.user.email;
      this.loggedInUser.name = user.user.displayName;
      const userTable = await lastValueFrom(this.firestore.collection('users').doc(user.user.uid).get()) ;
      const userData = userTable.data() as UserTable | undefined;;
      if(!!userData){
        this.loggedInUser.role = userData.role;
      }
      this.loadingService.hide()
      return this.loggedInUser;
    }catch(err){
      this.loadingService.hide();
      return err.message.split(":")[1];
    }
  }

 

  async signup(form) {
    this.loadingService.show();
    try{
      let userCredential = await this.auth.createUserWithEmailAndPassword(form.email,form.password);
        const user = userCredential.user;
        if (!!user) {
          await user.updateProfile({displayName:form.name})
          this.loggedInUser.id = user.uid;
          this.loggedInUser.email = user.email;
          this.loggedInUser.name = user.displayName;
          this.loggedInUser.role = "customer";
          // Store user role in Firestore
          this.firestore.collection('users').doc(user.uid).set({
            email: user.email,
            role: 'customer',  
          });
        }
        this.loadingService.hide();
    }catch(err){
      console.error('Error creating user:', err);
      this.loadingService.hide();
    }
  }

  async signOut(){
    this.loadingService.show();
    let res = await this.auth.signOut();
    this.loggedInUser = {id:null,name:null,email:null,role:null};
    this.loadingService.hide();
  }

}
