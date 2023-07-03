import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMeditationSession, NewMeditationSession } from '../meditation-session.model';

export type PartialUpdateMeditationSession = Partial<IMeditationSession> & Pick<IMeditationSession, 'id'>;

type RestOf<T extends IMeditationSession | NewMeditationSession> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestMeditationSession = RestOf<IMeditationSession>;

export type NewRestMeditationSession = RestOf<NewMeditationSession>;

export type PartialUpdateRestMeditationSession = RestOf<PartialUpdateMeditationSession>;

export type EntityResponseType = HttpResponse<IMeditationSession>;
export type EntityArrayResponseType = HttpResponse<IMeditationSession[]>;

@Injectable({ providedIn: 'root' })
export class MeditationSessionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/meditation-sessions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(meditationSession: NewMeditationSession): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(meditationSession);
    return this.http
      .post<RestMeditationSession>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(meditationSession: IMeditationSession): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(meditationSession);
    return this.http
      .put<RestMeditationSession>(`${this.resourceUrl}/${this.getMeditationSessionIdentifier(meditationSession)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(meditationSession: PartialUpdateMeditationSession): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(meditationSession);
    return this.http
      .patch<RestMeditationSession>(`${this.resourceUrl}/${this.getMeditationSessionIdentifier(meditationSession)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestMeditationSession>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestMeditationSession[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMeditationSessionIdentifier(meditationSession: Pick<IMeditationSession, 'id'>): number {
    return meditationSession.id;
  }

  compareMeditationSession(o1: Pick<IMeditationSession, 'id'> | null, o2: Pick<IMeditationSession, 'id'> | null): boolean {
    return o1 && o2 ? this.getMeditationSessionIdentifier(o1) === this.getMeditationSessionIdentifier(o2) : o1 === o2;
  }

  addMeditationSessionToCollectionIfMissing<Type extends Pick<IMeditationSession, 'id'>>(
    meditationSessionCollection: Type[],
    ...meditationSessionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const meditationSessions: Type[] = meditationSessionsToCheck.filter(isPresent);
    if (meditationSessions.length > 0) {
      const meditationSessionCollectionIdentifiers = meditationSessionCollection.map(
        meditationSessionItem => this.getMeditationSessionIdentifier(meditationSessionItem)!
      );
      const meditationSessionsToAdd = meditationSessions.filter(meditationSessionItem => {
        const meditationSessionIdentifier = this.getMeditationSessionIdentifier(meditationSessionItem);
        if (meditationSessionCollectionIdentifiers.includes(meditationSessionIdentifier)) {
          return false;
        }
        meditationSessionCollectionIdentifiers.push(meditationSessionIdentifier);
        return true;
      });
      return [...meditationSessionsToAdd, ...meditationSessionCollection];
    }
    return meditationSessionCollection;
  }

  protected convertDateFromClient<T extends IMeditationSession | NewMeditationSession | PartialUpdateMeditationSession>(
    meditationSession: T
  ): RestOf<T> {
    return {
      ...meditationSession,
      date: meditationSession.date?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restMeditationSession: RestMeditationSession): IMeditationSession {
    return {
      ...restMeditationSession,
      date: restMeditationSession.date ? dayjs(restMeditationSession.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestMeditationSession>): HttpResponse<IMeditationSession> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestMeditationSession[]>): HttpResponse<IMeditationSession[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
