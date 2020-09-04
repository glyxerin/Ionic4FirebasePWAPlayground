import { Component, OnInit } from '@angular/core';
import {FirebaseAuthService} from "../providers/firebase-auth.service";
import {WidgetUtilService} from "../providers/widget-util.service";
import {FirestoreDbService} from "../providers/firestore-db.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  productList: Array<any> = [];
  productAvailable: boolean = false;

  constructor(private firebaseAuthService: FirebaseAuthService,
              private widgetUtilService: WidgetUtilService,
              private router: Router,
              private firestoreDbService: FirestoreDbService) {
    this.getProductList();
  }

  ngOnInit() {
  }

  async logout() {
    try {
      await this.firebaseAuthService.logout();
      this.widgetUtilService.presentToast('Logout Success!');
      this.router.navigate(['/login']);
    } catch (error) {
      console.log('Error', error);
      this.widgetUtilService.presentToast(error.message);
    }
  }

  getProductList(event = null) {
    this.productAvailable = false;
    this.firestoreDbService.getProductList().subscribe(result => {
      console.log('result', result);
      this.productList = result;
      this.productAvailable = true;
      this.handleRefresher(event);
    }, (error) => {
      this.productAvailable = false;
      this.widgetUtilService.presentToast(error.message);
      this.handleRefresher(event);
    })
  }

  handleRefresher(event) {
    if (event) {
      event.target.complete();
    }
  }

  doRefresh(event) {
    // console.log('Begin async operation');
    //
    // setTimeout(() => {
    //   console.log('Async operation has ended');
    //   event.target.complete();
    // }, 2000);

    this.getProductList(event)
  }

  openAddProductPage() {
    this.router.navigate(['/add-product']);
  }

}
