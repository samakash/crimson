import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { MoodFormService, MoodFormGroup } from './mood-form.service';
import { IMood } from '../mood.model';
import { MoodService } from '../service/mood.service';
import { IMeditation } from 'app/entities/meditation/meditation.model';
import { MeditationService } from 'app/entities/meditation/service/meditation.service';

@Component({
  selector: 'jhi-mood-update',
  templateUrl: './mood-update.component.html',
})
export class MoodUpdateComponent implements OnInit {
  isSaving = false;
  mood: IMood | null = null;

  meditationsSharedCollection: IMeditation[] = [];

  editForm: MoodFormGroup = this.moodFormService.createMoodFormGroup();

  constructor(
    protected moodService: MoodService,
    protected moodFormService: MoodFormService,
    protected meditationService: MeditationService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareMeditation = (o1: IMeditation | null, o2: IMeditation | null): boolean => this.meditationService.compareMeditation(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mood }) => {
      this.mood = mood;
      if (mood) {
        this.updateForm(mood);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const mood = this.moodFormService.getMood(this.editForm);
    if (mood.id !== null) {
      this.subscribeToSaveResponse(this.moodService.update(mood));
    } else {
      this.subscribeToSaveResponse(this.moodService.create(mood));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMood>>): void {
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

  protected updateForm(mood: IMood): void {
    this.mood = mood;
    this.moodFormService.resetForm(this.editForm, mood);

    this.meditationsSharedCollection = this.meditationService.addMeditationToCollectionIfMissing<IMeditation>(
      this.meditationsSharedCollection,
      mood.meditation
    );
  }

  protected loadRelationshipsOptions(): void {
    this.meditationService
      .query()
      .pipe(map((res: HttpResponse<IMeditation[]>) => res.body ?? []))
      .pipe(
        map((meditations: IMeditation[]) =>
          this.meditationService.addMeditationToCollectionIfMissing<IMeditation>(meditations, this.mood?.meditation)
        )
      )
      .subscribe((meditations: IMeditation[]) => (this.meditationsSharedCollection = meditations));
  }
}
