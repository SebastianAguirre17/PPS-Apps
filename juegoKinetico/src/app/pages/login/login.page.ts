import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  correo: string;
  clave: number;
  cargando = false;
  click=new Audio();
  private warning = new Audio();
  constructor(
    private alertControler: AlertController, 
    private loguinService: AuthService,
    private router: Router) { }

  ngOnInit( ) {
    this.warning.src='../../../assets/sonido/warning.mp3';
    this.warning.load();
    this.click.src='../../../assets/sonido/click.mp3';
    this.click.load();
  }

  logIn(){
    this.cargando = true;
  
    this.loguinService.logIn( this.correo , this.clave ).subscribe( async resp =>{
      if( resp ){
        localStorage.setItem('user',this.correo);
        this.router.navigate(['/seleccion']);
        this.cargando=false;
      }else{
        this.warning.play();
        this.cargando=false;
      }
      this.clave = null;
      this.correo = null;
    });
  }

  autocompleta( value: string ){
    this.click.play();
    switch(value){
      case 'AD': {
        this.correo="admin@admin.com";
        this.clave=1111;
        break;
      }
      case 'AN':{
        this.correo="anonimo@anonimo.com";
        this.clave=4444;
        break;
      }
      case 'IN':{
        this.correo="invitado@invitado.com";
        this.clave=2222;
        break;
      }
      case 'TS':{
        this.correo="tester@tester.com";
        this.clave=5555;
        break;
      }
      case 'US':  {
        this.correo="usuario@usuario.com";
        this.clave=3333;
        break;
      }
    }
  }
}