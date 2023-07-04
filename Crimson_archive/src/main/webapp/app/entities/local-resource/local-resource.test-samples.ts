import { ILocalResource, NewLocalResource } from './local-resource.model';

export const sampleWithRequiredData: ILocalResource = {
  id: 3162,
  title: 'Branding Industrial',
  type: 'Lead Berkshire',
  location: 'TCP',
  description: '../fake-data/blob/hipster.txt',
};

export const sampleWithPartialData: ILocalResource = {
  id: 66884,
  title: 'Designer redundant Buckinghamshire',
  type: 'Gloves Web Ball',
  location: 'Steel Ball purple',
  description: '../fake-data/blob/hipster.txt',
};

export const sampleWithFullData: ILocalResource = {
  id: 67002,
  title: 'expedite Minnesota',
  type: 'Account',
  location: 'Incredible ability',
  description: '../fake-data/blob/hipster.txt',
  imageURL: 'bleeding-edge',
};

export const sampleWithNewData: NewLocalResource = {
  title: 'Borders Maine',
  type: 'system Rustic Towels',
  location: 'system-worthy Mouse Engineer',
  description: '../fake-data/blob/hipster.txt',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
