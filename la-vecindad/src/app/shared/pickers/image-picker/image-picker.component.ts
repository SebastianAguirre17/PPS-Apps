import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  Input
} from '@angular/core';
import { Plugins, Capacitor, CameraSource, CameraResultType } from '@capacitor/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @ViewChild('filePicker', {static: false}) filePickerRef: ElementRef<HTMLInputElement>;
  @Output() imagePick = new EventEmitter<string | File>(); // Emits the file (filepicker) or the stringbase64 (camera).
  @Input() showPreview = false; // after imagePick is emitted the parent component sets value to this property.
  selectedImage: string;
  usePicker = false;

  constructor(public camera: Camera,private platform: Platform) {}

  ngOnInit() {
    console.log('Mobile:', this.platform.is('mobile'));
    console.log('Hybrid:', this.platform.is('hybrid'));
    console.log('iOS:', this.platform.is('ios'));
    console.log('Android:', this.platform.is('android'));
    console.log('Desktop:', this.platform.is('desktop'));
    if (
      (this.platform.is('mobile') && !this.platform.is('hybrid')) ||
      this.platform.is('desktop')
    ) {
      this.usePicker = true;
    }
    console.log('ngOnInit: ' + this.usePicker );
  }


  onPickImage() { // When camera is used (mobile)
    console.log('Aca llega');
    // if (!Capacitor.isPluginAvailable('Camera') || this.usePicker) {   // || this.usePicker
    //   this.filePickerRef.nativeElement.click(); // I make the click in the hidden input, not the user
    //   return;
    // }
    console.log('paso el if');
    // const options: CameraOptions = {
    //   quality: 100,
    //   destinationType: this.camera.DestinationType.DATA_URL,
    //   encodingType: this.camera.EncodingType.JPEG,
    //   mediaType: this.camera.MediaType.PICTURE,
    //   correctOrientation: true
    //   // sourceType: PictureSourceType.PHOTOLIBRARY
    // };

    // this.camera.getPicture( options )
    // .then( (imageData) => {
    //   // this.imagen=(<any>window).Ionic.WebView.convertFileSrc(imageData);
    //   this.imagePick.emit(imageData.dataUrl);

    // })
    // .catch(error =>{
    //   console.error( error );
    // });
    Plugins.Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      // height: 320,
      width: 300,
      resultType: CameraResultType.DataUrl
      
    })
      .then(image => {
        this.selectedImage = image.dataUrl;
        // alert(this.selectedImage);
        console.log('Obtiene la foto');
        this.imagePick.emit(image.dataUrl);
        console.log('Emite la foto');
      })
      .catch(error => {
        console.log('Error en la camara');
        console.log(error);
        if (this.usePicker) {
          this.filePickerRef.nativeElement.click();
        }
        return false;
      });
  }


  onFileChosen(event: Event) { // when file picker is used (desktop)
    // console.log(event);
    console.log("onFileChosen");
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
      this.imagePick.emit(pickedFile);
    };
    fr.readAsDataURL(pickedFile);
  }
}
