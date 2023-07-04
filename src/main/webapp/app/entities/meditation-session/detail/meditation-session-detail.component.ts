import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMeditationSession } from '../meditation-session.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-meditation-session-detail',
  templateUrl: './meditation-session-detail.component.html',
})
export class MeditationSessionDetailComponent implements OnInit {
  meditationSession: IMeditationSession | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ meditationSession }) => {
      this.meditationSession = meditationSession;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
