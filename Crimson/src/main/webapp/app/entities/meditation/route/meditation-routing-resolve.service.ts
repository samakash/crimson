import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMeditation } from '../meditation.model';
import { MeditationService } from '../service/meditation.service';

@Injectable({ providedIn: 'root' })
export class MeditationRoutingResolveService implements Resolve<IMeditation | null> {
  constructor(protected service: MeditationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMeditation | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((meditation: HttpResponse<IMeditation>) => {
          if (meditation.body) {
            return of(meditation.body);
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
