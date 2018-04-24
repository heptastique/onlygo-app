import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HistoryPage } from '../pages/history/history';
import { PreferencesPage } from '../pages/preferences/preferences';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {LoginService} from '../services/login.service';
import {AuthService} from '../services/auth.service';
import {AuthInterceptor} from '../services/auth.interceptor';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {UserService} from '../services/user.service';
import {RegistrationPage} from '../pages/registration/registration';
import {LoginPage} from '../pages/login/login';

@NgModule({
  declarations: [
    MyApp,
    HistoryPage,
    PreferencesPage,
    HomePage,
    TabsPage,
    RegistrationPage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HistoryPage,
    PreferencesPage,
    HomePage,
    TabsPage,
    RegistrationPage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LoginService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    UserService
  ]
})
export class AppModule {}
