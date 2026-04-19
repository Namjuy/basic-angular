import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, LoginCredentials } from '../../shared/services';

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
        MatSnackBarModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    loginForm: FormGroup;
    isLoading = false;
    hidePassword = true;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private authService: AuthService,
        private snackBar: MatSnackBar
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.isLoading = true;
            const credentials: LoginCredentials = {
                email: this.loginForm.value.email,
                password: this.loginForm.value.password
            };

            this.authService.login(credentials).subscribe({
                next: (response) => {
                    this.isLoading = false;
                    if (response.success) {
                        this.snackBar.open(response.message || 'Đăng nhập thành công', 'Đóng', {
                            duration: 3000
                        });
                        // Store user info (in real app, store token)
                        localStorage.setItem('currentUser', JSON.stringify(response.user));
                        // Navigate to landing page
                        this.router.navigate(['/landing']);
                    } else {
                        this.snackBar.open(response.message || 'Đăng nhập thất bại', 'Đóng', {
                            duration: 5000
                        });
                    }
                },
                error: (error) => {
                    this.isLoading = false;
                    console.error('Login error:', error);
                    this.snackBar.open('Có lỗi xảy ra khi đăng nhập', 'Đóng', {
                        duration: 5000
                    });
                }
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
}