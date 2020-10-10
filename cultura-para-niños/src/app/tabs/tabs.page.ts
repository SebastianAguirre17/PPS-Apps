import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    }
  ];

  idioms: any[] = [
    {
      value: 'es',
      label: 'Español'
    },
    {
      value: 'en',
      label: 'Ingles'
    },
    {
      value: 'pt',
      label: 'Portugués'
    }
  ];
  
  constructor(
    private translateService: TranslateService,
    private authService: AuthService,
    private navCtrl: NavController,
    ) {}
  
    ngOnInit() {
    }


    changeLanguage(lang) {
      this.translateService.use(lang);
    }

    logout(){
      this.authService.SignOut()
      .then(res => {
        console.log(res);
        this.navCtrl.navigateBack('');
      })
      .catch(error => {
        console.log(error);
      })
    }
  }
