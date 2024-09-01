import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataSharedService {
  private _posters: any = [];
  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  public getPosters(): Observable<any[]> {
    return this.firestore
      .collection('/posters')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((action) => {
            const data = action.payload.doc.data() as any;
            const id = action.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  public getCategory(): Observable<any[]> {
    return this.firestore
      .collection('/categories')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((action) => {
            const data = action.payload.doc.data() as any;
            const id = action.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  public getCategoryItems(data): Observable<any[]> {
    console.log('yes',data);
    let url = "/categories/"+data.id+"/items";
    console.log('url:',url);
    return this.firestore
      .collection(url)
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((action) => {
            const data = action.payload.doc.data() as any;
            const id = action.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }
}
