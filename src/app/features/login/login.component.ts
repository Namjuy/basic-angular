import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RegisterDialogComponent } from './register-dialog/register-dialog.component';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService, LoginCredentials } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatDividerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = signal(false);
  hidePassword = signal(true);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      const credentials: LoginCredentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          if (response.success) {
            this.snackBar.open(response.message || 'Đăng nhập thành công', 'Đóng', {
              duration: 3000,
            });
            // Store user info (in real app, store token)
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            // Navigate to landing page
            this.router.navigate(['/landing']);
          } else {
            this.snackBar.open(response.message || 'Đăng nhập thất bại', 'Đóng', {
              duration: 5000,
            });
          }
        },
        error: (error) => {
          this.isLoading.set(false);
          console.error('Login error:', error);
          this.snackBar.open('Có lỗi xảy ra khi đăng nhập', 'Đóng', {
            duration: 5000,
          });
        },
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.loginForm.markAllAsTouched();
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePassword() {
    this.hidePassword.update(v => !v);
  }

  openRegisterDialog() {
    const dialogRef = this.dialog.open(RegisterDialogComponent, {
      width: '450px',
      disableClose: true, // Yêu cầu người dùng bấm nút Hủy hoặc Đăng ký để đóng
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Nếu result có dữ liệu (người dùng bấm Đăng ký thành công)
      if (result) {
        this.snackBar.open('Đăng ký thành công! Vui lòng đăng nhập.', 'Đóng', { duration: 3000 });
        // Tự động điền email vừa đăng ký vào form đăng nhập
        this.loginForm.patchValue({ email: result.email });
      }
    });
  }
}
