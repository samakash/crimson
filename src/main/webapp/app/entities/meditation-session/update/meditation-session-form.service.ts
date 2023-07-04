import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IMeditationSession, NewMeditationSession } from '../meditation-session.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMeditationSession for edit and NewMeditationSessionFormGroupInput for create.
 */
type MeditationSessionFormGroupInput = IMeditationSession | PartialWithRequiredKeyOf<NewMeditationSession>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IMeditationSession | NewMeditationSession> = Omit<T, 'date'> & {
  date?: string | null;
};

type MeditationSessionFormRawValue = FormValueOf<IMeditationSession>;

type NewMeditationSessionFormRawValue = FormValueOf<NewMeditationSession>;

type MeditationSessionFormDefaults = Pick<NewMeditationSession, 'id' | 'date'>;

type MeditationSessionFormGroupContent = {
  id: FormControl<MeditationSessionFormRawValue['id'] | NewMeditationSession['id']>;
  title: FormControl<MeditationSessionFormRawValue['title']>;
  description: FormControl<MeditationSessionFormRawValue['description']>;
  date: FormControl<MeditationSessionFormRawValue['date']>;
  user: FormControl<MeditationSessionFormRawValue['user']>;
  meditation: FormControl<MeditationSessionFormRawValue['meditation']>;
};

export type MeditationSessionFormGroup = FormGroup<MeditationSessionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MeditationSessionFormService {
  createMeditationSessionFormGroup(meditationSession: MeditationSessionFormGroupInput = { id: null }): MeditationSessionFormGroup {
    const meditationSessionRawValue = this.convertMeditationSessionToMeditationSessionRawValue({
      ...this.getFormDefaults(),
      ...meditationSession,
    });
    return new FormGroup<MeditationSessionFormGroupContent>({
      id: new FormControl(
        { value: meditationSessionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      title: new FormControl(meditationSessionRawValue.title, {
        validators: [Validators.required],
      }),
      description: new FormControl(meditationSessionRawValue.description, {
        validators: [Validators.required],
      }),
      date: new FormControl(meditationSessionRawValue.date, {
        validators: [Validators.required],
      }),
      user: new FormControl(meditationSessionRawValue.user),
      meditation: new FormControl(meditationSessionRawValue.meditation),
    });
  }

  getMeditationSession(form: MeditationSessionFormGroup): IMeditationSession | NewMeditationSession {
    return this.convertMeditationSessionRawValueToMeditationSession(
      form.getRawValue() as MeditationSessionFormRawValue | NewMeditationSessionFormRawValue
    );
  }

  resetForm(form: MeditationSessionFormGroup, meditationSession: MeditationSessionFormGroupInput): void {
    const meditationSessionRawValue = this.convertMeditationSessionToMeditationSessionRawValue({
      ...this.getFormDefaults(),
      ...meditationSession,
    });
    form.reset(
      {
        ...meditationSessionRawValue,
        id: { value: meditationSessionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MeditationSessionFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
    };
  }

  private convertMeditationSessionRawValueToMeditationSession(
    rawMeditationSession: MeditationSessionFormRawValue | NewMeditationSessionFormRawValue
  ): IMeditationSession | NewMeditationSession {
    return {
      ...rawMeditationSession,
      date: dayjs(rawMeditationSession.date, DATE_TIME_FORMAT),
    };
  }

  private convertMeditationSessionToMeditationSessionRawValue(
    meditationSession: IMeditationSession | (Partial<NewMeditationSession> & MeditationSessionFormDefaults)
  ): MeditationSessionFormRawValue | PartialWithRequiredKeyOf<NewMeditationSessionFormRawValue> {
    return {
      ...meditationSession,
      date: meditationSession.date ? meditationSession.date.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
