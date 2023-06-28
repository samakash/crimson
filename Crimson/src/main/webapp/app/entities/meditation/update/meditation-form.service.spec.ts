import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../meditation.test-samples';

import { MeditationFormService } from './meditation-form.service';

describe('Meditation Form Service', () => {
  let service: MeditationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeditationFormService);
  });

  describe('Service methods', () => {
    describe('createMeditationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMeditationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            content: expect.any(Object),
            videoUrl: expect.any(Object),
            mood: expect.any(Object),
          })
        );
      });

      it('passing IMeditation should create a new form with FormGroup', () => {
        const formGroup = service.createMeditationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            content: expect.any(Object),
            videoUrl: expect.any(Object),
            mood: expect.any(Object),
          })
        );
      });
    });

    describe('getMeditation', () => {
      it('should return NewMeditation for default Meditation initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMeditationFormGroup(sampleWithNewData);

        const meditation = service.getMeditation(formGroup) as any;

        expect(meditation).toMatchObject(sampleWithNewData);
      });

      it('should return NewMeditation for empty Meditation initial value', () => {
        const formGroup = service.createMeditationFormGroup();

        const meditation = service.getMeditation(formGroup) as any;

        expect(meditation).toMatchObject({});
      });

      it('should return IMeditation', () => {
        const formGroup = service.createMeditationFormGroup(sampleWithRequiredData);

        const meditation = service.getMeditation(formGroup) as any;

        expect(meditation).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMeditation should not enable id FormControl', () => {
        const formGroup = service.createMeditationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMeditation should disable id FormControl', () => {
        const formGroup = service.createMeditationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
