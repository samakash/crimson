import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILocalResource } from '../local-resource.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../local-resource.test-samples';

import { LocalResourceService } from './local-resource.service';

const requireRestSample: ILocalResource = {
  ...sampleWithRequiredData,
};

describe('LocalResource Service', () => {
  let service: LocalResourceService;
  let httpMock: HttpTestingController;
  let expectedResult: ILocalResource | ILocalResource[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LocalResourceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a LocalResource', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const localResource = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(localResource).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a LocalResource', () => {
      const localResource = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(localResource).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a LocalResource', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of LocalResource', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a LocalResource', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addLocalResourceToCollectionIfMissing', () => {
      it('should add a LocalResource to an empty array', () => {
        const localResource: ILocalResource = sampleWithRequiredData;
        expectedResult = service.addLocalResourceToCollectionIfMissing([], localResource);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(localResource);
      });

      it('should not add a LocalResource to an array that contains it', () => {
        const localResource: ILocalResource = sampleWithRequiredData;
        const localResourceCollection: ILocalResource[] = [
          {
            ...localResource,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLocalResourceToCollectionIfMissing(localResourceCollection, localResource);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a LocalResource to an array that doesn't contain it", () => {
        const localResource: ILocalResource = sampleWithRequiredData;
        const localResourceCollection: ILocalResource[] = [sampleWithPartialData];
        expectedResult = service.addLocalResourceToCollectionIfMissing(localResourceCollection, localResource);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(localResource);
      });

      it('should add only unique LocalResource to an array', () => {
        const localResourceArray: ILocalResource[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const localResourceCollection: ILocalResource[] = [sampleWithRequiredData];
        expectedResult = service.addLocalResourceToCollectionIfMissing(localResourceCollection, ...localResourceArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const localResource: ILocalResource = sampleWithRequiredData;
        const localResource2: ILocalResource = sampleWithPartialData;
        expectedResult = service.addLocalResourceToCollectionIfMissing([], localResource, localResource2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(localResource);
        expect(expectedResult).toContain(localResource2);
      });

      it('should accept null and undefined values', () => {
        const localResource: ILocalResource = sampleWithRequiredData;
        expectedResult = service.addLocalResourceToCollectionIfMissing([], null, localResource, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(localResource);
      });

      it('should return initial array if no LocalResource is added', () => {
        const localResourceCollection: ILocalResource[] = [sampleWithRequiredData];
        expectedResult = service.addLocalResourceToCollectionIfMissing(localResourceCollection, undefined, null);
        expect(expectedResult).toEqual(localResourceCollection);
      });
    });

    describe('compareLocalResource', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLocalResource(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareLocalResource(entity1, entity2);
        const compareResult2 = service.compareLocalResource(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareLocalResource(entity1, entity2);
        const compareResult2 = service.compareLocalResource(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareLocalResource(entity1, entity2);
        const compareResult2 = service.compareLocalResource(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
