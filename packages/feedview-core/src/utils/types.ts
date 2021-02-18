export interface IResponseObject<T = any> {
  data?: T;
  error?: IGenericError;
}

interface IGenericError {
  message: string;
}
