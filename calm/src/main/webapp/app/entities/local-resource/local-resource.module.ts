import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LocalResourceComponent } from './list/local-resource.component';
import { LocalResourceDetailComponent } from './detail/local-resource-detail.component';
import { LocalResourceUpdateComponent } from './update/local-resource-update.component';
import { LocalResourceDeleteDialogComponent } from './delete/local-resource-delete-dialog.component';
import { LocalResourceRoutingModule } from './route/local-resource-routing.module';

@NgModule({
  imports: [SharedModule, LocalResourceRoutingModule],
  declarations: [LocalResourceComponent, LocalResourceDetailComponent, LocalResourceUpdateComponent, LocalResourceDeleteDialogComponent],
})
export class LocalResourceModule {}
