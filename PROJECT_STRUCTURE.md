# Cấu trúc thư mục dự án Angular

## Tổng quan
Dự án được tổ chức theo cấu trúc module/feature-based để dễ dàng bảo trì và mở rộng.

## Cấu trúc thư mục

```
src/
├── app/
│   ├── core/                   # 1. CỐT LÕI (Chỉ khởi tạo 1 lần)
│   │   ├── auth/               # Xử lý login, logout, token
│   │   ├── guards/             # Bảo vệ route (auth.guard, admin.guard)
│   │   ├── interceptors/       # Gắn token, bắt lỗi API toàn cục
│   │   ├── services/           # ApiService, TokenService, Logger
│   │   └── core.provider.ts    # Cấu hình tất cả core services
│   ├── shared/                 # 2. DÙNG CHUNG (Tái sử dụng ở nhiều nơi)
│   │   ├── components/         # UI Kit: Button, Card, Spinner, Modal
│   │   ├── directives/         # ClickOutside, ZoomImage
│   │   ├── pipes/              # FormatCurrency, TimeAgo
│   │   ├── models/             # Domain Models (Product, User, Order)
│   │   └── interfaces/         # API Request/Response types
│   ├── layouts/                # 3. BỐ CỤC (Khung bao quanh)
│   │   ├── main-layout/        # Header + Footer + Content (cho User)
│   │   ├── admin-layout/       # Sidebar + Header + Content (cho Admin)
│   │   └── auth-layout/        # Chỉ có router-outlet (cho Login/Register)
│   ├── features/               # 4. TÍNH NĂNG (Theo nghiệp vụ)
│   │   ├── home/               # Trang chủ
│   │   ├── catalog/            # Danh mục & Sản phẩm (List, Detail, Search)
│   │   ├── cart/               # Giỏ hàng
│   │   ├── checkout/           # Thanh toán
│   │   ├── profile/            # Thông tin cá nhân, lịch sử đơn hàng
│   │   └── admin/              # Hệ thống quản trị (chia nhỏ feature con bên trong)
│   ├── store/                  # 5. QUẢN LÝ TRẠNG THÁI (Signals/NgRx)
│   │   ├── cart.store.ts       # Quản lý giỏ hàng toàn cục
│   │   └── auth.store.ts       # Quản lý session user
│   ├── app.config.ts           # Cấu hình App (Providers, Router, SSR)
│   ├── app.routes.ts           # Định tuyến cấp cao nhất
│   └── app.component.ts        # Component gốc
├── assets/                     # Ảnh, icons, fonts, i18n (JSON)
├── environments/               # Cấu hình API URL (Dev, Prod)
└── styles/                     # Global SCSS, Variables, Mixins, Theme
```

## Cách sử dụng

### Thêm component mới
1. Tạo thư mục trong `shared/components/` hoặc `features/`
2. Tạo các file component tương ứng
3. Export trong file `index.ts` của thư mục cha

### Thêm service mới
1. Tạo file service trong `shared/services/`
2. Export trong `shared/services/index.ts`
3. Inject vào component cần sử dụng

### Thêm utility mới
1. Tạo file utility trong `shared/utils/`
2. Export trong `shared/utils/index.ts`
3. Import khi cần sử dụng

## Routing
- `/login`: Màn đăng nhập
- `/`: Redirect về `/login`

## Lưu ý
- Sử dụng standalone components
- Import các module cần thiết trong component
- Tuân thủ cấu trúc để dễ bảo trì