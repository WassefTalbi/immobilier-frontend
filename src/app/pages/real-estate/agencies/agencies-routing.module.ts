import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component
import { ListComponent } from './list/list.component';
import { OverviewComponent } from './overview/overview.component';
import { OwnerComponent } from './owner/owner.component';

const routes: Routes = [
  {
    path: 'list',
    component: ListComponent
  },
  {
    path: 'overview/:id',
    component: OverviewComponent
  },
  {
    path: 'owner',
    component: OwnerComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgenciesRoutingModule { }
