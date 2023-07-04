import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MeditationSessionComponent } from '../list/meditation-session.component';
import { MeditationSessionDetailComponent } from '../detail/meditation-session-detail.component';
import { MeditationSessionUpdateComponent } from '../update/meditation-session-update.component';
import { MeditationSessionRoutingResolveService } from './meditation-session-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const meditationSessionRoute: Routes = [
  {
    path: '',
    component: MeditationSessionComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MeditationSessionDetailComponent,
    resolve: {
      meditationSession: MeditationSessionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MeditationSessionUpdateComponent,
    resolve: {
      meditationSession: MeditationSessionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MeditationSessionUpdateComponent,
    resolve: {
      meditationSession: MeditationSessionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(meditationSessionRoute)],
  exports: [RouterModule],
})
export class MeditationSessionRoutingModule {}
