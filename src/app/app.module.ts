import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Geolocation } from '@ionic-native/geolocation';
import { NgxGaugeModule } from 'ngx-gauge';

import { HistoryPage } from '../pages/history/history';
import { PreferencesPage } from '../pages/preferences/preferences';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {LoginService} from '../services/login.service';
import {AuthService} from '../services/auth.service';
import {AuthInterceptor} from '../services/auth.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { RegistrationPage } from '../pages/registration/registration';
import { LoginPage } from '../pages/login/login';
import { ProgressBarComponent } from '../components/progress-bar/progress-bar';
import {ActivityCreationPage} from '../pages/activity-creation/activity-creation';
import {RealisationService} from '../services/realisation.service';
import {SportService} from '../services/sport.service';
import {EvaluationService} from '../services/evaluation.service';
import {GeolocationService} from '../services/geolocation.service';
import {ActivityPage} from '../pages/activity/activity';
import {ProgrammeService} from '../services/programme.service';
import {ProgrammePage} from '../pages/programme/programme';
import {ActivityDetailsPage} from '../pages/activity-details/activity-details';
import {DateService} from '../services/date.service';
import {ActivityService} from '../services/activity.service';
import {CronService} from '../services/cron.service';
import { PlageHoraireService } from '../services/plagehoraire.service';
import {LocationModalPage} from '../pages/location-modal/location-modal';
import { InfoIndicePage } from '../pages/info-indice/info-indice';
import { ObjectifsPreferencesPage } from '../pages/objectifs-preferences/objectifs-preferences';

@NgModule({
  declarations: [
    MyApp,
    HistoryPage,
    PreferencesPage,
    HomePage,
    TabsPage,
    RegistrationPage,
    LoginPage,
    ProgressBarComponent,
    ActivityCreationPage,
    ActivityPage,
    ProgrammePage,
    ActivityDetailsPage,
    LocationModalPage,
    InfoIndicePage,
    ObjectifsPreferencesPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    NgxGaugeModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HistoryPage,
    PreferencesPage,
    HomePage,
    TabsPage,
    RegistrationPage,
    LoginPage,
    ActivityCreationPage,
    ActivityPage,
    ProgrammePage,
    ActivityDetailsPage,
    LocationModalPage,
    InfoIndicePage,
    ObjectifsPreferencesPage
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
    UserService,
    RealisationService,
    SportService,
    EvaluationService,
    Geolocation,
    GeolocationService,
    ProgrammeService,
    DateService,
    ActivityService,
    CronService,
    PlageHoraireService
  ]
})
export class AppModule {}
