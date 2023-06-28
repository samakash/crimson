import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { MeditationFormService, MeditationFormGroup } from './meditation-form.service';
import { IMeditation } from '../meditation.model';
import { MeditationService } from '../service/meditation.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IMood } from 'app/entities/mood/mood.model';
import { MoodService } from 'app/entities/mood/service/mood.service';

@Component({
  selector: 'jhi-meditation-update',
  templateUrl: './meditation-update.component.html',
})
export class MeditationUpdateComponent implements OnInit {
  isSaving = false;
  meditation: IMeditation | null = null;

  moodsSharedCollection: IMood[] = [];

  editForm: MeditationFormGroup = this.meditationFormService.createMeditationFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected meditationService: MeditationService,
    protected meditationFormService: MeditationFormService,
    protected moodService: MoodService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareMood = (o1: IMood | null, o2: IMood | null): boolean => this.moodService.compareMood(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ meditation }) => {
      this.meditation = meditation;
      if (meditation) {
        this.updateForm(meditation);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('crimsonApp.error', { message: err.message })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const meditation = this.meditationFormService.getMeditation(this.editForm);
    if (meditation.id !== null) {
      this.subscribeToSaveResponse(this.meditationService.update(meditation));
    } else {
      this.subscribeToSaveResponse(this.meditationService.create(meditation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMeditation>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(meditation: IMeditation): void {
    this.meditation = meditation;
    this.meditationFormService.resetForm(this.editForm, meditation);

    this.moodsSharedCollection = this.moodService.addMoodToCollectionIfMissing<IMood>(this.moodsSharedCollection, meditation.mood);
  }

  protected loadRelationshipsOptions(): void {
    this.moodService
      .query()
      .pipe(map((res: HttpResponse<IMood[]>) => res.body ?? []))
      .pipe(map((moods: IMood[]) => this.moodService.addMoodToCollectionIfMissing<IMood>(moods, this.meditation?.mood)))
      .subscribe((moods: IMood[]) => (this.moodsSharedCollection = moods));
  }
}
