import { HttpInterceptorFn } from '@angular/common/http';

export const exampleInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
