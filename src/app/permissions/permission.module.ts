import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { PermissionRoutes } from './permission.routing';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { PermListComponent } from './list/list-component';

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      NgxDatatableModule,
      AngularEditorModule,
      RouterModule.forChild(PermissionRoutes),
      TranslateModule
   ],
   declarations: [
      PermListComponent
   ]
})

export class PermModule {}
