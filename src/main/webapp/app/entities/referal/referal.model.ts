import { IUser } from 'app/entities/user/user.model';

export interface IReferal {
  id: number;
  email?: string | null;
  message?: string | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewReferal = Omit<IReferal, 'id'> & { id: null };
