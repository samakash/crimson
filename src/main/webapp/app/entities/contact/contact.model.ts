export interface IContact {
  id: number;
  info?: string | null;
  content?: string | null;
}

export type NewContact = Omit<IContact, 'id'> & { id: null };
