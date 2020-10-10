import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ActionSheetController, 

  LoadingController   } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public loginForm: FormGroup;
  splash = true;
  spinner = false;
  constructor(
    public modelController: ModalController,
    public authService: AuthService,
    public actionSheetController: ActionSheetController
  ) { 
    this.loginForm = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    });
  }

  ngOnInit() {

  }

  ionViewDidEnter() {
    setTimeout(() => this.splash = false, 4000);
  }

  async login(){
    this.spinner = true;
    setTimeout(() => this.authService.login(this.loginForm.value["email"], this.loginForm.value["password"]), 4000)
    
  }

  async creoSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Ingresar como ...',
      cssClass: 'actSheet',
        buttons: [{
        text: 'admin',
        icon: 'build',
        handler: () => {          
          this.loginForm.patchValue({email: "admin@gmail.com", password: "111111"});
        }
      }, {
        text: 'invitado',
        icon: 'body',
        handler: () => {
          this.loginForm.patchValue({email: "invitado@gmail.com", password: "222222"});
        }
      }, {
        text: 'usuario',
        icon: 'sad',
        handler: () => {
          this.loginForm.patchValue({email: "usuario@gmail.com", password: "333333"});
        }
      }, {
        text: 'anonimo',
        icon: 'logo-snapchat',
        handler: () => {
          this.loginForm.patchValue({email: "anonimo@gmail.com", password: "444444"});
        }
      },{
        text: 'tester',
        icon: 'phone-portrait',
        handler: () => {
          this.loginForm.patchValue({email: "tester@gmail.com", password: "555555"});
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        cssClass: 'btnCancel',
        role: 'cancel',
        handler: () => {
         
        }
      }]
    });
    await actionSheet.present();
  }
}
