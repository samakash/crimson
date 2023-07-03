import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MeditationComponent } from './list/meditation.component';
import { MeditationDetailComponent } from './detail/meditation-detail.component';
import { MeditationUpdateComponent } from './update/meditation-update.component';
import { MeditationDeleteDialogComponent } from './delete/meditation-delete-dialog.component';
import { MeditationRoutingModule } from './route/meditation-routing.module';

@NgModule({
  imports: [SharedModule, MeditationRoutingModule],
  declarations: [MeditationComponent, MeditationDetailComponent, MeditationUpdateComponent, MeditationDeleteDialogComponent],
})
export class MeditationModule {}
