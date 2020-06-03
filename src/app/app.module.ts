import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserAuthenticationComponent } from './auth/user-authentication.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { UnauthGuard } from './auth/unauth';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HttpClientModule } from '@angular/common/http';
import { UserComponent } from './auth/user-setting/user.component';
import { UserInfoComponent } from './auth/userinfo/userinfo.component';
import { ASession } from 'src/request/session';


@NgModule({
  declarations: [
    AppComponent,
    UserAuthenticationComponent,
    DashboardComponent,
    HomeComponent,
    SigninComponent,
    SignupComponent,
    UserComponent,
    UserInfoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [AuthGuard, UnauthGuard, ASession],
  bootstrap: [AppComponent, UserInfoComponent]
})
export class AppModule { }
