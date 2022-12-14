import { Routes } from '@angular/router';
import { ListComponent } from './list/libraries-manage-list.component';
import { AddComponent } from './add/add-component';

export const LibrariesRoutes: Routes = [
   {
      path: '',
      redirectTo: 'list',
      pathMatch: 'full',
   },
   {
      path: '',
      children: [
         {
            path: 'list',
            component: ListComponent
         },
         {
           path: 'add',
           component: AddComponent
         },
        {
          path: 'edit/:id',
          component: AddComponent
        }
      ]
   }
];
