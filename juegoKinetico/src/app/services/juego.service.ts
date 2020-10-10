import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JuegoService {

  constructor(private http:HttpClient) { }

  guardar( user, time ){
    return this.http.post(`https://login-742f5.firebaseio.com/heroesJuego.json`,{ usuario:user, tiempo:time });
  }

  obtenerJuegos(){
    return this.http.get(`https://login-742f5.firebaseio.com/heroesJuego.json`).pipe( map(datos => {
      return this.objecToArray(datos);
    })
  );
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
}
 