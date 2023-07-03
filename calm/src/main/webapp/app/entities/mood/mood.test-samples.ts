import { IMood, NewMood } from './mood.model';

export const sampleWithRequiredData: IMood = {
  id: 85110,
  name: 'Land Account convergence',
};

export const sampleWithPartialData: IMood = {
  id: 7024,
  name: 'Peru generation fault-tolerant',
};

export const sampleWithFullData: IMood = {
  id: 48394,
  name: 'Incredible AGP',
};

export const sampleWithNewData: NewMood = {
  name: 'Finland Shoes Won',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
