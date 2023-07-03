import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IReferal } from '../referal.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../referal.test-samples';

import { ReferalService } from './referal.service';

const requireRestSample: IReferal = {
  ...sampleWithRequiredData,
};

describe('Referal Service', () => {
  let service: ReferalService;
  let httpMock: HttpTestingController;
  let expectedResult: IReferal | IReferal[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ReferalService);
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

    it('should create a Referal', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const referal = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(referal).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Referal', () => {
      const referal = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(referal).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Referal', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Referal', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Referal', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addReferalToCollectionIfMissing', () => {
      it('should add a Referal to an empty array', () => {
        const referal: IReferal = sampleWithRequiredData;
        expectedResult = service.addReferalToCollectionIfMissing([], referal);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(referal);
      });

      it('should not add a Referal to an array that contains it', () => {
        const referal: IReferal = sampleWithRequiredData;
        const referalCollection: IReferal[] = [
          {
            ...referal,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addReferalToCollectionIfMissing(referalCollection, referal);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Referal to an array that doesn't contain it", () => {
        const referal: IReferal = sampleWithRequiredData;
        const referalCollection: IReferal[] = [sampleWithPartialData];
        expectedResult = service.addReferalToCollectionIfMissing(referalCollection, referal);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(referal);
      });

      it('should add only unique Referal to an array', () => {
        const referalArray: IReferal[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const referalCollection: IReferal[] = [sampleWithRequiredData];
        expectedResult = service.addReferalToCollectionIfMissing(referalCollection, ...referalArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const referal: IReferal = sampleWithRequiredData;
        const referal2: IReferal = sampleWithPartialData;
        expectedResult = service.addReferalToCollectionIfMissing([], referal, referal2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(referal);
        expect(expectedResult).toContain(referal2);
      });

      it('should accept null and undefined values', () => {
        const referal: IReferal = sampleWithRequiredData;
        expectedResult = service.addReferalToCollectionIfMissing([], null, referal, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(referal);
      });

      it('should return initial array if no Referal is added', () => {
        const referalCollection: IReferal[] = [sampleWithRequiredData];
        expectedResult = service.addReferalToCollectionIfMissing(referalCollection, undefined, null);
        expect(expectedResult).toEqual(referalCollection);
      });
    });

    describe('compareReferal', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareReferal(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareReferal(entity1, entity2);
        const compareResult2 = service.compareReferal(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareReferal(entity1, entity2);
        const compareResult2 = service.compareReferal(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareReferal(entity1, entity2);
        const compareResult2 = service.compareReferal(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
