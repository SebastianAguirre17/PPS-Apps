import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController, ActionSheetController, LoadingController } from '@ionic/angular';
import { AuthenticateService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  splash = true;

  constructor(
    public actionSheetController: ActionSheetController,
    private navCtrl: NavController,
    private authService: AuthenticateService,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
  ) { }

  validationsForm: FormGroup;
  errorMessage = '';


  validationMessages = {
    email: [
      { type: 'required', message: 'Debe ingresar email.' },
      { type: 'pattern', message: 'Ingresar un email valido.' }
    ],
    password: [
      { type: 'required', message: 'Debe ingresar contraseña.' },
      { type: 'minlength', message: 'Mínimo 6 caracteres' }
    ]
  };


  ngOnInit() {

    this.validationsForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
    });
  }


  loginUser(value) {
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Iniciando sesión...' })
      .then(loadingEl => {
        loadingEl.present();
        this.authService.loginUser(value)
        .then(res => {
          console.log(res);
          this.errorMessage = '';
          this.loadingCtrl.dismiss();
          this.navCtrl.navigateForward('/home');
        }, err => {
          console.log(err);
          this.errorMessage = err.message;
        });
      });
  }


  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Elegir el perfil para iniciar sesión:',
      cssClass: 'action-sheets',
      buttons: [{
        text: 'Admin',
        role: 'destructive',
        icon: 'build',
        handler: () => {
          this.validationsForm.patchValue({ email: 'admin@gmail.com' });
          this.validationsForm.patchValue({ password: '111111' });
        }
      }, {
        text: 'Invitado',
        icon: 'beer',
        handler: () => {
          this.validationsForm.patchValue({ email: 'invitado@gmail.com' });
          this.validationsForm.patchValue({ password: '222222' });
        }
      }, {
        text: 'Usuario',
        icon: 'person',
        handler: () => {
          this.validationsForm.patchValue({ email: 'usuario@gmail.com' });
          this.validationsForm.patchValue({ password: '333333' });
        }
      }, {
        text: 'Anonimo',
        icon: 'eye-off',
        handler: () => {
          this.validationsForm.patchValue({ email: 'anonimo@gmail.com' });
          this.validationsForm.patchValue({ password: '444444' });
        }
      }, {
        text: 'Tester',
        icon: 'bug',
        handler: () => {
          this.validationsForm.patchValue({ email: 'tester@gmail.com' });
          this.validationsForm.patchValue({ password: '555555' });
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }


  goToRegisterPage() {
    this.navCtrl.navigateForward('/register');
  }


  ionViewDidEnter(){
    setTimeout(() => this.splash = false, 5000);
  }

}
