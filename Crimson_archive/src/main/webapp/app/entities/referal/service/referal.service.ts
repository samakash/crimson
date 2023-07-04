import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IReferal, NewReferal } from '../referal.model';

export type PartialUpdateReferal = Partial<IReferal> & Pick<IReferal, 'id'>;

export type EntityResponseType = HttpResponse<IReferal>;
export type EntityArrayResponseType = HttpResponse<IReferal[]>;

@Injectable({ providedIn: 'root' })
export class ReferalService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/referals');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(referal: NewReferal): Observable<EntityResponseType> {
    return this.http.post<IReferal>(this.resourceUrl, referal, { observe: 'response' });
  }

  update(referal: IReferal): Observable<EntityResponseType> {
    return this.http.put<IReferal>(`${this.resourceUrl}/${this.getReferalIdentifier(referal)}`, referal, { observe: 'response' });
  }

  partialUpdate(referal: PartialUpdateReferal): Observable<EntityResponseType> {
    return this.http.patch<IReferal>(`${this.resourceUrl}/${this.getReferalIdentifier(referal)}`, referal, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IReferal>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IReferal[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getReferalIdentifier(referal: Pick<IReferal, 'id'>): number {
    return referal.id;
  }

  compareReferal(o1: Pick<IReferal, 'id'> | null, o2: Pick<IReferal, 'id'> | null): boolean {
    return o1 && o2 ? this.getReferalIdentifier(o1) === this.getReferalIdentifier(o2) : o1 === o2;
  }

  addReferalToCollectionIfMissing<Type extends Pick<IReferal, 'id'>>(
    referalCollection: Type[],
    ...referalsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const referals: Type[] = referalsToCheck.filter(isPresent);
    if (referals.length > 0) {
      const referalCollectionIdentifiers = referalCollection.map(referalItem => this.getReferalIdentifier(referalItem)!);
      const referalsToAdd = referals.filter(referalItem => {
        const referalIdentifier = this.getReferalIdentifier(referalItem);
        if (referalCollectionIdentifiers.includes(referalIdentifier)) {
          return false;
        }
        referalCollectionIdentifiers.push(referalIdentifier);
        return true;
      });
      return [...referalsToAdd, ...referalCollection];
    }
    return referalCollection;
  }
}
