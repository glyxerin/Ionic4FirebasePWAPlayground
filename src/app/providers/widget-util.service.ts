import { Injectable } from '@angular/core';
import {AlertController, LoadingController, Platform, ToastController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class WidgetUtilService {

  loading: any = {};

  constructor(
      public toastController: ToastController,
      public alertController: AlertController,
      private platform: Platform,
      private loadingController: LoadingController
  ) {}

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

  async presentLoadingWithOptions() {
    this.loading = await this.loadingController.create({
      message: 'Please wait...',
      translucent: true,
      backdropDismiss: true
    });
    await this.loading.present();

    const { role, data } = await this.loading.onDidDismiss();
    console.log('Loading dismissed with role:', role);
  }

  async dismissLoader() {
    console.log('dismissLoader()')
    await this.loading.dismiss();
  }

  async presentAlertConfirm(header, message, buttons) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
       header,
       message,
       buttons
    });

    await alert.present();
  }

}
