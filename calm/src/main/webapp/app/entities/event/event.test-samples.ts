import dayjs from 'dayjs/esm';

import { IEvent, NewEvent } from './event.model';

export const sampleWithRequiredData: IEvent = {
  id: 63022,
  title: 'Cotton',
  description: '../fake-data/blob/hipster.txt',
  date: dayjs('2023-07-03T05:02'),
  location: 'Games',
};

export const sampleWithPartialData: IEvent = {
  id: 852,
  title: 'pixel',
  description: '../fake-data/blob/hipster.txt',
  date: dayjs('2023-07-03T14:28'),
  location: 'one-to-one wireless',
};

export const sampleWithFullData: IEvent = {
  id: 59507,
  title: 'SAS',
  description: '../fake-data/blob/hipster.txt',
  date: dayjs('2023-07-02T17:56'),
  location: 'deposit',
};

export const sampleWithNewData: NewEvent = {
  title: 'Barbuda',
  description: '../fake-data/blob/hipster.txt',
  date: dayjs('2023-07-03T09:45'),
  location: 'USB withdrawal hacking',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
