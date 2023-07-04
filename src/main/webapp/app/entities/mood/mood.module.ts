import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MoodComponent } from './list/mood.component';
import { MoodDetailComponent } from './detail/mood-detail.component';
import { MoodUpdateComponent } from './update/mood-update.component';
import { MoodDeleteDialogComponent } from './delete/mood-delete-dialog.component';
import { MoodRoutingModule } from './route/mood-routing.module';

@NgModule({
  imports: [SharedModule, MoodRoutingModule],
  declarations: [MoodComponent, MoodDetailComponent, MoodUpdateComponent, MoodDeleteDialogComponent],
})
export class MoodModule {}
