import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../local-resource.test-samples';

import { LocalResourceFormService } from './local-resource-form.service';

describe('LocalResource Form Service', () => {
  let service: LocalResourceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalResourceFormService);
  });

  describe('Service methods', () => {
    describe('createLocalResourceFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLocalResourceFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            type: expect.any(Object),
            location: expect.any(Object),
            description: expect.any(Object),
            imageURL: expect.any(Object),
          })
        );
      });

      it('passing ILocalResource should create a new form with FormGroup', () => {
        const formGroup = service.createLocalResourceFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            type: expect.any(Object),
            location: expect.any(Object),
            description: expect.any(Object),
            imageURL: expect.any(Object),
          })
        );
      });
    });

    describe('getLocalResource', () => {
      it('should return NewLocalResource for default LocalResource initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createLocalResourceFormGroup(sampleWithNewData);

        const localResource = service.getLocalResource(formGroup) as any;

        expect(localResource).toMatchObject(sampleWithNewData);
      });

      it('should return NewLocalResource for empty LocalResource initial value', () => {
        const formGroup = service.createLocalResourceFormGroup();

        const localResource = service.getLocalResource(formGroup) as any;

        expect(localResource).toMatchObject({});
      });

      it('should return ILocalResource', () => {
        const formGroup = service.createLocalResourceFormGroup(sampleWithRequiredData);

        const localResource = service.getLocalResource(formGroup) as any;

        expect(localResource).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILocalResource should not enable id FormControl', () => {
        const formGroup = service.createLocalResourceFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLocalResource should disable id FormControl', () => {
        const formGroup = service.createLocalResourceFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
