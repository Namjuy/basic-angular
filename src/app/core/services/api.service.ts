import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // TODO: Bạn nên chuyển baseUrl này vào file environment.ts trong ứng dụng thực tế
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  /**
   * Thực hiện request GET
   */
  get<T>(path: string, params: HttpParams | { [param: string]: string | number | boolean } = {}): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${path}`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Thực hiện request POST
   */
  post<T>(path: string, body: any = {}, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Thực hiện request PUT
   */
  put<T>(path: string, body: any = {}, headers?: HttpHeaders): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${path}`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Thực hiện request DELETE
   */
  delete<T>(path: string, params: HttpParams | { [param: string]: string | number | boolean } = {}): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${path}`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Xử lý lỗi chung cho toàn bộ API
   */
  private handleError(error: any) {
    console.error('Lỗi từ API:', error);
    
    // Tại đây bạn có thể thêm logic hiển thị Toast/SnackBar thông báo lỗi chung
    // hoặc logic tự động điều hướng về trang Login nếu gặp lỗi 401 Unauthorized
    
    const errorMessage = error?.error?.message || error.message || 'Lỗi kết nối đến máy chủ';
    return throwError(() => new Error(errorMessage));
  }
}