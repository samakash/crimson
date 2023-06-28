import { IReferal, NewReferal } from './referal.model';

export const sampleWithRequiredData: IReferal = {
  id: 98820,
  email: 'Rodolfo.Emmerich66@gmail.com',
};

export const sampleWithPartialData: IReferal = {
  id: 84222,
  email: 'Cole_Bruen@hotmail.com',
};

export const sampleWithFullData: IReferal = {
  id: 84927,
  email: 'Frida.Klocko30@hotmail.com',
  message: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: NewReferal = {
  email: 'Maximus89@gmail.com',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
