import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ReferalComponent } from './list/referal.component';
import { ReferalDetailComponent } from './detail/referal-detail.component';
import { ReferalUpdateComponent } from './update/referal-update.component';
import { ReferalDeleteDialogComponent } from './delete/referal-delete-dialog.component';
import { ReferalRoutingModule } from './route/referal-routing.module';

@NgModule({
  imports: [SharedModule, ReferalRoutingModule],
  declarations: [ReferalComponent, ReferalDetailComponent, ReferalUpdateComponent, ReferalDeleteDialogComponent],
})
export class ReferalModule {}
