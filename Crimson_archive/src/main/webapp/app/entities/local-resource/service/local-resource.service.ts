import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILocalResource, NewLocalResource } from '../local-resource.model';

export type PartialUpdateLocalResource = Partial<ILocalResource> & Pick<ILocalResource, 'id'>;

export type EntityResponseType = HttpResponse<ILocalResource>;
export type EntityArrayResponseType = HttpResponse<ILocalResource[]>;

@Injectable({ providedIn: 'root' })
export class LocalResourceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/local-resources');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(localResource: NewLocalResource): Observable<EntityResponseType> {
    return this.http.post<ILocalResource>(this.resourceUrl, localResource, { observe: 'response' });
  }

  update(localResource: ILocalResource): Observable<EntityResponseType> {
    return this.http.put<ILocalResource>(`${this.resourceUrl}/${this.getLocalResourceIdentifier(localResource)}`, localResource, {
      observe: 'response',
    });
  }

  partialUpdate(localResource: PartialUpdateLocalResource): Observable<EntityResponseType> {
    return this.http.patch<ILocalResource>(`${this.resourceUrl}/${this.getLocalResourceIdentifier(localResource)}`, localResource, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILocalResource>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILocalResource[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLocalResourceIdentifier(localResource: Pick<ILocalResource, 'id'>): number {
    return localResource.id;
  }

  compareLocalResource(o1: Pick<ILocalResource, 'id'> | null, o2: Pick<ILocalResource, 'id'> | null): boolean {
    return o1 && o2 ? this.getLocalResourceIdentifier(o1) === this.getLocalResourceIdentifier(o2) : o1 === o2;
  }

  addLocalResourceToCollectionIfMissing<Type extends Pick<ILocalResource, 'id'>>(
    localResourceCollection: Type[],
    ...localResourcesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const localResources: Type[] = localResourcesToCheck.filter(isPresent);
    if (localResources.length > 0) {
      const localResourceCollectionIdentifiers = localResourceCollection.map(
        localResourceItem => this.getLocalResourceIdentifier(localResourceItem)!
      );
      const localResourcesToAdd = localResources.filter(localResourceItem => {
        const localResourceIdentifier = this.getLocalResourceIdentifier(localResourceItem);
        if (localResourceCollectionIdentifiers.includes(localResourceIdentifier)) {
          return false;
        }
        localResourceCollectionIdentifiers.push(localResourceIdentifier);
        return true;
      });
      return [...localResourcesToAdd, ...localResourceCollection];
    }
    return localResourceCollection;
  }
}
