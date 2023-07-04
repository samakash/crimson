import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../mood.test-samples';

import { MoodFormService } from './mood-form.service';

describe('Mood Form Service', () => {
  let service: MoodFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoodFormService);
  });

  describe('Service methods', () => {
    describe('createMoodFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMoodFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          })
        );
      });

      it('passing IMood should create a new form with FormGroup', () => {
        const formGroup = service.createMoodFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          })
        );
      });
    });

    describe('getMood', () => {
      it('should return NewMood for default Mood initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMoodFormGroup(sampleWithNewData);

        const mood = service.getMood(formGroup) as any;

        expect(mood).toMatchObject(sampleWithNewData);
      });

      it('should return NewMood for empty Mood initial value', () => {
        const formGroup = service.createMoodFormGroup();

        const mood = service.getMood(formGroup) as any;

        expect(mood).toMatchObject({});
      });

      it('should return IMood', () => {
        const formGroup = service.createMoodFormGroup(sampleWithRequiredData);

        const mood = service.getMood(formGroup) as any;

        expect(mood).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMood should not enable id FormControl', () => {
        const formGroup = service.createMoodFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMood should disable id FormControl', () => {
        const formGroup = service.createMoodFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
