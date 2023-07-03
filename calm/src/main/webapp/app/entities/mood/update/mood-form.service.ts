import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMood, NewMood } from '../mood.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMood for edit and NewMoodFormGroupInput for create.
 */
type MoodFormGroupInput = IMood | PartialWithRequiredKeyOf<NewMood>;

type MoodFormDefaults = Pick<NewMood, 'id'>;

type MoodFormGroupContent = {
  id: FormControl<IMood['id'] | NewMood['id']>;
  name: FormControl<IMood['name']>;
  meditation: FormControl<IMood['meditation']>;
};

export type MoodFormGroup = FormGroup<MoodFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MoodFormService {
  createMoodFormGroup(mood: MoodFormGroupInput = { id: null }): MoodFormGroup {
    const moodRawValue = {
      ...this.getFormDefaults(),
      ...mood,
    };
    return new FormGroup<MoodFormGroupContent>({
      id: new FormControl(
        { value: moodRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(moodRawValue.name, {
        validators: [Validators.required, Validators.minLength(2)],
      }),
      meditation: new FormControl(moodRawValue.meditation),
    });
  }

  getMood(form: MoodFormGroup): IMood | NewMood {
    return form.getRawValue() as IMood | NewMood;
  }

  resetForm(form: MoodFormGroup, mood: MoodFormGroupInput): void {
    const moodRawValue = { ...this.getFormDefaults(), ...mood };
    form.reset(
      {
        ...moodRawValue,
        id: { value: moodRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MoodFormDefaults {
    return {
      id: null,
    };
  }
}
