import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IReferal, NewReferal } from '../referal.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IReferal for edit and NewReferalFormGroupInput for create.
 */
type ReferalFormGroupInput = IReferal | PartialWithRequiredKeyOf<NewReferal>;

type ReferalFormDefaults = Pick<NewReferal, 'id'>;

type ReferalFormGroupContent = {
  id: FormControl<IReferal['id'] | NewReferal['id']>;
  email: FormControl<IReferal['email']>;
  message: FormControl<IReferal['message']>;
  user: FormControl<IReferal['user']>;
};

export type ReferalFormGroup = FormGroup<ReferalFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ReferalFormService {
  createReferalFormGroup(referal: ReferalFormGroupInput = { id: null }): ReferalFormGroup {
    const referalRawValue = {
      ...this.getFormDefaults(),
      ...referal,
    };
    return new FormGroup<ReferalFormGroupContent>({
      id: new FormControl(
        { value: referalRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      email: new FormControl(referalRawValue.email, {
        validators: [Validators.required, Validators.minLength(2)],
      }),
      message: new FormControl(referalRawValue.message),
      user: new FormControl(referalRawValue.user),
    });
  }

  getReferal(form: ReferalFormGroup): IReferal | NewReferal {
    return form.getRawValue() as IReferal | NewReferal;
  }

  resetForm(form: ReferalFormGroup, referal: ReferalFormGroupInput): void {
    const referalRawValue = { ...this.getFormDefaults(), ...referal };
    form.reset(
      {
        ...referalRawValue,
        id: { value: referalRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ReferalFormDefaults {
    return {
      id: null,
    };
  }
}
