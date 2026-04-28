# 🛒 E-Commerce Enterprise Platform - Business Logic Documentation

Tài liệu này mô tả chi tiết các luồng nghiệp vụ (business flows), quy tắc hệ thống (system rules) và vòng đời thực thể (entity lifecycles) của nền tảng E-commerce. Tài liệu phục vụ cho Developer, QA/QC và Product Manager để hiểu rõ cách hệ thống vận hành.

---

## 📑 Mục lục
1. [Tổng quan Hệ thống](#1-tổng-quan-hệ-thống)
2. [Các Thực thể Cốt lõi (Core Entities)](#2-các-thực-thể-cốt-lõi)
3. [Vòng đời & Trạng thái (State Machines)](#3-vòng-đời--trạng-thái)
4. [Luồng Nghiệp vụ Chính (Core Flows)](#4-luồng-nghiệp-vụ-chính)
5. [Quy tắc Nghiệp vụ (Business Rules)](#5-quy-tắc-nghiệp-vụ)

---

## 1. Tổng quan Hệ thống

Hệ thống được thiết kế theo mô hình B2C (Business to Consumer), cho phép khách hàng duyệt sản phẩm, thêm vào giỏ hàng, thanh toán trực tuyến và theo dõi đơn hàng. Quản trị viên (Admin) có thể quản lý sản phẩm, kho hàng, xử lý đơn hàng và cấu hình hệ thống.

**Các Module chính:**
* **Catalog Module:** Quản lý danh mục, sản phẩm, thuộc tính (màu sắc, size).
* **Cart & Checkout Module:** Quản lý giỏ hàng, tính toán giá trị, áp dụng mã giảm giá và thanh toán.
* **Order & Fulfillment Module:** Xử lý đơn hàng từ lúc đặt đến khi giao thành công.
* **Inventory Module:** Quản lý tồn kho theo thời gian thực.
* **User Module:** Đăng nhập, phân quyền, hồ sơ khách hàng.

---

## 2. Các Thực thể Cốt lõi

* **Sản phẩm (Product):** Có 2 loại chính:
    * *Simple Product:* Sản phẩm vật lý không có biến thể (VD: Một cái cốc).
    * *Configurable/Variant Product:* Sản phẩm có nhiều biến thể (VD: Áo thun có Size S, M, L và Màu Đen, Trắng). Quản lý tồn kho sẽ tính trên từng biến thể (SKU).
* **Giỏ hàng (Cart):** Lưu trữ tạm thời Session của người dùng (có thể lưu ở LocalStorage với Guest hoặc Database với User đã login).
* **Đơn hàng (Order):** Bản snapshot bất biến (immutable) của giỏ hàng tại thời điểm thanh toán.

---

## 3. Vòng đời & Trạng thái (State Machines)

### 3.1. Trạng thái Đơn hàng (Order Status)
Một đơn hàng bắt buộc phải đi qua một luồng trạng thái tuyến tính (Happy Path) hoặc bị rẽ nhánh khi có sự cố.

| Trạng thái | Ý nghĩa | Hành động tiếp theo có thể |
| :--- | :--- | :--- |
| `PENDING` | Khách đã đặt, chờ thanh toán hoặc xác nhận | `PROCESSING`, `CANCELED` |
| `PROCESSING`| Đã thanh toán/Xác nhận COD, kho đang nhặt hàng| `SHIPPED`, `CANCELED` |
| `SHIPPED` | Đã bàn giao cho đơn vị vận chuyển (GHTK, GHN)| `DELIVERED`, `RETURNED` |
| `DELIVERED` | Khách đã nhận hàng thành công | `COMPLETED`, `REFUNDING` |
| `COMPLETED` | Đơn hàng hoàn tất (Hết hạn đổi trả) | *Không* |
| `CANCELED` | Đơn hàng bị hủy (bởi user hoặc admin) | *Không* |

### 3.2. Trạng thái Thanh toán (Payment Status)
* `UNPAID`: Chưa thanh toán.
* `PENDING`: Đang chờ cổng thanh toán (VNPay/Momo) phản hồi webhook.
* `PAID`: Thanh toán thành công.
* `FAILED`: Thanh toán thất bại.
* `REFUNDED`: Đã hoàn tiền cho khách.

---

## 4. Luồng Nghiệp vụ Chính (Core Flows)

### 4.1. Luồng Thêm vào giỏ hàng (Add to Cart Flow)
1.  Người dùng chọn Sản phẩm (và Biến thể nếu có), nhập số lượng $N$.
2.  Hệ thống kiểm tra: `Tồn kho hiện tại >= N`?
    * *Nếu Không:* Báo lỗi "Sản phẩm vượt quá số lượng cho phép".
    * *Nếu Có:* Thêm vào Giỏ hàng.
3.  **Lưu ý:** Thêm vào giỏ hàng **KHÔNG** làm giảm số lượng tồn kho thực tế.

### 4.2. Luồng Thanh toán (Checkout Flow)
1.  **Validate Giỏ hàng:** Khi user vào trang Checkout, hệ thống check lại toàn bộ giá và tồn kho của sản phẩm (vì có thể có người khác đã mua hết trong lúc user đang chần chừ).
2.  **Tính toán Giá:** `Tổng thanh toán = Tổng giá SP - Giảm giá (Voucher) + Phí vận chuyển + Thuế (nếu có)`.
3.  **Khóa Tồn kho (Inventory Reservation):** Khi user bấm "Đặt hàng", hệ thống sẽ *tạm giữ* số lượng hàng này trong $X$ phút (ví dụ: 15 phút) để chờ thanh toán.
4.  **Xử lý Thanh toán:**
    * *COD:* Tạo đơn hàng ngay với trạng thái `PROCESSING`. Trừ thẳng tồn kho.
    * *Online Payment:* Chuyển hướng sang Gateway. Đơn hàng ở trạng thái `PENDING`.
5.  **Webhook Xử lý (Với Online Payment):**
    * *Thành công:* Chuyển đơn sang `PROCESSING`, Trừ tồn kho thực tế.
    * *Thất bại / Timeout:* Hủy đơn hàng, hoàn trả lại số lượng "tạm giữ" vào tồn kho chung.

### 4.3. Luồng Hủy đơn hàng (Cancellation Flow)
* **Ai được hủy?** User chỉ được hủy khi đơn ở trạng thái `PENDING` hoặc `PROCESSING` (chưa giao cho shipper).
* **Nghiệp vụ:**
    1.  Cập nhật Order Status -> `CANCELED`.
    2.  Cộng lại số lượng sản phẩm vào Tồn kho (+ Stock).
    3.  Kích hoạt quy trình `REFUND` nếu khách đã thanh toán online.

---

## 5. Quy tắc Nghiệp vụ (Business Rules)

### 5.1. Quy tắc Khuyến mãi (Coupons/Vouchers)
* Hệ thống cho phép áp dụng đồng thời tối đa: 1 Voucher của Shop + 1 Voucher Freeship.
* Voucher có các điều kiện đi kèm: `Min Order Value` (Giá trị đơn hàng tối thiểu), `Max Discount` (Giảm tối đa bao nhiêu tiền), và `Usage Limit` (Giới hạn số lần dùng).
* Nếu khách hủy đơn, Voucher sẽ được hoàn lại (trừ khi Voucher đã hết hạn).

### 5.2. Đồng bộ Dữ liệu (Data Integrity)
* **Lịch sử giá:** Đơn hàng (`Order_Items`) phải lưu trữ giá bán *tại thời điểm đặt hàng*. Tuyệt đối không query ngược lại bảng `Products` để lấy giá, vì giá sản phẩm có thể thay đổi trong tương lai, làm sai lệch báo cáo doanh thu.
* **Soft Delete:** Không bao giờ xóa cứng (Hard delete) User, Order, hay Product. Thay vào đó, sử dụng cờ `is_active = false` hoặc `deleted_at = [timestamp]` để đảm bảo tính toàn vẹn của lịch sử hệ thống.