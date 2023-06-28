import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMood, NewMood } from '../mood.model';

export type PartialUpdateMood = Partial<IMood> & Pick<IMood, 'id'>;

export type EntityResponseType = HttpResponse<IMood>;
export type EntityArrayResponseType = HttpResponse<IMood[]>;

@Injectable({ providedIn: 'root' })
export class MoodService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/moods');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(mood: NewMood): Observable<EntityResponseType> {
    return this.http.post<IMood>(this.resourceUrl, mood, { observe: 'response' });
  }

  update(mood: IMood): Observable<EntityResponseType> {
    return this.http.put<IMood>(`${this.resourceUrl}/${this.getMoodIdentifier(mood)}`, mood, { observe: 'response' });
  }

  partialUpdate(mood: PartialUpdateMood): Observable<EntityResponseType> {
    return this.http.patch<IMood>(`${this.resourceUrl}/${this.getMoodIdentifier(mood)}`, mood, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMood>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMood[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMoodIdentifier(mood: Pick<IMood, 'id'>): number {
    return mood.id;
  }

  compareMood(o1: Pick<IMood, 'id'> | null, o2: Pick<IMood, 'id'> | null): boolean {
    return o1 && o2 ? this.getMoodIdentifier(o1) === this.getMoodIdentifier(o2) : o1 === o2;
  }

  addMoodToCollectionIfMissing<Type extends Pick<IMood, 'id'>>(
    moodCollection: Type[],
    ...moodsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const moods: Type[] = moodsToCheck.filter(isPresent);
    if (moods.length > 0) {
      const moodCollectionIdentifiers = moodCollection.map(moodItem => this.getMoodIdentifier(moodItem)!);
      const moodsToAdd = moods.filter(moodItem => {
        const moodIdentifier = this.getMoodIdentifier(moodItem);
        if (moodCollectionIdentifiers.includes(moodIdentifier)) {
          return false;
        }
        moodCollectionIdentifiers.push(moodIdentifier);
        return true;
      });
      return [...moodsToAdd, ...moodCollection];
    }
    return moodCollection;
  }
}
