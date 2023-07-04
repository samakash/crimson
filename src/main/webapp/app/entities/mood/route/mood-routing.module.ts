import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MoodComponent } from '../list/mood.component';
import { MoodDetailComponent } from '../detail/mood-detail.component';
import { MoodUpdateComponent } from '../update/mood-update.component';
import { MoodRoutingResolveService } from './mood-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const moodRoute: Routes = [
  {
    path: '',
    component: MoodComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MoodDetailComponent,
    resolve: {
      mood: MoodRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MoodUpdateComponent,
    resolve: {
      mood: MoodRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MoodUpdateComponent,
    resolve: {
      mood: MoodRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(moodRoute)],
  exports: [RouterModule],
})
export class MoodRoutingModule {}
