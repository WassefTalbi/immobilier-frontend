import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component
import { LayoutComponent } from './layouts/layout.component';
import { AuthlayoutComponent } from './authlayout/authlayout.component';
import { AuthGuard } from './core/guards/auth.guard';
import {AdminGuard} from "./core/guards/admin.guard";

import {LayoutComponentUser} from "./layout-user/layout.component";
import { TechnicieneGuard } from './core/guards/technicien.guard';
import { VerificateurGuard } from './core/guards/verificateur.guard';
import { RedacteurGuard } from './core/guards/redacteur.guard';


const routes: Routes = [
  { path: '', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [AdminGuard] },


 // { path: 'Agence', component: LayoutComponentUser, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [AgenceGuard]  },
  { path: 'auth', component: AuthlayoutComponent, loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
  { path: 'pages',component: AuthlayoutComponent, loadChildren: () => import('./extraspages/extraspages.module').then(m => m.ExtraspagesModule)/*,canActivate: [userGuard]*/},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
