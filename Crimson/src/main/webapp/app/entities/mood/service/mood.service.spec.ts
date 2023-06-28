import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMood } from '../mood.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../mood.test-samples';

import { MoodService } from './mood.service';

const requireRestSample: IMood = {
  ...sampleWithRequiredData,
};

describe('Mood Service', () => {
  let service: MoodService;
  let httpMock: HttpTestingController;
  let expectedResult: IMood | IMood[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MoodService);
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

    it('should create a Mood', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const mood = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(mood).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Mood', () => {
      const mood = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(mood).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Mood', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Mood', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Mood', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMoodToCollectionIfMissing', () => {
      it('should add a Mood to an empty array', () => {
        const mood: IMood = sampleWithRequiredData;
        expectedResult = service.addMoodToCollectionIfMissing([], mood);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mood);
      });

      it('should not add a Mood to an array that contains it', () => {
        const mood: IMood = sampleWithRequiredData;
        const moodCollection: IMood[] = [
          {
            ...mood,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMoodToCollectionIfMissing(moodCollection, mood);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Mood to an array that doesn't contain it", () => {
        const mood: IMood = sampleWithRequiredData;
        const moodCollection: IMood[] = [sampleWithPartialData];
        expectedResult = service.addMoodToCollectionIfMissing(moodCollection, mood);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mood);
      });

      it('should add only unique Mood to an array', () => {
        const moodArray: IMood[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const moodCollection: IMood[] = [sampleWithRequiredData];
        expectedResult = service.addMoodToCollectionIfMissing(moodCollection, ...moodArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const mood: IMood = sampleWithRequiredData;
        const mood2: IMood = sampleWithPartialData;
        expectedResult = service.addMoodToCollectionIfMissing([], mood, mood2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mood);
        expect(expectedResult).toContain(mood2);
      });

      it('should accept null and undefined values', () => {
        const mood: IMood = sampleWithRequiredData;
        expectedResult = service.addMoodToCollectionIfMissing([], null, mood, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mood);
      });

      it('should return initial array if no Mood is added', () => {
        const moodCollection: IMood[] = [sampleWithRequiredData];
        expectedResult = service.addMoodToCollectionIfMissing(moodCollection, undefined, null);
        expect(expectedResult).toEqual(moodCollection);
      });
    });

    describe('compareMood', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMood(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMood(entity1, entity2);
        const compareResult2 = service.compareMood(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMood(entity1, entity2);
        const compareResult2 = service.compareMood(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMood(entity1, entity2);
        const compareResult2 = service.compareMood(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
