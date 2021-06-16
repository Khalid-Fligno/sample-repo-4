import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpService } from './http.service';
import { MaterialModule } from './material/material.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from './components/shared/shared.module';
import { AlertComponent } from './components/alert/alert.component';
import { SuccessComponent } from './components/success/success.component';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { TokenInterceptor } from './auth/token.interceptor';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { environment } from 'src/environments/environment';

// let firebaseConfig = {
//    apiKey: 'AIzaSyAxS1IQqle6bXkO018qwJdaUXAfj845G-s',
//    authDomain: 'quickstart-1588594831516.firebaseapp.com',
//    databaseURL: 'https://quickstart-1588594831516.firebaseio.com',
//    projectId: 'quickstart-1588594831516',
//    storageBucket: 'quickstart-1588594831516.appspot.com',
//    messagingSenderId: '213071860801'
// };
// const firebaseConfig = {
//      apiKey: 'AIzaSyBayQ5iob9mqDvVMNQtytsmyRF6YRmFPYQ',
//      authDomain: 'fitazfk-app.firebaseapp.com',
//      databaseURL: 'https://fitazfk-app.firebaseio.com',
//      projectId: 'fitazfk-app',
//      storageBucket: 'fitazfk-app.appspot.com',
//      messagingSenderId: '100949764253',
//      appId: "1:100949764253:ios:fe0422c37d2df031",
// };

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    SuccessComponent,
    SplashScreenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    AuthModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule, // storage,
    MatNativeDateModule,
  ],
  providers: [
    HttpService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
