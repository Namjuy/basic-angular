# Cấu trúc thư mục dự án Angular

## Tổng quan
Dự án được tổ chức theo cấu trúc module/feature-based để dễ dàng bảo trì và mở rộng.

## Cấu trúc thư mục

```
src/app/
├── shared/                    # Các thành phần dùng chung
│   ├── components/           # Component tái sử dụng
│   │   └── index.ts          # Export tất cả components
│   ├── services/             # Service dùng chung
│   │   └── index.ts          # Export tất cả services
│   └── utils/                # Utility functions
│       └── index.ts          # Export tất cả utils
├── features/                 # Các tính năng/màn hình
│   ├── login/                # Màn login
│   │   ├── login.component.ts
│   │   ├── login.component.html
│   │   ├── login.component.scss
│   │   └── login.component.spec.ts
│   └── index.ts              # Export tất cả features
├── app.config.ts             # Cấu hình ứng dụng
├── app.routes.ts             # Định tuyến
├── app.ts                    # Component gốc
├── app.html                  # Template gốc
└── app.css                   # Styles gốc
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