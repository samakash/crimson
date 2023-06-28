export interface IMood {
  id: number;
  name?: string | null;
}

export type NewMood = Omit<IMood, 'id'> & { id: null };
