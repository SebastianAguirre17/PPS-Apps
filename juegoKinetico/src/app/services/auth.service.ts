import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, filter, reduce } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  host = 'https://login-742f5.firebaseio.com/usuarios.json';

  constructor(private http: HttpClient, private route:Router){ }

  public logOut(){
    this.route.navigate(['/login']);
  }

  public logIn( correo: string, clave: number ){
    return this.getUsuarios().pipe( map((resp:any) => this.verificaUsuarioYclave(resp, correo, clave) ) );
  }


  public getDatosUser( correo: string ){
    return this.getUsuarios().pipe( map((resp:any) => this.devuelveDataUsuario( resp, correo) ) );
  }

  private getUsuarios(){
    return this.http.get( this.host ).pipe ( map(datos => {
      return this.objecToArray(datos);
    }));
  }

  public altaUsuarios( usuario: Usuario ){
    return this.http.post(this.host, usuario);
  }

  private objecToArray( datos: Object ){
    const list : any[] = [];
    if(datos == null) return [];

    Object.keys( datos ).forEach( key =>{
        let turno = datos[key];
       // turno._id = key ;
        list.push(turno);
    })
    return list;
  }

  private devuelveDataUsuario( lista, correo ){
    let datos={};
    lista.forEach((dato:any) => {
      if( dato.correo == correo ){
        datos = dato;
      }
    });
    return datos;
  }

  private verificaUsuarioYclave( elementos, correo:string, clave:number ): boolean{
    let respuesta = false;
    elementos.forEach((dato:any) => {
      if(dato.clave == clave && dato.correo==correo){
        console.log(dato);
        localStorage.setItem('usuario',JSON.stringify(dato));
        respuesta= true;
      }
    });
    return respuesta;
  }

  public getCurrentUserId(){
    let usuario = JSON.parse(localStorage.getItem('usuario'));
    return usuario.id;
  }
  public getCurrentUserMail(){
    let usuario = JSON.parse(localStorage.getItem('usuario'));
    return usuario.correo;
  }
}