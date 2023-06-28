import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { MoodFormService, MoodFormGroup } from './mood-form.service';
import { IMood } from '../mood.model';
import { MoodService } from '../service/mood.service';

@Component({
  selector: 'jhi-mood-update',
  templateUrl: './mood-update.component.html',
})
export class MoodUpdateComponent implements OnInit {
  isSaving = false;
  mood: IMood | null = null;

  editForm: MoodFormGroup = this.moodFormService.createMoodFormGroup();

  constructor(protected moodService: MoodService, protected moodFormService: MoodFormService, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mood }) => {
      this.mood = mood;
      if (mood) {
        this.updateForm(mood);
      }
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
  }
}
