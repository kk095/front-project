import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (!user) {
          this.router.navigate(['/login']);
          return [false];
        }

        // Check the user's role in Firestore
        return this.firestore.collection('users').doc(user.uid).get().pipe(
          map(doc => {
            const userData = doc.data();
            if (userData && userData['role'] === 'admin') {
              return true;
            } else {
              this.router.navigate(['/']);
              return false;
            }
          })
        );
      })
    );
  }
}
