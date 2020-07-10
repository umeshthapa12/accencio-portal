import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { PageTitleService } from '../../core/page-title/page-title.service';

import PerfectScrollbar from 'perfect-scrollbar';
import { TranslateService } from '@ngx-translate/core';
import { Workbook } from '../../core/types/Workbook';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ASession } from 'request/session';
import { environment } from 'environments/environment';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Observable, forkJoin } from 'rxjs';
import { WorkbookPerm } from '../../core/types/WorkbookPerm';
var i = 1;
var lwbsspot: any;
var lloadspot: any;
function onReady2Callback(response, newApp) {
   if (response.status === "OK") {

      newApp.openDocument("spot-" + i.toString());

      i++;
      const wb = lwbsspot.find(el => el.id == ("spot-" + i.toString()));
      if (wb) {
         lloadspot(wb.analysis, wb.name, lwbsspot);
      }    
   }
}

@Component({
   selector: 'ms-dash',
   templateUrl: './dash-component.html',
   styleUrls: ['./dash-component.scss'],
   encapsulation: ViewEncapsulation.None
})

export class DashComponent implements OnInit {

   wbsspot: Workbook[];
   wbs: Workbook[];
   public company: any;
   public config: AngularEditorConfig;

   @ViewChild('spotcont', null) spotcont: ElementRef;
   observer: MutationObserver;

   public loadspot(analysis, name, lwbsspot) {
      var customizationInfo = {
         showAbout: false,
         showAnalysisInformationTool: false,
         showAuthor: false,
         showClose: false,
         showCustomizableHeader: false,
         showDodPanel: false,
         showExportFile: false,
         showExportVisualization: false,
         showFilterPanel: false,
         showHelp: false,
         showLogout: false,
         showPageNavigation: true,
         showReloadAnalysis: false,
         showStatusBar: false,
         showToolBar: false,
         showUndoRedo: false
      }
      var parameters = '';
      var reloadInstances = true;
      var apiVersion = "7.14";

      //lwbsspot.forEach(wb=> {
      spotfire.webPlayer.createApplication(
         environment.SPOTFIRE_API,
         customizationInfo,
         analysis,
         parameters,
         reloadInstances,
         apiVersion,
         onReady2Callback
      );
   }

   getDashboardData() {
      this.company = this.session.company;
      console.log(this.company);
      this.wbs = [];
      this.wbsspot = [];
      const allpermService = this.http.get(environment.API_GATEWAY + '/permission/byid/' + this.company);
      allpermService.subscribe(result => {
         
         const wbData = (result as WorkbookPerm).w;
         console.log(wbData);
         //const permData = results[1] as Object[];
         //this.workbooks = results[1] as Workbook[];
         this.initworkbooks(wbData);
      });
      
      //this.http.get(environment.API_GATEWAY + '/wb/' + this.company).subscribe(wbData => {
   }
   initworkbooks(workbooks: Workbook[]) {
      workbooks.forEach(element => {
         if (element.type == 1) {
            const params = "?username=" + element.account + "&target_site=" + element.site;
            this.http.get(environment.API_GATEWAY + '/auth/trusted' + params).subscribe(ticket => {
               const wbUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.TABLEAU_API + "/trusted/" + ticket + "/t/" + element.site + "/views/" + element.name);
               this.wbs.push(new Workbook(
                  element.name,
                  element.type,
                  element.title,
                  element.description,
                  element.site,
                  element.name,
                  element.date,
                  wbUrl, '', '', null));
            });
         } else if (element.type == 3) {
               this.wbs.push(new Workbook(
                  element.name,
                  element.type,
                  element.title,
                  element.description,
                  element.site,
                  element.name,
                  element.date,
                  null, '', '', element.content));
         } else { //spotfire
            this.wbsspot.push(new Workbook(
               "spot-" + i.toString(),
               element.type,
               element.title,
               element.description,
               element.site,
               element.name,
               element.date,
               null, '', element.analysis, ''));
            i++;
         }
      });
      i = 1;
      lloadspot = this.loadspot;
      lwbsspot = this.wbsspot;
      this.observer = new MutationObserver(mutations => {
         mutations.forEach(function (mutation) {
            if (mutation.addedNodes[0].childNodes) {
               const id = (mutation.addedNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0] as HTMLElement).id;
               const wb = lwbsspot.find(el => el.id == id);
               if (id == "spot-1")
                  lloadspot(wb.analysis, wb.name);
            }
         });
      });
      const config = { attributes: true, childList: true, characterData: true };
      this.observer.observe(this.spotcont.nativeElement, config);
   }

   constructor(private pageTitleService: PageTitleService,
      public translate: TranslateService,
      private router: Router,
      private sanitizer: DomSanitizer,
      private http: HttpClient,
      private session: ASession) {
         i = 1;
         this.config = {
            editable: false,
            showToolbar: false,
            translate: 'no'
          };
   }

   ngOnInit() {
      this.translate.get('Dashboard').subscribe((res: string) => {
         this.pageTitleService.setTitle(res);
      });
      this.getDashboardData();
   }

}