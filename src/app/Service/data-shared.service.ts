import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { catchError, finalize, map, Observable, of, take } from 'rxjs';
import { LoadingService } from './loading.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DataSharedService implements OnInit {
  private _posters: any = [];
  private _categories: any = [];
  private _categoriesItems:any={}
  public loggedInUser:{name:string,email:string, password:string}={name:null,email:null,password:null};

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private auth:AngularFireAuth,
    private loadingService:LoadingService,
    private router:Router
  ) {}



  ngOnInit(): void {
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


  getSignInUser(){
    //this.loadingService.show();
    this.auth.user.subscribe(user => {
      if(user){
        this.loggedInUser.email = user.email;
        this.loggedInUser.name = user.displayName;
        if(this.router.url=="/login"){
          this.router.navigate([""]);
        }
        //this.loadingService.hide();
        console.log("logged user :",this.loggedInUser);
      }else{
        //this.loadingService.hide();
      }
    })
  }

  async login(form:any){
    //this.loadingService.show();
    try{
      let user = await this.auth.signInWithEmailAndPassword(form.email, form.password);
      this.loggedInUser.email = user.user.email;
      this.loggedInUser.name = user.user.displayName;
      this.loadingService.hide()
      return this.loggedInUser;
    }catch(err){
      //this.loadingService.hide();
      return err.message.split(":")[1];
    }
  }

  async signup(form){
    try{
      //this.loadingService.show();
      let user = await this.auth.createUserWithEmailAndPassword(form.email,form.password);
      await user.user.updateProfile({displayName:form.name})
      this.loggedInUser.email = user.user.email;
      this.loggedInUser.name = user.user.displayName;
      //this.loadingService.hide();
      return {
        signup: true,
        msg:""
      };
    }catch(err){
      //this.loadingService.hide();
      return {
        signup: false,
        msg: err.message.split(":")[1]
      };

    }
  }

  async signOut(){
    //this.loadingService.show();
    let res = await this.auth.signOut();
    this.loggedInUser = {name:null,email:null,password:null};
    //this.loadingService.hide();
  }

}
