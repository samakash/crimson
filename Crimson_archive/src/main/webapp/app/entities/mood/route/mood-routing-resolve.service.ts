import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMood } from '../mood.model';
import { MoodService } from '../service/mood.service';

@Injectable({ providedIn: 'root' })
export class MoodRoutingResolveService implements Resolve<IMood | null> {
  constructor(protected service: MoodService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMood | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((mood: HttpResponse<IMood>) => {
          if (mood.body) {
            return of(mood.body);
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
