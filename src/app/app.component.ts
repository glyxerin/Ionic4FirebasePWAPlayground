import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {FirebaseAuthService} from "./providers/firebase-auth.service";
import {Router} from "@angular/router";
import {WidgetUtilService} from "./providers/widget-util.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'List',
      url: '/list',
      icon: 'list'
    }
  ];

  isLoggedIn: boolean = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private firebaseAuthService: FirebaseAuthService,
    private widgetUtilService: WidgetUtilService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.getAuthState();
  }

  getAuthState() {
    this.widgetUtilService.presentLoadingWithOptions();

    this.firebaseAuthService.getAuthState().subscribe(user => {
      console.log('user auth state===', user ? user.toJSON(): null);
      if (user) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
      this.handleNavigation();
      this.widgetUtilService.dismissLoader();
    })
  }

  handleNavigation() {
    if (this.isLoggedIn) {
      const currentUrl = this.router.url.split('/')[1];
      console.log('route==', currentUrl)

      if (currentUrl === 'login' || currentUrl === 'signup') {
        this.router.navigate(['/home'])
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }
}
