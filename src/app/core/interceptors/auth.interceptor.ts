import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Kiểm tra nếu request gọi tới Backend API (thay đổi '/api' theo URL thực tế của bạn)
  // Với HttpOnly Cookie, chỉ cần set withCredentials = true là trình duyệt tự gửi Cookie đi.
  if (req.url.includes('/api')) {
    const clonedReq = req.clone({
      withCredentials: true
    });
    return next(clonedReq);
  }

  return next(req);
};