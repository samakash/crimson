import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MeditationComponent } from '../list/meditation.component';
import { MeditationDetailComponent } from '../detail/meditation-detail.component';
import { MeditationUpdateComponent } from '../update/meditation-update.component';
import { MeditationRoutingResolveService } from './meditation-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const meditationRoute: Routes = [
  {
    path: '',
    component: MeditationComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MeditationDetailComponent,
    resolve: {
      meditation: MeditationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MeditationUpdateComponent,
    resolve: {
      meditation: MeditationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MeditationUpdateComponent,
    resolve: {
      meditation: MeditationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(meditationRoute)],
  exports: [RouterModule],
})
export class MeditationRoutingModule {}
