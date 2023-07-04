import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ReferalComponent } from '../list/referal.component';
import { ReferalDetailComponent } from '../detail/referal-detail.component';
import { ReferalUpdateComponent } from '../update/referal-update.component';
import { ReferalRoutingResolveService } from './referal-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const referalRoute: Routes = [
  {
    path: '',
    component: ReferalComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ReferalDetailComponent,
    resolve: {
      referal: ReferalRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ReferalUpdateComponent,
    resolve: {
      referal: ReferalRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ReferalUpdateComponent,
    resolve: {
      referal: ReferalRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(referalRoute)],
  exports: [RouterModule],
})
export class ReferalRoutingModule {}
