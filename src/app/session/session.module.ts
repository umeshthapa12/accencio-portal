import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import { LoginoneComponent } from './loginone/loginone.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { LockScreenComponent } from './lockscreen/lockscreen.component';
import { SubscribesComponent } from './subscribes/subscribes.component';
import { UnderMaintanceComponent } from './under-maintance/under-maintance.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ComingsoonV2Component } from './coming-soonV2/coming-soonV2.component';
import { MaintenanceV2Component } from './maintenanceV2/maintenanceV2.component';
import { SessionRoutes } from './session.routing';
import { InProgressComponent } from './inprogress/ip.component';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MyHttpInterceptor } from 'app/service/MyHttpInterceptor';

import {SocialLoginModule} from 'angularx-social-login';

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      TranslateModule,
      NgxSpinnerModule,
      ReactiveFormsModule,
      ToastrModule.forRoot(),
      RouterModule.forChild(SessionRoutes),

     SocialLoginModule
   ],
   declarations: [
      LoginoneComponent,
      InProgressComponent,
      RegisterComponent,
      ForgotPasswordComponent,
      ComingSoonComponent,
      LockScreenComponent,
      SubscribesComponent,
      UnderMaintanceComponent,
      NotFoundComponent,
      ComingsoonV2Component,
      MaintenanceV2Component
   ],
   providers: [
      NgxSpinnerService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: MyHttpInterceptor,
			multi: true,
		}
   ]
})

export class SessionModule {}
