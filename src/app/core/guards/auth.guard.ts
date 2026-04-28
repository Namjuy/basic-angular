import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Kiểm tra trạng thái đăng nhập
  if (!authService.isAuthenticated()) {
    // Nếu chưa đăng nhập, điều hướng về trang login
    return router.parseUrl('/login');
  }

  // 2. Kiểm tra quyền (Role-based access control)
  const requiredRoles = route.data?.['roles'] as Array<string>;
  if (requiredRoles && requiredRoles.length > 0) {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || !requiredRoles.includes(currentUser.role)) {
      // Nếu không có quyền, đẩy về trang landing (hoặc tạo một trang 403 Forbidden riêng)
      return router.parseUrl('/landing');
    }
  }

  return true; // Cho phép đi tiếp
};