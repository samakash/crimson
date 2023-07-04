import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ReferalFormService, ReferalFormGroup } from './referal-form.service';
import { IReferal } from '../referal.model';
import { ReferalService } from '../service/referal.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-referal-update',
  templateUrl: './referal-update.component.html',
})
export class ReferalUpdateComponent implements OnInit {
  isSaving = false;
  referal: IReferal | null = null;

  usersSharedCollection: IUser[] = [];

  editForm: ReferalFormGroup = this.referalFormService.createReferalFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected referalService: ReferalService,
    protected referalFormService: ReferalFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ referal }) => {
      this.referal = referal;
      if (referal) {
        this.updateForm(referal);
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
    const referal = this.referalFormService.getReferal(this.editForm);
    if (referal.id !== null) {
      this.subscribeToSaveResponse(this.referalService.update(referal));
    } else {
      this.subscribeToSaveResponse(this.referalService.create(referal));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReferal>>): void {
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

  protected updateForm(referal: IReferal): void {
    this.referal = referal;
    this.referalFormService.resetForm(this.editForm, referal);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, referal.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.referal?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
