import { IMood } from 'app/entities/mood/mood.model';

export interface IMeditation {
  id: number;
  name?: string | null;
  content?: string | null;
  videoUrl?: string | null;
  mood?: Pick<IMood, 'id'> | null;
}

export type NewMeditation = Omit<IMeditation, 'id'> & { id: null };
