export interface IMeditation {
  id: number;
  name?: string | null;
  content?: string | null;
  videoUrl?: string | null;
}

export type NewMeditation = Omit<IMeditation, 'id'> & { id: null };
