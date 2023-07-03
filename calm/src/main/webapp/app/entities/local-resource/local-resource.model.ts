export interface ILocalResource {
  id: number;
  title?: string | null;
  type?: string | null;
  location?: string | null;
  description?: string | null;
  imageURL?: string | null;
}

export type NewLocalResource = Omit<ILocalResource, 'id'> & { id: null };
