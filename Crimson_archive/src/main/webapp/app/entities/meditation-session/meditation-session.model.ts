import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IMeditationSession {
  id: number;
  title?: string | null;
  description?: string | null;
  date?: dayjs.Dayjs | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewMeditationSession = Omit<IMeditationSession, 'id'> & { id: null };
