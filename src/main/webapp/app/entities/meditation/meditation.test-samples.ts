import { IMeditation, NewMeditation } from './meditation.model';

export const sampleWithRequiredData: IMeditation = {
  id: 57672,
  name: 'portals Concrete',
  content: '../fake-data/blob/hipster.txt',
  videoUrl: 'Lanka Legacy',
};

export const sampleWithPartialData: IMeditation = {
  id: 2724,
  name: 'Avon compress',
  content: '../fake-data/blob/hipster.txt',
  videoUrl: 'Developer optimize intangible',
};

export const sampleWithFullData: IMeditation = {
  id: 72542,
  name: 'revolutionary',
  content: '../fake-data/blob/hipster.txt',
  videoUrl: 'Heights',
};

export const sampleWithNewData: NewMeditation = {
  name: 'infrastructures Health blue',
  content: '../fake-data/blob/hipster.txt',
  videoUrl: 'of Cotton utilize',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
