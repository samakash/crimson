import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../meditation-session.test-samples';

import { MeditationSessionFormService } from './meditation-session-form.service';

describe('MeditationSession Form Service', () => {
  let service: MeditationSessionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeditationSessionFormService);
  });

  describe('Service methods', () => {
    describe('createMeditationSessionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMeditationSessionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            description: expect.any(Object),
            date: expect.any(Object),
            user: expect.any(Object),
            meditation: expect.any(Object),
          })
        );
      });

      it('passing IMeditationSession should create a new form with FormGroup', () => {
        const formGroup = service.createMeditationSessionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            description: expect.any(Object),
            date: expect.any(Object),
            user: expect.any(Object),
            meditation: expect.any(Object),
          })
        );
      });
    });

    describe('getMeditationSession', () => {
      it('should return NewMeditationSession for default MeditationSession initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMeditationSessionFormGroup(sampleWithNewData);

        const meditationSession = service.getMeditationSession(formGroup) as any;

        expect(meditationSession).toMatchObject(sampleWithNewData);
      });

      it('should return NewMeditationSession for empty MeditationSession initial value', () => {
        const formGroup = service.createMeditationSessionFormGroup();

        const meditationSession = service.getMeditationSession(formGroup) as any;

        expect(meditationSession).toMatchObject({});
      });

      it('should return IMeditationSession', () => {
        const formGroup = service.createMeditationSessionFormGroup(sampleWithRequiredData);

        const meditationSession = service.getMeditationSession(formGroup) as any;

        expect(meditationSession).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMeditationSession should not enable id FormControl', () => {
        const formGroup = service.createMeditationSessionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMeditationSession should disable id FormControl', () => {
        const formGroup = service.createMeditationSessionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
