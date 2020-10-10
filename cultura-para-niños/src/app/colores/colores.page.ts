import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-colores',
  templateUrl: './colores.page.html',
  styleUrls: ['./colores.page.scss'],
})
export class ColoresPage implements OnInit {
  colores: any[] = [
    {
      name: "Blue.name",
      image: "assets/images/colors/blue.svg",
      sound: "Blue.sound",
      type: "Blue.type"
    }, 
    {
      name: "Green.name",
      image: "assets/images/colors/green.svg",
      sound: "Green.sound",
      type: "Green.type"
    },
    {
      name: "Red.name",
      image: "assets/images/colors/red.svg",
      sound: "Red.sound",
      type: "Red.type"
    },
    {
      name: "Purple.name",
      image: "assets/images/colors/purple.svg",
      sound: "Purple.sound",
      type: "Purple.type"
    },
    {
      name: "Yellow.name",
      image: "assets/images/colors/yellow.svg",
      sound: "Yellow.sound",
      type: "Yellow.type"
    }
  ];  

  activeItem = null;
  player : Howl = null;
  isPlaying = false;
  
  constructor(
    private translateService: TranslateService,
    ) {}
  
    ngOnInit() {
    }
    
    playSound(item){
      if(this.player){
        this.player.stop();
      }
      let soundPath;
      this.translateService.get(item.sound).subscribe(
        value => {
          soundPath = value;
        }
      );
      this.player = new Howl({
        src: [soundPath],
        onplay:() =>  {
          console.log('onplay');
          this.isPlaying = true;
          this.activeItem = item;
        },
        onend:() => {
          this.activeItem = null;
          console.log('onend');
        }
      });
      this.player.play();
    }

    togglePlayer(pause){
      this.isPlaying = !pause;
      if(pause){
        this.player.pause();
        this.activeItem = null;
      } else{
        this.player.play();
      }
    }

    start(item, pause){
      this.playSound(item);
      this.togglePlayer(pause);
    }
  }