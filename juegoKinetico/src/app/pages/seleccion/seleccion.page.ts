import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seleccion',
  templateUrl: './seleccion.page.html',
  styleUrls: ['./seleccion.page.scss'],
})
export class SeleccionPage implements OnInit {

  constructor( private router:Router) { }

  ngOnInit() {
  }

  irAHome( ruta ){
    this.router.navigate([ruta]);
  }

}
