import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LocalResourceComponent } from '../list/local-resource.component';
import { LocalResourceDetailComponent } from '../detail/local-resource-detail.component';
import { LocalResourceUpdateComponent } from '../update/local-resource-update.component';
import { LocalResourceRoutingResolveService } from './local-resource-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const localResourceRoute: Routes = [
  {
    path: '',
    component: LocalResourceComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LocalResourceDetailComponent,
    resolve: {
      localResource: LocalResourceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LocalResourceUpdateComponent,
    resolve: {
      localResource: LocalResourceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LocalResourceUpdateComponent,
    resolve: {
      localResource: LocalResourceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(localResourceRoute)],
  exports: [RouterModule],
})
export class LocalResourceRoutingModule {}
