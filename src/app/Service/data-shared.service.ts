import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  catchError,
  finalize,
  lastValueFrom,
  map,
  Observable,
  of,
  take,
} from 'rxjs';
import { LoadingService } from './loading.service';
import { Router } from '@angular/router';
import { User, UserTable } from './interfaces/user';
import firebase from 'firebase/compat/app';
import { Poster, Product, UploadProduct } from './interfaces/product';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class DataSharedService implements OnInit {
  private ResidentiallastVisible: any = null; 
  private IndustriallastVisible: any = null; 
  private batchSize = 10; 
  private _categories: any = [];
  public loggedInUser: User = {
    uid: null,
    displayName: null,
    email: null,
    role: null,
  };
  public products: Product[] = [];
  public residentialProducts: Product[] = [];
  public industrialProducts: Product[] = [];
  public userList: User[] = [];
  public posterList: Poster[] = [];
  public contactData: any = null;
  public aboutData: any = null;
  public contactDocumentID: string = null;
  public industrialIcon: string = null;
  public residentialIcon: string = null;
  public singalPhaseIcon: string = null;
  public threePhaseIcon: string = null;
  public monoblockIcon: string = null;
  public shallowWellIcon: string = null;
  public favouriteProducts:Product[]=[];

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private loadingService: LoadingService,
    private router: Router,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {}

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
        category: product.category || '',
        desc: product.desc || '',
        imageUrl: product.imageUrl || '',
        subcategory: product.subcategory || '',
        title: product.title || '',
        type: product.type || '',
        timestamp: firebase.firestore.FieldValue.serverTimestamp() 
      };

      await this.firestore.collection('products').add(finalProduct);

      this.loadingService.hide();
      this.toast.success('Product uploaded successfully !', 'Success');
      return true;
    } catch (error) {
      console.log('Error while uploading product:', error);
      this.toast.error('Error While Uploading Product !', 'Failed');

      if (uploadTask) {
        try {
          await this.storage.ref(filePath).delete().toPromise();
        } catch (deleteError) {
          console.log('Error while deleting image:', deleteError);
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
      this.toast.success('Product deleted successfully !', 'success');
      return true;
    } catch (error) {
      this.toast.error('Product delete Failed !', 'Error');
      console.error('Error deleting product:', error);
      this.loadingService.hide();

      return false;
    }
  }

  async fetchInitialProducts(category: string) {
    if(category=="Industrial"&&this.industrialProducts.length>0) {
      return this.industrialProducts;
    }else if(category=="Residential"&&this.residentialProducts.length>0){
      return this.residentialProducts;
    }
    try {
      const snapshot = await lastValueFrom(this.firestore.collection('products', ref => 
        ref.where('category', '==', category)
           .orderBy('timestamp','desc')
           .limit(this.batchSize)
      ).get());
  
      const products = snapshot.docs.map((doc:any) => ({
        id: doc.id, 
        ...doc.data()
      }));
      
      if(category=="Residential"){
        this.residentialProducts=products;
      }else if(category=="Industrial"){
        this.industrialProducts=products;
      }
      
      // Save the last document for pagination
      if(category=="Residential"){
        this.ResidentiallastVisible = snapshot.docs[snapshot.docs.length - 1];
      }else if(category=="Industrial"){
        this.IndustriallastVisible = snapshot.docs[snapshot.docs.length - 1];
        console.log(this.IndustriallastVisible);
        
      }
      return products;
    } catch (error) {
      console.error('Error fetching initial products:', error);
      return [];
    }
  }

  async fetchMoreProducts(category: string) {
    try {
      let lastVisible;
      if(category=="Residential"){
        lastVisible = this.ResidentiallastVisible;
      }else if(category=="Industrial"){
        lastVisible = this.IndustriallastVisible;
      }
      if(!!lastVisible==false){
        await this.fetchInitialProducts(category);
      }
      if (lastVisible) {
        const snapshot = await lastValueFrom(this.firestore.collection('products', ref => 
          ref.where('category', '==', category)
             .orderBy('timestamp','desc')
             .startAfter(lastVisible) // Start after the last product from the previous batch
             .limit(this.batchSize)
        ).get());
  
        const products = snapshot.docs.map((doc:any) => ({
          id: doc.id, 
          ...doc.data()
        }));

        if(category=="Residential"){
          this.residentialProducts=[...this.residentialProducts, ...products];
          this.ResidentiallastVisible = snapshot.docs[snapshot.docs.length - 1];
        }else if(category=="Industrial"){
          this.industrialProducts=[...this.industrialProducts, ...products];;
          this.IndustriallastVisible = snapshot.docs[snapshot.docs.length - 1];
        }
        // Update the last visible document for the next batch
        console.log("next batch",products);
        
        return products;
      }
      return []; // No more products
    } catch (error) {
      console.error('Error fetching more products:', error);
      return [];
    }
  }
  

    async fetchProductDetails(id: string): Promise<any> {
      try {
        const productDocRef = this.firestore.collection('products').doc(id);
        
        const productDoc = await lastValueFrom(productDocRef.get());
        
        if (productDoc.exists) {
          const productData:any = productDoc.data();
          return { id: productDoc.id, ...productData };
        } else {
          return null;

        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        return null;
      }
    
  }
  


  /****************************************************************************************************************** 
                                        POSTERS

***************************************************************************************************************** */

  async fetchPosters() {
    if (this.posterList.length > 0) {
      return this.posterList;
    }
    try {
      const snapshot = await lastValueFrom(
        this.firestore.collection('posters').get()
      );
      this.posterList = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...(doc.data() as Poster),
      }));
      return true;
    } catch (error) {
      console.error('Error fetching posters:', error);
      return false;
    }
  }

  async uploadPoster(file: File, alt: string): Promise<boolean> {
    this.loadingService.show();
    const filePath = `posters/${Date.now()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    let uploadTask;

    try {
      // Start the upload task
      uploadTask = this.storage.upload(filePath, file);
      await uploadTask;

      // Get the download URL once the upload is complete
      const url = await fileRef.getDownloadURL().toPromise();

      // Prepare final poster data
      const finalPoster = {
        alt: alt,
        imageUrl: url || '',
      };

      // Save the poster details to Firestore
      await this.firestore.collection('posters').add(finalPoster);

      // Hide loading and show success message
      this.loadingService.hide();
      this.toast.success('Poster uploaded successfully!', 'Success');
      return true;
    } catch (error) {
      console.error('Error while uploading poster:', error);
      this.toast.error('Error while uploading poster!', 'Failed');

      // If uploadTask started but failed, delete the uploaded image from Firebase Storage
      if (uploadTask) {
        try {
          await this.storage.ref(filePath).delete().toPromise();
        } catch (deleteError) {
          console.error('Error while deleting image:', deleteError);
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
      await lastValueFrom(this.storage.ref(filePath).delete());

      // Delete from Firestore
      await this.firestore.collection('posters').doc(poster.id).delete();

      // Remove the poster from the local list
      this.posterList = this.posterList.filter((item) => item.id !== poster.id);

      this.toast.success('Poster deleted successfully!', 'Success');
    } catch (error) {
      console.error('Error deleting poster:', error);
      this.toast.error('Failed to delete poster!', 'Error');
    } finally {
      this.loadingService.hide();
    }
  }

  // Helper function to extract file path from Firebase Storage URL
  private getFilePathFromUrl(url: string): string {
    const baseUrl = 'https://firebasestorage.googleapis.com/v0/b/'; // base Firebase storage URL
    const filePath = decodeURIComponent(
      url.split('?')[0].split(baseUrl)[1].split('/o/')[1]
    );
    return filePath;
  }

  /****************************************************************************************************************** 
                                        CONTACT

***************************************************************************************************************** */

  async getContactData() {
    try {
      this.loadingService.show();
      const snapshot = await lastValueFrom(
        this.firestore.collection('contacts').get()
      );
      snapshot.forEach((doc) => {
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

  async UpdateContact(contactData) {
    try {
      this.loadingService.show();

      // Update the Firestore document
      if (!!this.contactDocumentID == false) {
        this.getContactData();
      }
      await this.firestore
        .collection('contacts')
        .doc(this.contactDocumentID)
        .update(contactData);

      this.toast.success('Contact updated successfully!', 'Success');
      this.loadingService.hide();
    } catch (error) {
      console.error('Error updating contact:', error);
      this.toast.error('Error updating contact !', 'Error');
      this.loadingService.hide();
    }
  }

  /****************************************************************************************************************** 
                                        Favourite

***************************************************************************************************************** */

  async addToFavorites(productId: string) {
    if(!!this.loggedInUser?.uid==false){
      this.router.navigate(['/login']);
      this.toast.info("Login First to add Favourite products!","Info");
      return;
    }
    try {
      const favoritesRef = this.firestore
        .collection('favorites')
        .doc(this.loggedInUser.uid);
      let res = await favoritesRef.set(
        {
          productIds: firebase.firestore.FieldValue.arrayUnion(productId),
        },
        { merge: true }
      );
      this.toast.success("Product Added in Favorites Successfully !","Success")
      console.log('favourite adding:', res);
    } catch (e) {
      this.toast.error("Failed To Add in Favourite !","Error")
      console.log(e);
    }
  }

  async getFavoriteProducts() {
    if(!!this.loggedInUser?.uid==false){
      await this.getSignInUser()
    }
    try {
      const favoritesRef = this.firestore.collection('favorites').doc(this.loggedInUser.uid);
      
      const doc = await lastValueFrom(favoritesRef.get())
      
      if (doc.exists) {
        const favoriteData:any = doc.data();
        const favoriteProductIds: string[] = favoriteData.productIds || [];
  
        if (favoriteProductIds.length === 0) {
          return [];
        }
  
        // Step 2: Fetch product details using the favorite product IDs
        const productDetails = [];
        for (let productId of favoriteProductIds) {
          const productDoc = await lastValueFrom(this.firestore.collection('products').doc(productId).get());
          if (productDoc.exists) {
            const productData:any = productDoc.data();
            productDetails.push({
          id: productId,  // Bind the id here
          ...productData
        });
      }else {
            console.log(`Product with ID ${productId} not found.`);
          }
        }
        this.favouriteProducts=productDetails;
        console.log(this.favouriteProducts);
        
        return productDetails; 
      } else {
        return [];
      }
    } catch (e) {
      console.log('Error fetching favorite products:', e);
      this.loadingService.hide();
      return [];
    }
  }
  

  async removeFromFavorites(productId: string) {
    try {
      await this.firestore
        .collection('favorites')
        .doc(this.loggedInUser.uid)
        .update({
          productIds: firebase.firestore.FieldValue.arrayRemove(productId),
        });
        this.toast.success("Product removed from favorites successfully !","Success")
        return true;
      } catch (error) {
        this.toast.error("Product removed failed !","Error");
        console.log(error);
        
        return false;
    }
  }
  

  /****************************************************************************************************************** 
                                        AUTHENTICATION

***************************************************************************************************************** */
async getSignInUser() {
  try {
    const user = await lastValueFrom(this.auth.user.pipe(take(1)))
    if (user) {
      this.loggedInUser.uid = user.uid;
      this.loggedInUser.email = user.email;
      this.loggedInUser.displayName = user.displayName;

      // Fetch the user data from Firestore
      const userTable = await this.firestore.collection('users').doc(user.uid).get().toPromise();
      const userData = userTable.data() as UserTable | undefined;
      
      if (!!userData) {
        this.loggedInUser.role = userData.role;
      }

      // If the user is on the login page, navigate to the home page
      if (this.router.url === '/login') {
        this.router.navigate(['']);
      }

      console.log('logged user:', this.loggedInUser);
    }
  } catch (error) {
    console.log('Error fetching signed-in user:', error);
  }
}


  async login(form: any) {
    this.loadingService.show();
    try {
      let user = await this.auth.signInWithEmailAndPassword(
        form.email,
        form.password
      );
      this.loggedInUser.uid = user.user.uid;
      this.loggedInUser.email = user.user.email;
      this.loggedInUser.displayName = user.user.displayName;
      const userTable = await lastValueFrom(
        this.firestore.collection('users').doc(user.user.uid).get()
      );
      const userData = userTable.data() as UserTable | undefined;
      if (!!userData) {
        this.loggedInUser.role = userData.role;
      }
      this.loadingService.hide();
      return this.loggedInUser;
    } catch (err) {
      this.loadingService.hide();
      return err.message.split(':')[1];
    }
  }

  async signup(form) {
    this.loadingService.show();
    try {
      let userCredential = await this.auth.createUserWithEmailAndPassword(
        form.email,
        form.password
      );
      const user = userCredential.user;
      if (!!user) {
        await user.updateProfile({ displayName: form.name });
        this.loggedInUser.uid = user.uid;
        this.loggedInUser.email = user.email;
        this.loggedInUser.displayName = user.displayName;
        this.loggedInUser.role = 'customer';
        // Store user role in Firestore
        this.firestore.collection('users').doc(user.uid).set({
          uid: user.uid,
          email: user.email,
          role: 'customer',
          displayName: user.displayName,
        });
      }
      this.toast.success('Account Created Successfully !', 'Success');
      this.loadingService.hide();
    } catch (err) {
      console.error('Error creating user:', err);
      this.toast.error('Failed in Account Creating !', 'Error');
      this.loadingService.hide();
    }
  }

  async signOut() {
    this.loadingService.show();
    let res = await this.auth.signOut();
    this.loggedInUser = {
      uid: null,
      displayName: null,
      email: null,
      role: null,
    };
    this.loadingService.hide();
  }

  async fetchUsers() {
    if (this.userList.length > 0) {
      return;
    }
    try {
      const currentUser = await this.auth.currentUser;

      if (currentUser) {
        const snapshot = await lastValueFrom(
          this.firestore.collection('users').get()
        );

        this.userList = snapshot.docs.map((doc) => {
          const user: any = doc.data();

          return {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            role: user.role,
          };
        });
        console.log('list:', this.userList);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }
  async updateUserRole(userId: string, role: string) {
    try {
      await this.firestore.collection('users').doc(userId).update({
        role: role,
      });
      this.toast.success('User role updated successfully', 'success');
    } catch (error) {
      this.toast.success('Fail updating User role ', 'Error');
      console.error('Error updating user role:', error);
    }
  }


  async forgetPassword(email){
    if (!email) {
      this.toast.error('Please enter your email.');
      return;
    }

    try {
      await this.auth.sendPasswordResetEmail(email);
      this.toast.success('Password reset email sent. Please check your inbox.');
    } catch (error) {
      this.toast.error(error.message, 'Failed to send password reset email.');
      this.toast.error("Please Enter Correct Email !", 'Failed');
      console.error("Error in sending password reset email:", error);
    }
  }

  /****************************************************************************************************************** 
                                        MESSAGES

***************************************************************************************************************** */

  public async PostMessage(data) {
    try {
      let res = await this.firestore.collection('/messages').add(data);
      return res;
    } catch (err) {
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
      const snapshot = await lastValueFrom(
        this.firestore.collection('/about').get()
      );

      // Map the data into the desired format
      const aboutUsData = snapshot.docs.map((doc) => {
        const data = doc.data() as any;
        const id = doc.id;
        return { id, ...data };
      });
      console.log(aboutUsData);
      this.aboutData = aboutUsData[0];
      return aboutUsData[0];
    } catch (error) {
      console.error('Error fetching about us data:', error);
      // Handle the error appropriately
      throw error; // Rethrow or handle the error as needed
    }
  }

  public getReviews(): Observable<any[]> {
    //this.loadingService.show();
    return this.firestore
      .collection('/reviews')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((action) => {
            const data = action.payload.doc.data() as any;
            const id = action.payload.doc.id;
            //this.loadingService.hide();
            return { id, ...data };
          })
        )
      );
  }

  public getCategory(): Observable<any[]> {
    if (this._categories.length > 0) {
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
            this._categories = [...this._categories, { id, ...data }];
            return { id, ...data };
          })
        )
      );
  }

  public getCategoryItems(data): Observable<any[]> {
    //this.loadingService.show();
    let url = '/categories/' + data.id + '/items';

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
                                        CATEGORY 

***************************************************************************************************************** */

  async getCategoryIcon(category: string) {
    if(category=="Industrial"){
      if(this.industrialIcon!=null){
        return this.industrialIcon;
      }
    }else if(category=="Residential"){
      if(this.residentialIcon!=null){
        return this.residentialIcon;
      }
    }else if(category=="monoblock"){
      if(this.monoblockIcon!=null){
        return this.monoblockIcon;
      }
    }else if(category=="shallowWell"){
      if(this.shallowWellIcon!=null){
        return this.shallowWellIcon;
      }
    }else if(category=="singalPhase"){
      if(this.singalPhaseIcon!=null){
        return this.singalPhaseIcon;
      }
    }else if(category=="threePhase"){
      if(this.threePhaseIcon!=null){
        return this.threePhaseIcon;
      }
    }
    try {
      const path = `/category/${category}`
      const fileRef = this.storage.ref(path);
      const result = await lastValueFrom(fileRef.listAll());
      const url = await result.items[0].getDownloadURL();
      if(category=="Industrial"){
        this.industrialIcon = url;
      }else if(category=="Residential"){
        this.residentialIcon = url;
      }else if(category=="monoblock"){
        this.monoblockIcon = url;
      }else if(category=="shallowWell"){
        this.shallowWellIcon = url;
      }else if(category=="singalPhase"){
        this.singalPhaseIcon = url;
      }else if(category=="threePhase"){
        this.threePhaseIcon = url;
      }
      return url;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }
}
