import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { IMeditation } from 'app/entities/meditation/meditation.model';

export interface IMeditationSession {
  id: number;
  title?: string | null;
  description?: string | null;
  date?: dayjs.Dayjs | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
  meditation?: Pick<IMeditation, 'id' | 'name'> | null;
}

export type NewMeditationSession = Omit<IMeditationSession, 'id'> & { id: null };
