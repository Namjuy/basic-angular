import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
}

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersUrl = 'assets/data/users.json';

  constructor(private http: HttpClient) {}

  /**
   * Authenticate user with email and password
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    console.log('Login attempt with email:', credentials.email);
    
    return this.http.get<User[]>(this.usersUrl).pipe(
      map(users => {
        console.log('Users loaded successfully:', users);
        
        const user = users.find(u =>
          u.email === credentials.email &&
          u.password === credentials.password
        );

        if (user) {
          console.log('User found:', user.email);
          // Remove password from response
          const authUser: AuthUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          };
          return {
            success: true,
            user: authUser,
            message: 'Đăng nhập thành công'
          };
        } else {
          console.log('User not found or password incorrect');
          return {
            success: false,
            message: 'Email hoặc mật khẩu không đúng'
          };
        }
      }),
      catchError(error => {
        console.error('Login API error:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        
        let errorMessage = 'Có lỗi xảy ra khi đăng nhập';
        
        if (error.status === 404) {
          errorMessage = 'Không thể tải dữ liệu người dùng (404)';
        } else if (error.status === 0) {
          errorMessage = 'Không thể kết nối đến server';
        }
        
        return of({
          success: false,
          message: errorMessage
        });
      })
    );
  }

  /**
   * Get all users (for admin purposes)
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl);
  }

  /**
   * Check if user is authenticated (simple implementation)
   * In real app, this would check JWT token or session
   */
  isAuthenticated(): boolean {
    // For demo purposes, just return false
    // In real implementation, check localStorage or token
    return false;
  }

  /**
   * Logout user
   */
  logout(): void {
    // Trong môi trường Backend thực tế: Phải gọi API để Backend xóa HttpOnly Cookie
    // this.http.post('/api/logout', {}, { withCredentials: true }).subscribe();
    
    // Xóa thông tin hiển thị của user trên trình duyệt
    localStorage.removeItem('currentUser');
  }
}