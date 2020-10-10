import { Component, OnInit, Input } from '@angular/core';
import { Mensaje } from 'src/app/models/mensaje';


@Component({
  selector: 'app-msj',
  templateUrl: './msj.component.html',
  styleUrls: ['./msj.component.scss'],
})
export class MsjComponent implements OnInit {
  
  @Input() mensajeEntrada: Mensaje;
  
  constructor() {
    
  }

  ngOnInit() {
   
  }

}
