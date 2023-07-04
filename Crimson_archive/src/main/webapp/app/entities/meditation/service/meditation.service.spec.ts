import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMeditation } from '../meditation.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../meditation.test-samples';

import { MeditationService } from './meditation.service';

const requireRestSample: IMeditation = {
  ...sampleWithRequiredData,
};

describe('Meditation Service', () => {
  let service: MeditationService;
  let httpMock: HttpTestingController;
  let expectedResult: IMeditation | IMeditation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MeditationService);
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

    it('should create a Meditation', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const meditation = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(meditation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Meditation', () => {
      const meditation = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(meditation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Meditation', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Meditation', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Meditation', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMeditationToCollectionIfMissing', () => {
      it('should add a Meditation to an empty array', () => {
        const meditation: IMeditation = sampleWithRequiredData;
        expectedResult = service.addMeditationToCollectionIfMissing([], meditation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(meditation);
      });

      it('should not add a Meditation to an array that contains it', () => {
        const meditation: IMeditation = sampleWithRequiredData;
        const meditationCollection: IMeditation[] = [
          {
            ...meditation,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMeditationToCollectionIfMissing(meditationCollection, meditation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Meditation to an array that doesn't contain it", () => {
        const meditation: IMeditation = sampleWithRequiredData;
        const meditationCollection: IMeditation[] = [sampleWithPartialData];
        expectedResult = service.addMeditationToCollectionIfMissing(meditationCollection, meditation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(meditation);
      });

      it('should add only unique Meditation to an array', () => {
        const meditationArray: IMeditation[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const meditationCollection: IMeditation[] = [sampleWithRequiredData];
        expectedResult = service.addMeditationToCollectionIfMissing(meditationCollection, ...meditationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const meditation: IMeditation = sampleWithRequiredData;
        const meditation2: IMeditation = sampleWithPartialData;
        expectedResult = service.addMeditationToCollectionIfMissing([], meditation, meditation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(meditation);
        expect(expectedResult).toContain(meditation2);
      });

      it('should accept null and undefined values', () => {
        const meditation: IMeditation = sampleWithRequiredData;
        expectedResult = service.addMeditationToCollectionIfMissing([], null, meditation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(meditation);
      });

      it('should return initial array if no Meditation is added', () => {
        const meditationCollection: IMeditation[] = [sampleWithRequiredData];
        expectedResult = service.addMeditationToCollectionIfMissing(meditationCollection, undefined, null);
        expect(expectedResult).toEqual(meditationCollection);
      });
    });

    describe('compareMeditation', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMeditation(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMeditation(entity1, entity2);
        const compareResult2 = service.compareMeditation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMeditation(entity1, entity2);
        const compareResult2 = service.compareMeditation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMeditation(entity1, entity2);
        const compareResult2 = service.compareMeditation(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
