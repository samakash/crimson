import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILocalResource } from '../local-resource.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-local-resource-detail',
  templateUrl: './local-resource-detail.component.html',
})
export class LocalResourceDetailComponent implements OnInit {
  localResource: ILocalResource | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ localResource }) => {
      this.localResource = localResource;
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
