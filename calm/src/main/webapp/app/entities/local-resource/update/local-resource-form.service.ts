import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ILocalResource, NewLocalResource } from '../local-resource.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILocalResource for edit and NewLocalResourceFormGroupInput for create.
 */
type LocalResourceFormGroupInput = ILocalResource | PartialWithRequiredKeyOf<NewLocalResource>;

type LocalResourceFormDefaults = Pick<NewLocalResource, 'id'>;

type LocalResourceFormGroupContent = {
  id: FormControl<ILocalResource['id'] | NewLocalResource['id']>;
  title: FormControl<ILocalResource['title']>;
  type: FormControl<ILocalResource['type']>;
  location: FormControl<ILocalResource['location']>;
  description: FormControl<ILocalResource['description']>;
  imageURL: FormControl<ILocalResource['imageURL']>;
};

export type LocalResourceFormGroup = FormGroup<LocalResourceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LocalResourceFormService {
  createLocalResourceFormGroup(localResource: LocalResourceFormGroupInput = { id: null }): LocalResourceFormGroup {
    const localResourceRawValue = {
      ...this.getFormDefaults(),
      ...localResource,
    };
    return new FormGroup<LocalResourceFormGroupContent>({
      id: new FormControl(
        { value: localResourceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      title: new FormControl(localResourceRawValue.title, {
        validators: [Validators.required],
      }),
      type: new FormControl(localResourceRawValue.type, {
        validators: [Validators.required],
      }),
      location: new FormControl(localResourceRawValue.location, {
        validators: [Validators.required],
      }),
      description: new FormControl(localResourceRawValue.description, {
        validators: [Validators.required],
      }),
      imageURL: new FormControl(localResourceRawValue.imageURL),
    });
  }

  getLocalResource(form: LocalResourceFormGroup): ILocalResource | NewLocalResource {
    return form.getRawValue() as ILocalResource | NewLocalResource;
  }

  resetForm(form: LocalResourceFormGroup, localResource: LocalResourceFormGroupInput): void {
    const localResourceRawValue = { ...this.getFormDefaults(), ...localResource };
    form.reset(
      {
        ...localResourceRawValue,
        id: { value: localResourceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LocalResourceFormDefaults {
    return {
      id: null,
    };
  }
}
