import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Mensaje } from '../models/mensaje';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  private grupoSelected;
  private itemsCollection: AngularFirestoreCollection<any>;
  items: Observable<any[]>;

  constructor( private httpClient: HttpClient, private afs: AngularFirestore ) {
    this.itemsCollection = this.afs.collection<any>('mensajes');
    this.items = this.itemsCollection.valueChanges();
  }

  public nuevoMensaje( mensaje: Mensaje){
    
    return this.itemsCollection.add( {mensaje:mensaje.mensaje, fecha:mensaje.fecha, usuario:mensaje.usuario, timestamp:mensaje.timestamp, grupo:mensaje.grupo} );
  }

  setearGrupo( nombre ){
    this.grupoSelected = nombre;
  }

  public getGrupo(  ){
    return this.grupoSelected;
  }
  public getMensajes(){

    return this.items.pipe(  map(datos => {
      console.log(datos);
      return datos.sort((a, b) => {
        return  parseFloat(a.timestamp) - parseFloat(b.timestamp);
      });
    })
    );
    
  }

  private objecToArray( datos: Object ){
    const mensajes : Mensaje[] = [];
    if(datos == null) return [];

    Object.keys( datos ).forEach( key =>{
        let mensaje: Mensaje = datos[key];
        mensaje.id = key ;
        mensajes.push(mensaje);
    })
    return mensajes;
  }


}
