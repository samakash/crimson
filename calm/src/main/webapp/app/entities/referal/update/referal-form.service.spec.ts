import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../referal.test-samples';

import { ReferalFormService } from './referal-form.service';

describe('Referal Form Service', () => {
  let service: ReferalFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReferalFormService);
  });

  describe('Service methods', () => {
    describe('createReferalFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createReferalFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            email: expect.any(Object),
            message: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IReferal should create a new form with FormGroup', () => {
        const formGroup = service.createReferalFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            email: expect.any(Object),
            message: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getReferal', () => {
      it('should return NewReferal for default Referal initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createReferalFormGroup(sampleWithNewData);

        const referal = service.getReferal(formGroup) as any;

        expect(referal).toMatchObject(sampleWithNewData);
      });

      it('should return NewReferal for empty Referal initial value', () => {
        const formGroup = service.createReferalFormGroup();

        const referal = service.getReferal(formGroup) as any;

        expect(referal).toMatchObject({});
      });

      it('should return IReferal', () => {
        const formGroup = service.createReferalFormGroup(sampleWithRequiredData);

        const referal = service.getReferal(formGroup) as any;

        expect(referal).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IReferal should not enable id FormControl', () => {
        const formGroup = service.createReferalFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewReferal should disable id FormControl', () => {
        const formGroup = service.createReferalFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
