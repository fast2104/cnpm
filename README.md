# Costume Rental Management - Statistics of Costumes

Ứng dụng web TypeScript triển khai module **Statistics of costumes**. Giao diện giữ đúng hướng tối giản của mockup: năm màn hình `LOGIN`, `Home`, `Statistic of Costume`, `List Bills` và `Bill`, với thanh tiêu đề tím và bảng dữ liệu đơn giản.

## Chạy ứng dụng

Yêu cầu Node.js và cài phụ thuộc dự án một lần:

```powershell
npm.cmd install
```

```powershell
npm.cmd start
```

Mở `http://localhost:3000` và đăng nhập:

```text
Account:  Storemanager
Password: manager
```

Để chạy kiểm thử nghiệp vụ:

```powershell
npm.cmd test
```

Để chỉ kiểm tra kiểu dữ liệu TypeScript:

```powershell
npm.cmd run typecheck
```

## Luồng chức năng

1. Đăng nhập tài khoản store manager.
2. Chọn `Statistics of costumes`.
3. Nhập `Start date` và `End date` theo định dạng `dd/mm/yyyy`, ví dụ `01/01/2024` đến `31/12/2024`.
4. Sắp xếp giảm dần theo `Number of rents` hoặc `Total amount collected`.
5. Nhấn mã trang phục để xem danh sách hóa đơn.
6. Nhấn tên người thuê để xem chi tiết hóa đơn.

## Thiết kế OOP

- `src/models/Entities.ts`: entity `User`, `Costume`, `CostumeStat`, `Customer`, `Renting`, `Returning`, `RentedCostume`, `ReturnCostume`, `Collateral`, `Condition`, `Bill`.
- `src/dao`: các DAO tương ứng các thao tác trong class diagram: `checkLogin()`, `getCostumeStat()`, `getListBill()` và `getBill()`.
- `src/views`: mỗi cửa sổ trong mockup là một lớp view riêng (`LoginFrm`, `HomeViewFrm`, `StatisticOfCostumeFrm`, `ListBillFrm`, `BillDetailFrm`).
- `src/Application.ts`: controller điều hướng và kết nối DAO với các view.
- `src/data/SeedData.ts`: dữ liệu bảng mẫu trong test plan, tạo thành object graph thay cho cơ sở dữ liệu ngoài.
- `server.ts`: server tĩnh TypeScript; lệnh chạy sẽ biên dịch nguồn vào `dist/` trước khi mở app.

Ảnh mockup được trích từ file báo cáo và lưu tại `docs/reference/interface-design.png` để đối chiếu khi xây dựng giao diện.

## Ghi chú dữ liệu

Báo cáo ghi không nhất quán tổng tiền của `AV003`: bảng dữ liệu gốc có 5 lượt thuê với giá `320,000`, tương ứng `1,600,000`, trong khi một dòng expected result ghi `1,800,000`. Ứng dụng tính tổng từ các bản ghi thuê, nên hiển thị `1,600,000`.
