import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsjComponent } from './msj/msj.component';



@NgModule({
  declarations: [
    MsjComponent
    
  ],
  imports: [
    CommonModule,
  ],
  exports:[
    MsjComponent
  ],
  bootstrap:[]
})
export class ComponentsModule { }
