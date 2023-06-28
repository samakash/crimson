import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { LocalResourceFormService, LocalResourceFormGroup } from './local-resource-form.service';
import { ILocalResource } from '../local-resource.model';
import { LocalResourceService } from '../service/local-resource.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-local-resource-update',
  templateUrl: './local-resource-update.component.html',
})
export class LocalResourceUpdateComponent implements OnInit {
  isSaving = false;
  localResource: ILocalResource | null = null;

  editForm: LocalResourceFormGroup = this.localResourceFormService.createLocalResourceFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected localResourceService: LocalResourceService,
    protected localResourceFormService: LocalResourceFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ localResource }) => {
      this.localResource = localResource;
      if (localResource) {
        this.updateForm(localResource);
      }
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
    const localResource = this.localResourceFormService.getLocalResource(this.editForm);
    if (localResource.id !== null) {
      this.subscribeToSaveResponse(this.localResourceService.update(localResource));
    } else {
      this.subscribeToSaveResponse(this.localResourceService.create(localResource));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILocalResource>>): void {
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

  protected updateForm(localResource: ILocalResource): void {
    this.localResource = localResource;
    this.localResourceFormService.resetForm(this.editForm, localResource);
  }
}
