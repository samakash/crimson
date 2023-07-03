import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILocalResource } from '../local-resource.model';
import { LocalResourceService } from '../service/local-resource.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './local-resource-delete-dialog.component.html',
})
export class LocalResourceDeleteDialogComponent {
  localResource?: ILocalResource;

  constructor(protected localResourceService: LocalResourceService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.localResourceService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
