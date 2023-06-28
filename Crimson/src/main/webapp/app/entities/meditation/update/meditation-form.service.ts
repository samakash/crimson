import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMeditation, NewMeditation } from '../meditation.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMeditation for edit and NewMeditationFormGroupInput for create.
 */
type MeditationFormGroupInput = IMeditation | PartialWithRequiredKeyOf<NewMeditation>;

type MeditationFormDefaults = Pick<NewMeditation, 'id'>;

type MeditationFormGroupContent = {
  id: FormControl<IMeditation['id'] | NewMeditation['id']>;
  name: FormControl<IMeditation['name']>;
  content: FormControl<IMeditation['content']>;
  videoUrl: FormControl<IMeditation['videoUrl']>;
  mood: FormControl<IMeditation['mood']>;
};

export type MeditationFormGroup = FormGroup<MeditationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MeditationFormService {
  createMeditationFormGroup(meditation: MeditationFormGroupInput = { id: null }): MeditationFormGroup {
    const meditationRawValue = {
      ...this.getFormDefaults(),
      ...meditation,
    };
    return new FormGroup<MeditationFormGroupContent>({
      id: new FormControl(
        { value: meditationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(meditationRawValue.name, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(meditationRawValue.content, {
        validators: [Validators.required],
      }),
      videoUrl: new FormControl(meditationRawValue.videoUrl, {
        validators: [Validators.required, Validators.minLength(2)],
      }),
      mood: new FormControl(meditationRawValue.mood),
    });
  }

  getMeditation(form: MeditationFormGroup): IMeditation | NewMeditation {
    return form.getRawValue() as IMeditation | NewMeditation;
  }

  resetForm(form: MeditationFormGroup, meditation: MeditationFormGroupInput): void {
    const meditationRawValue = { ...this.getFormDefaults(), ...meditation };
    form.reset(
      {
        ...meditationRawValue,
        id: { value: meditationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MeditationFormDefaults {
    return {
      id: null,
    };
  }
}
