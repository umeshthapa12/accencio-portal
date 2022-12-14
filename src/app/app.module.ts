import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';
import { TourNgBootstrapModule } from 'ngx-tour-ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader} from '@ngx-translate/http-loader';
import { SidebarModule } from 'ng-sidebar';
import { ToastrModule } from 'ngx-toastr';
import 'hammerjs';

import { AuthServicess } from './service/auth/auth.service';

import { AccencioAppComponent} from './app.component';
import { RoutingModule } from "./app-routing.module";
import { MainComponent }   from './main/main.component';
import { AuthComponent }   from './auth/auth.component';
import { MenuToggleModule } from './core/menu/menu-toggle.module';
import { MenuItems } from './core/menu/menu-items/menu-items';
import { PageTitleService } from './core/page-title/page-title.service';
import { SessionModule } from './session/session.module';
import { WidgetsComponentModule } from './widgets-component/widgets-component.module';
import { ASession } from 'request/session';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ARequest } from 'request/request';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MyHttpInterceptor } from "./service/MyHttpInterceptor";
import { environment } from 'environments/environment';
import { GoogleAnalyticsService, NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';

import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';

/********** Custom option for ngx-translate ******/
export function createTranslateLoader(http: HttpClient) {
   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
	suppressScrollX: true
};

const perfectScrollbarConfig: PerfectScrollbarConfigInterface = {
   suppressScrollX: true
};

@NgModule({
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		CdkTableModule,
		SidebarModule.forRoot(),
		RoutingModule,
		NgIdleKeepaliveModule.forRoot(),
		RouterModule,
		SessionModule,
		NgxSpinnerModule,
		ModalModule.forRoot(),
		TourNgBootstrapModule.forRoot(),
		NgbModalModule.forRoot(),
		AgmCoreModule.forRoot({apiKey: 'AIzaSyBtdO5k6CRntAMJCF-H5uZjTCoSGX95cdk'}),
		PerfectScrollbarModule,
		MenuToggleModule,
		HttpClientModule,
		NgxGoogleAnalyticsModule.forRoot('G-H9BQNM7VRW'),
    	NgxGoogleAnalyticsRouterModule.forRoot({ include: ['/full-uri-match' ]}),
		TranslateModule.forRoot({
		loader: {
			provide: TranslateLoader,
			useFactory: createTranslateLoader,
			deps: [HttpClient]
		}
		}),
		ToastrModule.forRoot({
			timeOut: 2000,
			preventDuplicates: true
		}),
		WidgetsComponentModule
    ],
	declarations: [
		AccencioAppComponent,
		MainComponent,
		AuthComponent
	],
	bootstrap: [AccencioAppComponent],
	providers:[
		ASession,
		ARequest,
		MenuItems,
		PageTitleService,
		NgxSpinnerService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: MyHttpInterceptor,
			multi: true,
		},
		AuthServices,
		{
			provide: PERFECT_SCROLLBAR_CONFIG,
			useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
		},
		GoogleAnalyticsService
	]
})
export class AccencioAppModule { }
