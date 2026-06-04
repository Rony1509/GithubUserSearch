import { Routes } from '@angular/router';
import { UserSearchComponent } from './components/user-search/user-search.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: UserSearchComponent
  },
  {
    path: 'user/:username',
    component: UserDetailComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
