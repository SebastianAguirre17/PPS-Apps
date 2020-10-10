import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

import { Gyroscope } from '@ionic-native/gyroscope/ngx';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Flashlight } from '@ionic-native/flashlight/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  ngOnInit() {
  }
  async logout() {
    if(this.activateKeyWord){
      this.creoToast(false, "Para finalizar sesión la alarma debe estar desactivada.")
    }else{
      await this.authService.logout();
    }
  }
  public keyWord: string;
  public xOrient: any;
  public yOrient: any;
  public zOrient: any;
  public timestamp: any
  public accX: any;
  public accY: any;
  public accZ: any;
  public activar: boolean = true;
  public activateKeyWord: boolean = false;
  public subscription;
  public estado;
  public realKeyWord: string = "1234";

  constructor(
    private toastController:ToastController,
    private authService: AuthService,
    private gyroscope: Gyroscope,
    private deviceMotion: DeviceMotion,
    private nativeAudio: NativeAudio,
    private luzFlash: Flashlight,
    private vibration: Vibration) {

    this.nativeAudio.preloadSimple('izquierda', 'assets/sounds/izquierda.mp3').then((success) => {
      console.log("Cargado IZQ");
    }, (error) => { console.log(error); });

    this.nativeAudio.preloadSimple('derecha', 'assets/sounds/derecha.mp3').then((success) => {
      console.log("Cargado DER");
    }, (error) => { console.log(error); });

    this.nativeAudio.preloadSimple('vertical', 'assets/sounds/vertical.mp3').then((success) => {
      console.log("Cargado VERT");
    }, (error) => { console.log(error); });

    this.nativeAudio.preloadSimple('horizontal', 'assets/sounds/horizontal.mp3').then((success) => {
      console.log("Cargado HORIZ");
    }, (error) => { console.log(error); });

    this.estado = "Desactivado"
  }


  playIzq() { this.nativeAudio.play('izquierda').then((success) => { console.log("PLAY IZQ "); }, (error) => { console.log(error); }); }
  playDer() { this.nativeAudio.play('derecha').then((success) => { console.log("PLAY DER"); }, (error) => { console.log(error); }); }
  playVert() { this.nativeAudio.play('vertical').then((success) => { console.log("PLAY VERT"); }, (error) => { console.log(error); }); }
  playHoriz() { this.nativeAudio.play('horizontal').then((success) => { console.log("PLAY HORIZ"); }, (error) => { console.log(error); }); }

  activoAcelerometro() {
    this.Accelerometer();
    this.activar = !this.activar;
    this.estado = "Activado";
    
  }
  showAlert(){
    if(this.activateKeyWord){
      this.creoToast(false, "Debe ingresar la palabra clave.")
    }else{
      this.activateKeyWord = true;
    }
  }
  stopAcelerometer(){
    if(this.keyWord === this.authService.keyWord){
      this.creoToast(true, 'Alarma apagada.');
      this.desactivoAcelerometro();
    }else{
      this.creoToast(false, 'Palabra clave incorrecta.')
    }
  }
  async creoToast(rta: boolean, mensaje:string) {

    if(rta == true)
    {
      const toast = await this.toastController.create({
        message: mensaje,
        color: 'success',
        position: 'top',
        duration: 2000 
      });
  
      toast.present();
  
  
    }
    else{
      const toast = await this.toastController.create({
        message: mensaje,
        color: 'dark',
        position: 'bottom',
        duration: 2000 ,
        buttons: [
          {
            text: 'Cerrar',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
  
      toast.present();
    }}

  desactivoAcelerometro() {
    this.subscription.unsubscribe();
    this.activar = !this.activar;
    this.estado = "Desactivado"
    this.activateKeyWord = false;
    this.keyWord = "";
  }


  Accelerometer() {
    this.subscription = this.deviceMotion.watchAcceleration({ frequency: 6000 }).subscribe((acceleration: DeviceMotionAccelerationData) => {
      console.log("esta es el watch: ", acceleration);
      this.accX = acceleration.x;
      this.accY = acceleration.y;
      this.accZ = acceleration.z;


      //VERTICAL
      if (this.accY >= 9) {
        console.log("Está parado");
        this.estado = "PARADO";
        this.luzFlash.switchOn();
        setTimeout(function () { this.luzFlash.switchOff(); }, 3000);
        this.playVert();
      }

      //HORIZONTAL
      else if (this.accZ >= 9) {
        console.log("Está horizontal");
        this.estado = "ACOSTADO";
        this.playHoriz();
        this.vibration.vibrate(5000);
        // setTimeout(function() {this.vibration.vibrate(0);}, 5000);
      }

      //IZQ
      else if (this.accX >= 9) {
        console.log("Está de costado IZQ");
        this.estado = "IZQUIERDA";
        this.playIzq();
      }

      //DER
      else if (this.accX <= -9) {
        console.log("Está de costado DER");
        this.estado = "DERECHA";
        this.playDer();
      }

      //RESTO
      else {
        console.log("-----Registro de Watch------ ");
        this.luzFlash.switchOff();
        this.vibration.vibrate(0);

      }
    });

  }

 
}
