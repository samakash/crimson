import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMeditation, NewMeditation } from '../meditation.model';

export type PartialUpdateMeditation = Partial<IMeditation> & Pick<IMeditation, 'id'>;

export type EntityResponseType = HttpResponse<IMeditation>;
export type EntityArrayResponseType = HttpResponse<IMeditation[]>;

@Injectable({ providedIn: 'root' })
export class MeditationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/meditations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(meditation: NewMeditation): Observable<EntityResponseType> {
    return this.http.post<IMeditation>(this.resourceUrl, meditation, { observe: 'response' });
  }

  update(meditation: IMeditation): Observable<EntityResponseType> {
    return this.http.put<IMeditation>(`${this.resourceUrl}/${this.getMeditationIdentifier(meditation)}`, meditation, {
      observe: 'response',
    });
  }

  partialUpdate(meditation: PartialUpdateMeditation): Observable<EntityResponseType> {
    return this.http.patch<IMeditation>(`${this.resourceUrl}/${this.getMeditationIdentifier(meditation)}`, meditation, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMeditation>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMeditation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMeditationIdentifier(meditation: Pick<IMeditation, 'id'>): number {
    return meditation.id;
  }

  compareMeditation(o1: Pick<IMeditation, 'id'> | null, o2: Pick<IMeditation, 'id'> | null): boolean {
    return o1 && o2 ? this.getMeditationIdentifier(o1) === this.getMeditationIdentifier(o2) : o1 === o2;
  }

  addMeditationToCollectionIfMissing<Type extends Pick<IMeditation, 'id'>>(
    meditationCollection: Type[],
    ...meditationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const meditations: Type[] = meditationsToCheck.filter(isPresent);
    if (meditations.length > 0) {
      const meditationCollectionIdentifiers = meditationCollection.map(meditationItem => this.getMeditationIdentifier(meditationItem)!);
      const meditationsToAdd = meditations.filter(meditationItem => {
        const meditationIdentifier = this.getMeditationIdentifier(meditationItem);
        if (meditationCollectionIdentifiers.includes(meditationIdentifier)) {
          return false;
        }
        meditationCollectionIdentifiers.push(meditationIdentifier);
        return true;
      });
      return [...meditationsToAdd, ...meditationCollection];
    }
    return meditationCollection;
  }
}
