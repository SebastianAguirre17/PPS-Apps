import { Component, OnInit } from '@angular/core';
import { MensajesService } from 'src/app/services/mensajes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.page.html',
  styleUrls: ['./grupo.page.scss'],
})
export class GrupoPage implements OnInit {

  click= new Audio();
  constructor( private mensajesService: MensajesService, private router:Router) { 
    this.click.src='../../../assets/sonido/click.mp3';
    this.click.load();
  }

  ngOnInit() {
  }
  salir(){
    this.router.navigate(['login']);
  }
  seleccionGrupo( grupoSelected : string ){

    if( grupoSelected === 'PPS-4A' ){
      this.mensajesService.setearGrupo('PPS-4A');
    }else{
      this.mensajesService.setearGrupo('PPS-4B');
    }
    //this.click.play();
    this.router.navigate(['home']);
  } 

}
