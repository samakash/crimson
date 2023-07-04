import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMeditationSession } from '../meditation-session.model';
import { MeditationSessionService } from '../service/meditation-session.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './meditation-session-delete-dialog.component.html',
})
export class MeditationSessionDeleteDialogComponent {
  meditationSession?: IMeditationSession;

  constructor(protected meditationSessionService: MeditationSessionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.meditationSessionService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
