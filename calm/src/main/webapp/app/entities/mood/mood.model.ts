import { IMeditation } from 'app/entities/meditation/meditation.model';

export interface IMood {
  id: number;
  name?: string | null;
  meditation?: Pick<IMeditation, 'id' | 'name'> | null;
}

export type NewMood = Omit<IMood, 'id'> & { id: null };
