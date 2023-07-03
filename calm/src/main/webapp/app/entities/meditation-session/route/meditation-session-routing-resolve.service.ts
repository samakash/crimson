import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMeditationSession } from '../meditation-session.model';
import { MeditationSessionService } from '../service/meditation-session.service';

@Injectable({ providedIn: 'root' })
export class MeditationSessionRoutingResolveService implements Resolve<IMeditationSession | null> {
  constructor(protected service: MeditationSessionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMeditationSession | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((meditationSession: HttpResponse<IMeditationSession>) => {
          if (meditationSession.body) {
            return of(meditationSession.body);
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
