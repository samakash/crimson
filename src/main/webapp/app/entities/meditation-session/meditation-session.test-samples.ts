import dayjs from 'dayjs/esm';

import { IMeditationSession, NewMeditationSession } from './meditation-session.model';

export const sampleWithRequiredData: IMeditationSession = {
  id: 57275,
  title: 'Manat',
  description: '../fake-data/blob/hipster.txt',
  date: dayjs('2023-07-03T10:05'),
};

export const sampleWithPartialData: IMeditationSession = {
  id: 57289,
  title: 'Avon Oman',
  description: '../fake-data/blob/hipster.txt',
  date: dayjs('2023-07-04T00:05'),
};

export const sampleWithFullData: IMeditationSession = {
  id: 65667,
  title: 'executive',
  description: '../fake-data/blob/hipster.txt',
  date: dayjs('2023-07-03T06:21'),
};

export const sampleWithNewData: NewMeditationSession = {
  title: 'Applications Avon input',
  description: '../fake-data/blob/hipster.txt',
  date: dayjs('2023-07-03T19:38'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
