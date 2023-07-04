import { IContact, NewContact } from './contact.model';

export const sampleWithRequiredData: IContact = {
  id: 36482,
  info: 'online',
  content: '../fake-data/blob/hipster.txt',
};

export const sampleWithPartialData: IContact = {
  id: 25447,
  info: 'parse',
  content: '../fake-data/blob/hipster.txt',
};

export const sampleWithFullData: IContact = {
  id: 84461,
  info: 'Sudan SDD cross-platform',
  content: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: NewContact = {
  info: 'Buckinghamshire',
  content: '../fake-data/blob/hipster.txt',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
