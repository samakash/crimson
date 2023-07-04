import dayjs from 'dayjs/esm';
import { IMeditation } from 'app/entities/meditation/meditation.model';
import { IUser } from 'app/entities/user/user.model';

export interface IEvent {
  id: number;
  title?: string | null;
  description?: string | null;
  date?: dayjs.Dayjs | null;
  location?: string | null;
  meditation?: Pick<IMeditation, 'id'> | null;
  users?: Pick<IUser, 'id'>[] | null;
}

export type NewEvent = Omit<IEvent, 'id'> & { id: null };
