import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { catchError, finalize, lastValueFrom, map, Observable, of, take } from 'rxjs';
import { LoadingService } from './loading.service';
import { Router } from '@angular/router';
import { User,UserTable } from './interfaces/user';
import firebase from 'firebase/compat/app';
import { Poster, Product, UploadProduct } from './interfaces/product';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class DataSharedService implements OnInit {
  private _categories: any = [];
  public loggedInUser:User={uid:null,displayName:null,email:null,role:null};
  public products:Product[]=[];
  public residentialProducts:Product[]=[];
  public industrialProducts:Product[]=[];
  public userList:User[]=[];
  public posterList:Poster[] = [];
  public contactData:any=null;
  public aboutData:any=null;
  public contactDocumentID:string=null;


  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private auth:AngularFireAuth,
    private loadingService:LoadingService,
    private router:Router,
    private toast:ToastrService
  ) {}



  ngOnInit(): void {
  }

  /****************************************************************************************************************** 
                                        PRODUCTS

***************************************************************************************************************** */


async UploadProduct(product: UploadProduct): Promise<boolean> {
  this.loadingService.show();
  const filePath = `products/${Date.now()}_${product.file.name}`;
  const fileRef = this.storage.ref(filePath);
  let uploadTask;

  try {
    uploadTask = this.storage.upload(filePath, product.file);
    await uploadTask;
    
    const url = await fileRef.getDownloadURL().toPromise();
    product.imageUrl = url;

    const finalProduct: Product = {
      category: product.category || "",
      desc: product.desc || "",
      imageUrl: product.imageUrl || "",
      subcategory: product.subcategory || "",
      title: product.title || "",
      type: product.type || "",
    };

    await this.firestore.collection('products').add(finalProduct);
    
    this.loadingService.hide();
    this.toast.success("Product uploaded successfully !", "Success");
    return true;
  } catch (error) {
    console.log("Error while uploading product:", error);
    this.toast.error("Error While Uploading Product !", "Failed");

    if (uploadTask) {
      try {
        await this.storage.ref(filePath).delete().toPromise();
      } catch (deleteError) {
        console.log("Error while deleting image:", deleteError);
      }
    }

    this.loadingService.hide();
    return false;
  }
}

async deleteProduct(productId: string) {
  try {
    this.loadingService.show();
    await this.firestore.collection('products').doc(productId).delete();

    this.loadingService.hide();
    this.toast.success("Product deleted successfully !","success");
    return true;
  } catch (error) {
    this.toast.error("Product delete Failed !","Error");
    console.error('Error deleting product:', error);
    this.loadingService.hide();
    
    return false;
  }
}

public async getProductsByCategory(category: string) {
  if(category=="Industrial"&&this.industrialProducts.length>0) {
    return this.industrialProducts;
  }
  if(category=="Residential"&&this.residentialProducts.length>0) {
    return this.residentialProducts;
  }
  try {
    // Fetch the collection where the category matches the given category
    const snapshot = await lastValueFrom(this.firestore.collection('products', ref => ref.where('category', '==', category)).get());

    // Map the documents into the desired format
    const products = snapshot.docs.map(doc => {
      const data = doc.data() as any;
      const id = doc.id;
      return { id, ...data };
    });
    if(category=="Residential"){
      this.residentialProducts = products
    }else if(category=="Industrial"){
      this.industrialProducts = products;
    }
    return products; // Return the array of products
  } catch (error) {
    console.error("Error fetching products by category:", error);
    // Handle the error appropriately
    throw error; 
  }
}


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


  /****************************************************************************************************************** 
                                        POSTERS

***************************************************************************************************************** */

async fetchPosters() {
  if(this.posterList.length>0){
    return this.posterList;
  }
  try {
    const snapshot = await lastValueFrom(this.firestore.collection('posters').get());
    this.posterList = snapshot.docs.map((doc:any) => ({
      id: doc.id,
      ...doc.data() as Poster
    }));
    return true;
    
  } catch (error) {
    console.error("Error fetching posters:", error);
    return false;
  }
}


async uploadPoster(file:File,alt:string): Promise<boolean> {
  this.loadingService.show();
  const filePath = `posters/${Date.now()}_${file.name}`;
  const fileRef = this.storage.ref(filePath);
  let uploadTask;

  try {
    // Start the upload task
    uploadTask = this.storage.upload(filePath,file);
    await uploadTask;

    // Get the download URL once the upload is complete
    const url = await fileRef.getDownloadURL().toPromise();

    // Prepare final poster data
    const finalPoster = {
      alt: alt,
      imageUrl: url || "",
    };

    // Save the poster details to Firestore
    await this.firestore.collection('posters').add(finalPoster);

    // Hide loading and show success message
    this.loadingService.hide();
    this.toast.success("Poster uploaded successfully!", "Success");
    return true;
  } catch (error) {
    console.error("Error while uploading poster:", error);
    this.toast.error("Error while uploading poster!", "Failed");

    // If uploadTask started but failed, delete the uploaded image from Firebase Storage
    if (uploadTask) {
      try {
        await this.storage.ref(filePath).delete().toPromise();
      } catch (deleteError) {
        console.error("Error while deleting image:", deleteError);
      }
    }

    this.loadingService.hide();
    return false;
  }
}


async DeletePoster(poster: any) {
  this.loadingService.show();
  const filePath = this.getFilePathFromUrl(poster.imageUrl); // Extract file path from the URL

  try {
    // Delete from Firebase Storage
    await lastValueFrom(this.storage.ref(filePath).delete())

    // Delete from Firestore
    await this.firestore.collection('posters').doc(poster.id).delete();

    // Remove the poster from the local list
    this.posterList = this.posterList.filter(item => item.id !== poster.id);

    this.toast.success("Poster deleted successfully!", "Success");
  } catch (error) {
    console.error("Error deleting poster:", error);
    this.toast.error("Failed to delete poster!", "Error");
  } finally {
    this.loadingService.hide();
  }
}

// Helper function to extract file path from Firebase Storage URL
getFilePathFromUrl(url: string): string {
  const baseUrl = "https://firebasestorage.googleapis.com/v0/b/"; // base Firebase storage URL
  const filePath = decodeURIComponent(url.split("?")[0].split(baseUrl)[1].split("/o/")[1]);
  return filePath;
}


 /****************************************************************************************************************** 
                                        CONTACT

***************************************************************************************************************** */
  

  async getContactData() {
    
    try {
      this.loadingService.show();
      const snapshot = await lastValueFrom(this.firestore.collection('contacts').get())
      snapshot.forEach(doc => {
        const contact = doc.data();
        this.contactData = contact;
        this.contactDocumentID = doc.id; 
      });
      this.loadingService.hide();
    } catch (error) {
      this.loadingService.hide();
      console.error('Error fetching contact data:', error);
      this.toast.error('Failed to load contact data.');
    }
  }

  async UpdateContact(contactData){
    try {
      this.loadingService.show();

      // Update the Firestore document
      if(!!this.contactDocumentID==false){
        this.getContactData();
      }
      await this.firestore.collection('contacts').doc(this.contactDocumentID).update(contactData);

      this.toast.success('Contact updated successfully!',"Success");
      this.loadingService.hide();
    } catch (error) {
      console.error('Error updating contact:', error);
      this.toast.error('Error updating contact !',"Error");
      this.loadingService.hide();
    }
  }

  



/****************************************************************************************************************** 
                                        Favourite

***************************************************************************************************************** */

async addToFavorites(productId: string) {
  try{
    const favoritesRef = this.firestore.collection('favorites').doc(this.loggedInUser.uid);
    let res = await favoritesRef.set({
      productIds: firebase.firestore.FieldValue.arrayUnion(productId)
    }, { merge: true });
    console.log("favourite adding:",res);
  }catch(e){
    console.log(e);
  }
}

removeFromFavorites(productId: string) {
  return this.firestore.collection('favorites').doc(this.loggedInUser.uid).update({
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
        this.loggedInUser.uid = user.uid;
        this.loggedInUser.email = user.email;
        this.loggedInUser.displayName = user.displayName;
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
      this.loggedInUser.uid = user.user.uid;
      this.loggedInUser.email = user.user.email;
      this.loggedInUser.displayName = user.user.displayName;
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
          this.loggedInUser.uid = user.uid;
          this.loggedInUser.email = user.email;
          this.loggedInUser.displayName = user.displayName;
          this.loggedInUser.role = "customer";
          // Store user role in Firestore
          this.firestore.collection('users').doc(user.uid).set({
            uid: user.uid,
            email: user.email,
            role: 'customer',  
            displayName: user.displayName
          });
        }
        this.toast.success("Account Created Successfully !","Success");
        this.loadingService.hide();
      }catch(err){
        console.error('Error creating user:', err);
        this.toast.error("Failed in Account Creating !","Error");
      this.loadingService.hide();
    }
  }

  async signOut(){
    this.loadingService.show();
    let res = await this.auth.signOut();
    this.loggedInUser = {uid:null,displayName:null,email:null,role:null};
    this.loadingService.hide();
  }

  async fetchUsers() {
    if(this.userList.length > 0){
      return ;
    }
    try {
      
       const currentUser = await this.auth.currentUser;
      
      if (currentUser) {
        const snapshot = await lastValueFrom(this.firestore.collection('users').get())
        
        this.userList = snapshot.docs.map(doc => {
          const user:any = doc.data();
          
          return {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            role:user.role
            
          };
        });
        console.log("list:",this.userList);
        
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }
  async updateUserRole(userId: string, role: string) {
    try {
      await this.firestore.collection('users').doc(userId).update({
        role: role
      });
      this.toast.success("User role updated successfully","success");
    } catch (error) {
      this.toast.success("Fail updating User role ","Error");
      console.error('Error updating user role:', error);
    }
  }


/****************************************************************************************************************** 
                                        MESSAGES

***************************************************************************************************************** */

  
  public async PostMessage(data){
    try{
      let res = await this.firestore.collection("/messages").add(data);
      return res;
    }catch(err){
      console.log(err);
      return err;
    }
  }

  
/****************************************************************************************************************** 
                                        ABOUT US 

***************************************************************************************************************** */

public async getAboutUs() {
  try {
    // Fetch the collection data
    const snapshot = await lastValueFrom(this.firestore.collection('/about').get())

    // Map the data into the desired format
    const aboutUsData =  snapshot.docs.map(doc => {
      const data = doc.data() as any;
      const id = doc.id;
      return { id, ...data };
    });
    console.log(aboutUsData);
    this.aboutData = aboutUsData[0];
    return aboutUsData[0];
  } catch (error) {
    console.error("Error fetching about us data:", error);
    // Handle the error appropriately
    throw error; // Rethrow or handle the error as needed
  }
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

}
