import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from  '@angular/common/http';
import { tap } from  'rxjs/operators';
import { AngularFireAuth } from  "@angular/fire/auth";
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  
  AUTH_SERVER_ADDRESS: string = 'http://192.168.0.8:3000';
  authSubject = new BehaviorSubject(false);
  user:Observable<any>;
  
  constructor
  (
    private httpClient:HttpClient,
    private afAuth:AngularFireAuth,
    private db: AngularFirestore,
  ) 
  { 
    this.user = this.afAuth.authState;
    this.ifLoggedIn();
  }

  ifLoggedIn() {
    if (localStorage.getItem('token')) {
      this.authSubject.next(true);
    }
    this.afAuth.idToken.subscribe(res=>{
      if(res){
        localStorage.setItem("token", res);
        this.authSubject.next(true);
      }else{
        this.authSubject.next(false);
      }
    })
  }

  register(user: any): Observable<any> {
    return this.httpClient.post<any>(`${this.AUTH_SERVER_ADDRESS}/users/register`, user).pipe(
      tap(async (res:  any ) => {
        if (res.user) {
          await localStorage.set("token", res.user);
          this.authSubject.next(true);
        }
      })
    );
  }

  loginTemp() {
    localStorage.setItem("token", "asdjjalsdjlasdgqwbjqgwhj");
    this.authSubject.next(true);
  }

  async login(email: string, password: string) {
    const adminRef = this.db.collection('Admin');
    const snapshot = await adminRef.ref.where('email','==',email).get();
    if (snapshot.empty) {
      return Promise.reject({message:" User not found"})
    }
    else{
      return this.afAuth.signInWithEmailAndPassword(email, password);
    }
    
  }

  
  // login(user:any): Observable<any> {
  //   return this.httpClient.post(`${this.AUTH_SERVER_ADDRESS}/users/login`, user).pipe(
  //     tap(async (res: any) => {
  //       if (res.user) {
  //         localStorage.setItem("token", res.token);
  //         this.authSubject.next(true);
  //       }
  //     })
  //   );
  // }

  async logout() {
    this.afAuth.signOut();
    await localStorage.removeItem("token");
    // this.authSubject.next(false);
  }

  isAuthenticated() {
    return this.authSubject.value;
  }
}
