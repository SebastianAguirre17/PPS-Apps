import { Component, OnInit } from '@angular/core';
import { JuegoService } from 'src/app/services/juego.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.page.html',
  styleUrls: ['./resultados.page.scss'],
})
export class ResultadosPage implements OnInit {

  primero='NN';
  segundo='NN';
  tercero='NN';

  constructor( private juegoService: JuegoService, private router:Router) {
    this.juegoService.obtenerJuegos().pipe( map( resp=>this.filtrar3Mejores(resp))).subscribe( datos=>{
      console.log(datos);
      this.primero=datos[0].usuario.split('@')[0];
      this.segundo=datos[1].usuario.split('@')[0];
      this.tercero=datos[2].usuario.split('@')[0];

    })
   }

  ngOnInit() {
  }

  jugar(){
    this.router.navigate(['seleccion']);
  }
  
  filtrar3Mejores( datos:any[] ){
    
    return datos.sort( (a,b)=> this.determinaMayor(a, b));

  }
  determinaMayor(a,b): number{
    if(a.tiempo > b.tiempo){
      return -1;
    }else{
      return 1;
    }
  }
}
