import { Injectable } from '@angular/core';
import {Platform, ToastController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class WidgetUtilService {

  constructor(public toastController: ToastController, private platform: Platform) {}

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: this.platform.is('desktop') ? 'top': 'bottom',
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }

}
