import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MeditationSessionComponent } from './list/meditation-session.component';
import { MeditationSessionDetailComponent } from './detail/meditation-session-detail.component';
import { MeditationSessionUpdateComponent } from './update/meditation-session-update.component';
import { MeditationSessionDeleteDialogComponent } from './delete/meditation-session-delete-dialog.component';
import { MeditationSessionRoutingModule } from './route/meditation-session-routing.module';

@NgModule({
  imports: [SharedModule, MeditationSessionRoutingModule],
  declarations: [
    MeditationSessionComponent,
    MeditationSessionDetailComponent,
    MeditationSessionUpdateComponent,
    MeditationSessionDeleteDialogComponent,
  ],
})
export class MeditationSessionModule {}
