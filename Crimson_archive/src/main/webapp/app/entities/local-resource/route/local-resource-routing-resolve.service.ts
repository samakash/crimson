import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILocalResource } from '../local-resource.model';
import { LocalResourceService } from '../service/local-resource.service';

@Injectable({ providedIn: 'root' })
export class LocalResourceRoutingResolveService implements Resolve<ILocalResource | null> {
  constructor(protected service: LocalResourceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILocalResource | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((localResource: HttpResponse<ILocalResource>) => {
          if (localResource.body) {
            return of(localResource.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
