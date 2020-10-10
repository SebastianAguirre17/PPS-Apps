import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, filter, reduce } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { auth } from 'firebase';
import { AngularFireAuth } from "@angular/fire/auth";

import { User } from "./user.model";
import { MessagesIndex } from "./user.model";


import { Plugins } from '@capacitor/core';
import * as firebase from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: any;

  errorMessages = {
    'invalid-argument': 'Se ha ingresado un argumento invalido.',
    'invalid-disabled-field': 'El valor ingrsado para la propiedad de usuario es invalido.',
    'user-not-found' : 'No existe ningun registro del usuario.',
    'email-already-exists' : 'Ya existe un usuario registrado con ese email.',
    'email-already-in-use' : 'Ya existe un usuario registrado con ese email.',
    'wrong-password' : 'La contraseña que ha ingresado es invalida.'
  
     /* ADD HERE THE OTHERs IDs AND THE CORRESPONDING MESSAGEs */
  
  } as MessagesIndex;
  
    constructor(
      public afStore: AngularFirestore,
      public ngFireAuth: AngularFireAuth,
      public router: Router,  
      public ngZone: NgZone 
    ) {
      this.ngFireAuth.authState.subscribe(user => {
        if (user) {
          this.userData = user;
          localStorage.setItem('user', JSON.stringify(this.userData));
          JSON.parse(localStorage.getItem('user'))
          
        this.saveInStorage(this.userData);
        } else {
          localStorage.setItem('user', null);
          JSON.parse(localStorage.getItem('user'));
        }
      })
    }
  
    // Login in with email/password
    SignIn(email, password) { 
      return this.ngFireAuth.auth.signInWithEmailAndPassword(email, password)
    }
  
    // Register user with email/password
    RegisterUser(email, password) {
      return this.ngFireAuth.auth.createUserWithEmailAndPassword(email, password)
    }
  
     // Recover password
    PasswordRecover(passwordResetEmail) {
      return this.ngFireAuth.auth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email has been sent, please check your inbox.');
      }).catch((error) => {
        window.alert(error)
      })
    }
  
    // Returns true when user is looged in
    get isLoggedIn(): boolean {
      const user = JSON.parse(localStorage.getItem('user'));
      return (user !== null && user.emailVerified !== false) ? true : false;
    }
  
    // Returns true when user's email is verified
    get isEmailVerified(): boolean {
      const user = JSON.parse(localStorage.getItem('user'));
      return (user.emailVerified !== false) ? true : false;
    }
  
    // Sign in with Gmail
    GoogleAuth() {
      return this.AuthLogin(new auth.GoogleAuthProvider());
    }
  
    // Auth providers
    AuthLogin(provider) {
      return this.ngFireAuth.auth.signInWithPopup(provider)
      .then((result) => {
         this.ngZone.run(() => {
            this.router.navigate(['dashboard']);
          })
        this.SetUserData(result.user);
        this.saveInStorage(result.user);
      }).catch((error) => {
        window.alert(error)
      })
    }
  
    // Store user in localStorage
    SetUserData(user) {
      const userRef: AngularFirestoreDocument<any> = this.afStore.doc(`users/${user.uid}`);
      const userData: User = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified
      }
      return userRef.set(userData, {
        merge: true
      })
    }
  
    // Sign-out 
    SignOut() {
      return this.ngFireAuth.auth.signOut().then(() => {
        localStorage.removeItem('user');        
        Plugins.Storage.remove({key: 'user-bd'});
      })
    }
  
  //translate errors
  public printErrorByCode(code: string): string {
    code = code.split('/')[1];
    if (this.errorMessages[code]) {
        return (this.errorMessages[code]);
    } else {
        return ('Ha ocurrido un error desconocido. \n Código del error:: ' + code);
    }
  }

  userDetails() {
    return firebase.auth().currentUser;
  }

  saveInStorage(user) {
    return new Promise((resolve, reject) => {
      this.TraerUno('users', user.uid)
      .then(result => {
        Plugins.Storage.set({ key: 'user-bd', value: JSON.stringify(result) });
        resolve('saved in Storage');
        // JSON.parse(localStorage.getItem('user-bd'));
        // this.router.navigate(['gallery']); // navegar de aca es una negrada
      });
    });
  }

  
  TraerUno(collection, id) {
    return new Promise<any>((resolve, reject) => {
      this.afStore.collection(`${collection}`).doc(id).valueChanges().subscribe(snapshots => {
        resolve(snapshots);
      });
    });
  }

//   host = 'https://login-742f5.firebaseio.com/usuarios.json';

//   constructor(private http: HttpClient, private route:Router){ }

//   public logOut(){
//     this.route.navigate(['/login']);
//   }

//   public logIn( correo: string, clave: string ){
//     return this.getUsuarios().pipe( map((resp:any) => this.verificaUsuarioYclave(resp, correo, clave) ) );
//   }


//   public getDatosUser( correo: string ){
//     return this.getUsuarios().pipe( map((resp:any) => this.devuelveDataUsuario( resp, correo) ) );
//   }

//   private getUsuarios(){
//     return this.http.get( this.host ).pipe ( map(datos => {
//       return this.objecToArray(datos);
//     }));
//   }

//   public altaUsuarios( usuario: Usuario ){
//     return this.http.post(this.host, usuario);
//   }

//   private objecToArray( datos: Object ){
//     const list : any[] = [];
//     if(datos == null) return [];

//     Object.keys( datos ).forEach( key =>{
//         let turno = datos[key];
//        // turno._id = key ;
//         list.push(turno);
//     })
//     return list;
//   }

//   private devuelveDataUsuario( lista, correo ){
//     let datos={};
//     lista.forEach((dato:any) => {
//       if( dato.correo == correo ){
//         datos = dato;
//       }
//     });
//     return datos;
//   }

//   private verificaUsuarioYclave( elementos, correo:string, clave:string ): boolean{
//     let respuesta = false;
//     elementos.forEach((dato:any) => {
//       if(dato.clave == clave && dato.correo==correo){
//         console.log(dato);
//         localStorage.setItem('usuario',JSON.stringify(dato));
//         respuesta= true;
//       }
//     });
//     return respuesta;
//   }

//   public getCurrentUserId(){
//     let usuario = JSON.parse(localStorage.getItem('usuario'));
//     return usuario.id;
//   }
//   public getCurrentUserMail(){
//     let usuario = JSON.parse(localStorage.getItem('usuario'));
//     return usuario.correo;
//   }
}
