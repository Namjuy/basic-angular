# Hệ thống xác thực và lưu trữ dữ liệu

## Cấu trúc dữ liệu JSON

### 📁 `src/assets/data/`
Chứa các file JSON để lưu trữ dữ liệu mock cho ứng dụng.

#### `users.json`
Chứa thông tin người dùng cho hệ thống xác thực:

```json
[
  {
    "id": 1,
    "email": "admin@example.com",
    "password": "admin123",
    "name": "Administrator",
    "role": "admin"
  }
]
```

## AuthService

### 🔐 **Chức năng chính:**
- `login(credentials)`: Xác thực người dùng
- `getUsers()`: Lấy danh sách tất cả người dùng
- `isAuthenticated()`: Kiểm tra trạng thái đăng nhập
- `logout()`: Đăng xuất

### 📝 **Cách sử dụng:**

```typescript
import { AuthService, LoginCredentials } from './shared/services';

constructor(private authService: AuthService) {}

loginUser(email: string, password: string) {
  const credentials: LoginCredentials = { email, password };

  this.authService.login(credentials).subscribe(response => {
    if (response.success) {
      console.log('Đăng nhập thành công:', response.user);
      // Lưu thông tin user và chuyển hướng
    } else {
      console.log('Đăng nhập thất bại:', response.message);
    }
  });
}
```

## Tài khoản test

| Email | Mật khẩu | Vai trò |
|-------|----------|---------|
| admin@example.com | admin123 | admin |
| user@example.com | user123 | user |
| test@example.com | test123 | user |

## Lưu ý bảo mật

⚠️ **Đây là hệ thống demo** - trong production:
- Không lưu mật khẩu plain text
- Sử dụng HTTPS
- Implement JWT tokens
- Hash passwords
- Validate input properly

## Mở rộng

Bạn có thể thêm các file JSON khác như:
- `products.json` - Danh sách sản phẩm
- `orders.json` - Đơn hàng
- `settings.json` - Cấu hình ứng dụng