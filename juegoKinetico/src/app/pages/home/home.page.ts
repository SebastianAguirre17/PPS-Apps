import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { Router } from '@angular/router';
import { JuegoService } from 'src/app/services/juego.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  
})
export class HomePage implements OnInit{
  eleccion;
  heroe: HTMLElement;
  deviceSubscription;
  x;y;z;
  time;
  interval;
  timeLeft: number;
  constructor(private deviceMotion: DeviceMotion, private router: Router, private juegoService:JuegoService) {
    if(this.router.url === '/home/dc'){
      this.eleccion='dc';
    }else{
      this.eleccion='marvel';
    }
  }
  ngOnInit(): void {
    this.Iniciar(); 
    
    
  }

  terminoJuego( ){

    this.pauseTimer();
    this.deviceSubscription.unsubscribe();
    this.juegoService.guardar(localStorage.getItem('user'),this.timeLeft).subscribe( resp=>{

    });
    Swal.fire({
      title: 'Juego terminado! ',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Nuevo Juego',
      cancelButtonText: 'Ver records',
    }).then((result) => {
      if (result.value) {
        this.router.navigate(['seleccion']);
      } else{
        this.router.navigate(['resultados']);

      }
    })
  }
  
  pauseTimer() {
    clearInterval(this.interval);
  }
  startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft >= 0) {
        this.timeLeft++;
      } else {
        this.timeLeft = 0;
      }
    },1000)
  }

  Iniciar(): void {
    this.timeLeft=0;
    this.heroe = document.getElementById('heroe');
    this.heroe.style.left="20vh";
    this.heroe.style.top="45vh";
    this.startTimer();

    this.deviceSubscription = this.deviceMotion.watchAcceleration({frequency: 100}).subscribe((acceleration: DeviceMotionAccelerationData) => {
      this.x=acceleration.x;
      this.y=acceleration.y;
      this.z=acceleration.z;
      this.time = acceleration.timestamp;
      const posicionActual = this.heroe.style.left;
      let numbero = posicionActual.split('vh')[0];
      this.heroe.style.left = `${parseInt(numbero)-this.x}vh`;
      const posicionActualTop = this.heroe.style.top;
      let numberoTop = posicionActualTop.split('vh')[0];
      this.heroe.style.top = `${parseInt(numberoTop)+this.y}vh`;
      if( parseInt(numbero) < 0 || parseInt(numbero) > 42 || parseInt(numberoTop) < 0 || parseInt(numberoTop) > 85 ){

        this.terminoJuego();
        
      }
    });
    
  }

}
