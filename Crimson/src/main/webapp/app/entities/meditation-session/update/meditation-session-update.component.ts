import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { MeditationSessionFormService, MeditationSessionFormGroup } from './meditation-session-form.service';
import { IMeditationSession } from '../meditation-session.model';
import { MeditationSessionService } from '../service/meditation-session.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IMood } from 'app/entities/mood/mood.model';
import { MoodService } from 'app/entities/mood/service/mood.service';

@Component({
  selector: 'jhi-meditation-session-update',
  templateUrl: './meditation-session-update.component.html',
})
export class MeditationSessionUpdateComponent implements OnInit {
  isSaving = false;
  meditationSession: IMeditationSession | null = null;

  usersSharedCollection: IUser[] = [];
  moodsSharedCollection: IMood[] = [];

  editForm: MeditationSessionFormGroup = this.meditationSessionFormService.createMeditationSessionFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected meditationSessionService: MeditationSessionService,
    protected meditationSessionFormService: MeditationSessionFormService,
    protected userService: UserService,
    protected moodService: MoodService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareMood = (o1: IMood | null, o2: IMood | null): boolean => this.moodService.compareMood(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ meditationSession }) => {
      this.meditationSession = meditationSession;
      if (meditationSession) {
        this.updateForm(meditationSession);
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
    const meditationSession = this.meditationSessionFormService.getMeditationSession(this.editForm);
    if (meditationSession.id !== null) {
      this.subscribeToSaveResponse(this.meditationSessionService.update(meditationSession));
    } else {
      this.subscribeToSaveResponse(this.meditationSessionService.create(meditationSession));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMeditationSession>>): void {
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

  protected updateForm(meditationSession: IMeditationSession): void {
    this.meditationSession = meditationSession;
    this.meditationSessionFormService.resetForm(this.editForm, meditationSession);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, meditationSession.user);
    this.moodsSharedCollection = this.moodService.addMoodToCollectionIfMissing<IMood>(
      this.moodsSharedCollection,
      meditationSession.meditation
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.meditationSession?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.moodService
      .query()
      .pipe(map((res: HttpResponse<IMood[]>) => res.body ?? []))
      .pipe(map((moods: IMood[]) => this.moodService.addMoodToCollectionIfMissing<IMood>(moods, this.meditationSession?.meditation)))
      .subscribe((moods: IMood[]) => (this.moodsSharedCollection = moods));
  }
}
