import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMeditationSession } from '../meditation-session.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../meditation-session.test-samples';

import { MeditationSessionService, RestMeditationSession } from './meditation-session.service';

const requireRestSample: RestMeditationSession = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.toJSON(),
};

describe('MeditationSession Service', () => {
  let service: MeditationSessionService;
  let httpMock: HttpTestingController;
  let expectedResult: IMeditationSession | IMeditationSession[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MeditationSessionService);
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

    it('should create a MeditationSession', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const meditationSession = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(meditationSession).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a MeditationSession', () => {
      const meditationSession = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(meditationSession).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a MeditationSession', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of MeditationSession', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a MeditationSession', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMeditationSessionToCollectionIfMissing', () => {
      it('should add a MeditationSession to an empty array', () => {
        const meditationSession: IMeditationSession = sampleWithRequiredData;
        expectedResult = service.addMeditationSessionToCollectionIfMissing([], meditationSession);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(meditationSession);
      });

      it('should not add a MeditationSession to an array that contains it', () => {
        const meditationSession: IMeditationSession = sampleWithRequiredData;
        const meditationSessionCollection: IMeditationSession[] = [
          {
            ...meditationSession,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMeditationSessionToCollectionIfMissing(meditationSessionCollection, meditationSession);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a MeditationSession to an array that doesn't contain it", () => {
        const meditationSession: IMeditationSession = sampleWithRequiredData;
        const meditationSessionCollection: IMeditationSession[] = [sampleWithPartialData];
        expectedResult = service.addMeditationSessionToCollectionIfMissing(meditationSessionCollection, meditationSession);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(meditationSession);
      });

      it('should add only unique MeditationSession to an array', () => {
        const meditationSessionArray: IMeditationSession[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const meditationSessionCollection: IMeditationSession[] = [sampleWithRequiredData];
        expectedResult = service.addMeditationSessionToCollectionIfMissing(meditationSessionCollection, ...meditationSessionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const meditationSession: IMeditationSession = sampleWithRequiredData;
        const meditationSession2: IMeditationSession = sampleWithPartialData;
        expectedResult = service.addMeditationSessionToCollectionIfMissing([], meditationSession, meditationSession2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(meditationSession);
        expect(expectedResult).toContain(meditationSession2);
      });

      it('should accept null and undefined values', () => {
        const meditationSession: IMeditationSession = sampleWithRequiredData;
        expectedResult = service.addMeditationSessionToCollectionIfMissing([], null, meditationSession, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(meditationSession);
      });

      it('should return initial array if no MeditationSession is added', () => {
        const meditationSessionCollection: IMeditationSession[] = [sampleWithRequiredData];
        expectedResult = service.addMeditationSessionToCollectionIfMissing(meditationSessionCollection, undefined, null);
        expect(expectedResult).toEqual(meditationSessionCollection);
      });
    });

    describe('compareMeditationSession', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMeditationSession(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMeditationSession(entity1, entity2);
        const compareResult2 = service.compareMeditationSession(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMeditationSession(entity1, entity2);
        const compareResult2 = service.compareMeditationSession(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMeditationSession(entity1, entity2);
        const compareResult2 = service.compareMeditationSession(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
