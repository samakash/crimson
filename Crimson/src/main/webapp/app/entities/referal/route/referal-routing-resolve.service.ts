import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IReferal } from '../referal.model';
import { ReferalService } from '../service/referal.service';

@Injectable({ providedIn: 'root' })
export class ReferalRoutingResolveService implements Resolve<IReferal | null> {
  constructor(protected service: ReferalService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IReferal | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((referal: HttpResponse<IReferal>) => {
          if (referal.body) {
            return of(referal.body);
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
