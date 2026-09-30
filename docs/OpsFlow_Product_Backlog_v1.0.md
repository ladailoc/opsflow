**OpsFlow**

**PRODUCT BACKLOG – PRIORITY – ESTIMATE**

Phân rã chức năng đã chốt thành User Stories / Tasks để chuẩn bị phát triển

|  |  |
| --- | --- |
| **Phiên bản** | 1.0 |
| **Ngày** | 23/09/2026 |
| **Đối tượng** | Nhóm OJT – 2 thành viên |
| **Cơ sở** | OpsFlow Requirement Brief v1.0 + Q&A Management v1.0 |
| **Phạm vi** | MVP 8 tuần |

# 1. Mục tiêu và cơ sở lập backlog

Tài liệu này chuyển các yêu cầu nghiệp vụ đã được PO làm rõ thành backlog có thể triển khai. Mục tiêu là để nhóm có thể đưa trực tiếp các đầu việc vào Jira/Trello, biết dependency, thứ tự ưu tiên và estimate trước khi bước vào giai đoạn phát triển.

* Requirement Brief xác định 3 vai trò: Employee, Support Agent và Administrator; 10 nhóm chức năng FR01–FR10; lộ trình 8 tuần; yêu cầu review, testing và triển khai trên môi trường chung.
* Q&A Management được dùng để xác nhận các business rule chi tiết. Toàn bộ Q01–Q23 đã Close được sử dụng để lập committed backlog.
* Các chức năng, business rule và estimate trong tài liệu chỉ dựa trên Requirement Brief và các quyết định đã được PO xác nhận trong Q&A bản cuối.

## 1.1. Scope MVP đã chốt

| **Trong MVP** | **Ngoài MVP** |
| --- | --- |
| Login, role/permission, user administration | Public registration, SSO doanh nghiệp |
| Create/View/Edit/Cancel Ticket theo rule đã chốt | Ticket for Others / Affected User/Department |
| Support Queue, Take, Assign, Reassign | Multi-assignee / collaborators |
| 6-state lifecycle, Public Comment, Internal Note | Attachment bắt buộc |
| Audit History, Search/Filter/Pagination | Pending Vendor, Rejected |
| SLA First Response & Resolution, Workload/Dashboard cơ bản | AI, workflow phê duyệt nhiều cấp, asset management |

## 1.2. Các rule nghiệp vụ quan trọng đã chốt

* 1 account chỉ có 1 role: Employee, Support Agent hoặc Administrator. Chỉ Employee được tạo ticket.
* Mỗi ticket có tối đa 1 Support Agent chịu trách nhiệm chính; không có multi-assignee trong MVP.
* Agent có thể tự Take ticket NEW chưa có Assignee; Admin có thể Assign/Reassign. Chỉ Admin được Reassign.
* Take/Assign không tự chuyển ticket sang IN\_PROGRESS; Agent/Admin phải thực hiện Start Processing.
* Lifecycle MVP: NEW, IN\_PROGRESS, WAITING\_FOR\_EMPLOYEE, RESOLVED, CLOSED, CANCELLED. Khi Ticket ở WAITING\_FOR\_EMPLOYEE, Employee gửi Public Comment thì hệ thống tự chuyển Ticket về IN\_PROGRESS. Ngoài ra, nếu Agent phụ trách hoặc Administrator nhận thấy đã có đủ thông tin để tiếp tục xử lý mà không cần chờ Employee phản hồi, họ có thể chủ động Resume Processing để chuyển Ticket từ WAITING\_FOR\_EMPLOYEE về IN\_PROGRESS. Thao tác Resume Processing bắt buộc nhập lý do và lưu History.
* Employee được sửa Title/Description/Request Type/Impact/Urgency khi ticket còn NEW; sau đó bổ sung bằng Public Comment.
* Public Comment và Internal Note đều có trong MVP; Internal Note không được trả về cho Employee.
* Priority P1–P4 được hệ thống tính từ Impact × Urgency; không cho sửa Priority trực tiếp. Employee chọn Impact/Urgency khi tạo Ticket và được thay đổi khi Ticket còn NEW. Agent phụ trách hoặc Administrator được điều chỉnh Impact/Urgency khi Ticket ở NEW, IN\_PROGRESS hoặc WAITING\_FOR\_EMPLOYEE; thao tác bắt buộc nhập lý do, lưu History và hệ thống tự tính lại Priority theo Priority Matrix.
* SLA theo dõi riêng First Response và Resolution; tính 24/7 theo rule pause/resume đã chốt.
* Dashboard/Reporting trong MVP chỉ dành cho Administrator. Employee và Support Agent không được truy cập Dashboard hoặc dữ liệu báo cáo tổng hợp. Backend phải enforce quyền truy cập các API Dashboard/Reporting, không chỉ ẩn menu ở Frontend.
* Workload = số ticket đang mở được assign cho Agent ở NEW/IN\_PROGRESS/WAITING\_FOR\_EMPLOYEE.
* Dashboard MVP bắt buộc có Thời gian giải quyết trung bình: chỉ tính ticket hiện ở RESOLVED/CLOSED và có lần chuyển sang RESOLVED gần nhất trong kỳ báo cáo; thời gian giải quyết là tổng thời gian ở NEW + IN\_PROGRESS, cộng dồn qua các lần Reopen.
* Khi nhiều người thao tác đồng thời, mỗi thao tác phải kiểm tra quyền, trạng thái, Assignee và phiên bản Ticket hiện tại; thao tác dựa trên dữ liệu cũ bị từ chối, không ghi đè im lặng. Các cập nhật Ticket, SLA, comment bắt buộc và History liên quan phải cùng thành công hoặc cùng thất bại.
* Audit quản trị hệ thống: Toàn bộ lịch sử hoạt động quản trị (như Admin tạo/khóa tài khoản, thay đổi Role, kích hoạt/vô hiệu hóa Request Type) và lịch sử Ticket được lưu trữ tập trung trong bảng Audit\_Event dùng chung. Hệ thống sử dụng cặp định danh entity\_type và entity\_id (mô hình đa hình) để phân loại đối tượng tác động; giúp tái sử dụng Audit Service từ tuần 2 và hỗ trợ Admin lọc lịch sử linh hoạt mà không cần tách nhiều bảng database.
* Ngăn chặn Duplicate Submit: Các thao tác ghi dữ liệu phải được bảo vệ đa tầng chống gửi lặp do double-click hoặc retry khi mạng chậm:
  + Frontend: Nút bấm lập tức chuyển trạng thái Loading và bị vô hiệu hóa (disabled) ngay sau cú click đầu tiên.
  + Backend (Idempotency): Kiểm tra định danh thao tác (Idempotency Key hoặc trạng thái dữ liệu gần nhất) để đảm bảo request gửi lặp không tạo ra dữ liệu trùng lặp (Ticket, Comment, History hoặc transition trùng). Cơ chế này hoạt động độc lập và không thay thế cho kiểm tra phiên bản dữ liệu cũ (Version Check) của Epic 13.

# 2. Quy ước estimate và capacity

|  |
| --- |
| **Đơn vị**  1 PD (Person-Day) = 1 ngày làm việc của 1 người. |

* Estimate gồm phân tích task, code, basic unit/integration test và sửa lỗi sau code review.
* Không gồm thời gian chờ PO, scope change hoặc các chức năng ngoài MVP.
* Capacity lý thuyết từ tuần 2–8: 7 tuần × 5 ngày × 2 người = 70 PD.
* Backlog đã chốt sau khi bổ sung quyền Agent/Admin điều chỉnh Impact/Urgency: khoảng 64.5 PD. Phần còn lại khoảng 5.5 PD nên dành cho bug fixing, integration, review, PO feedback và các task bị underestimate.

# 3. Thứ tự ưu tiên phát triển

| **Nhóm** | **Mức** | **Nội dung** | **Nguyên tắc** |
| --- | --- | --- | --- |
| Core MVP | P0 | Foundation; Auth/Authorization; Create/View/Edit/Cancel Ticket; Queue/Assignment; Lifecycle; Comments; core security | Phải hoàn thành để demo end-to-end |
| Required MVP | P1 | Request Type Admin; History; Search/Filter; SLA; Workload/Dashboard; performance & delivery | Làm sau khi core flow ổn định |
| Optional / Ngoài scope | P2 / Optional | Attachment; Average First Response Time trên Dashboard; các mở rộng ngoài phạm vi MVP | Chỉ thực hiện khi core MVP ổn định hoặc PO chấp thuận mở rộng phạm vi |

## 3.1. Luồng MVP tối thiểu phải chạy được

**Employee tạo Ticket → Agent nhận → Start Processing → Trao đổi → Resolve → Employee xác nhận → Closed**

# 4. Backlog chi tiết theo Epic

## EPIC 0 – Technical Foundation

Mục tiêu: tạo nền tảng dữ liệu, API và môi trường dùng chung để các feature sau không phải thay đổi cấu trúc liên tục.

| **Task** | **Nội dung** | **Phân loại** | **Người phụ trách** | **Ưu tiên** | **Estimate** |
| --- | --- | --- | --- | --- | --- |
| T0.1 | Thiết kế data model v1: ERD chuẩn cho các bảng User, Role, Ticket, Request Type, Comment, History và các relation chính | Database | **LocLD11** (Chính)  **PhanDV2** (Phối hợp duyệt ERD) | P0 | 1.0 PD |
| T0.2 | Setup khung dự án Backend (Spring Boot/NodeJS...), Frontend (React/Flutter...), cấu hình Database kết nối và biến môi trường chung | Base Setup | **PhanDV2** (Chính Setup FE)  **LocLD11** (Chính Setup BE) | P0 | 1.0 PD |
| T0.3 | Thiết lập hệ thống Database Migration (Flyway/Liquibase) và baseline schema khởi tạo database | Database | **LocLD11** (Chính) | P0 | 0.75 PD |
| T0.4 | Thống nhất API convention, cấu trúc JSON Response chuẩn, định nghĩa mã lỗi (Error Response) và quy tắc đặt tên (Naming) | Architecture | Cả hai cùng tham gia thống nhất | P0 | 0.75 PD |
| T0.5 | Thiết lập build pipeline và deploy cơ bản lên môi trường demo chung trên server | DevOps / Delivery | **PhanDV2** (Chính)  **LocLD11** (Hỗ trợ cấu hình) | P0 | 1.0 PD |

**Epic estimate: 4.5 PD**

## EPIC 1 – Authentication, Authorization & User Management

### US01 – Login

**User Story:** *As a user, I want to login to OpsFlow so that I can access functions appropriate to my role.*

**Business rules đã chốt**

* Mỗi tài khoản chỉ có một role: Employee, Support Agent hoặc Administrator.
* Không có public registration.
* Backend phải enforce permission; không chỉ ẩn nút ở frontend.

**Acceptance Criteria**

1. Nhóm Chức năng (Functional/Happy Path)

* Kịch bản 1: Đăng nhập thành công và điều hướng theo Role
  + Given: Người dùng có tài khoản hợp lệ đang hoạt động.
  + When: Nhập đúng Username và Password rồi submit.
  + Then: Hệ thống cấp authentication session/token VÀ điều hướng người dùng vào màn hình tương ứng với role của họ: Employee vào My Tickets, Support Agent vào Support Queue, Administrator vào Dashboard/User Management.
* Kịch bản 2: Ngăn chặn truy cập sai Role (Backend Enforce Permission)
  + Given: Người dùng đã đăng nhập và có token hợp lệ.
  + When: Cố tình gọi API (ví dụ qua Postman) hoặc truy cập URL không thuộc thẩm quyền của role hiện tại (truy cập sai role).
  + Then: Backend phát hiện sai role, bắt buộc từ chối thao tác (trả mã 403/401) VÀ frontend (protected route) tự động đẩy người dùng về trang chủ của họ.

2. Nhóm Lỗi và Ngoại lệ (Negative/Error)

* Kịch bản 3: Nhập sai thông tin đăng nhập
  + Given: Người dùng đang ở màn hình Login.
  + When: Nhập sai Username, sai Password hoặc cả hai.
  + Then: Hệ thống từ chối truy cập VÀ hiển thị thông báo lỗi chung (Ví dụ: "Tên đăng nhập hoặc mật khẩu không chính xác") để tránh lộ thông tin.
* Kịch bản 4: Tài khoản bị khóa (Account Locked)
  + Given: Người dùng nhập đúng Username và Password của một tài khoản đang bị khóa (account locked).
  + When: Người dùng submit đăng nhập.
  + Then: Hệ thống từ chối truy cập VÀ thông báo rõ tài khoản đã bị khóa.
* Kịch bản 5: Hết hạn Access Token nhưng Refresh Token còn hạn (Seamless Refresh)
  + Given: Access Token của người dùng đã hết hạn, nhưng Refresh Token trong trình duyệt/ứng dụng vẫn còn hợp lệ.
  + When: Người dùng thực hiện một thao tác gọi API hoặc chuyển trang.
  + Then: Frontend tự động sử dụng Refresh Token để gọi API cấp lại Access Token mới (chạy ngầm). Người dùng tiếp tục sử dụng hệ thống bình thường, không bị gián đoạn hay văng ra màn hình Login.
* Kịch bản 6: Hết hạn cả Access Token và Refresh Token (Session Expired)
* Given: Cả Access Token và Refresh Token của người dùng đều đã hết hạn (hoặc Refresh Token bị thu hồi trên hệ thống).
* When: Người dùng thực hiện một thao tác gọi API hoặc chuyển trang.
* Then: API từ chối VÀ Frontend tự động xóa toàn bộ session hiện tại, thông báo phiên đăng nhập hết hạn, và điều hướng người dùng quay lại màn hình Login.

3. Nhóm Biên và Giới hạn (Boundary/Data Constraints)

* Quy tắc 3.1 - Giới hạn Role: Mỗi tài khoản hệ thống chỉ được phép có đúng một role duy nhất (Employee, Support Agent, hoặc Administrator).
* Quy tắc 3.2 - Nguồn tài khoản: Không có tính năng tự đăng ký (public registration) trên giao diện.
* Quy tắc 3.3 - Bảo mật lưu trữ: Mật khẩu lưu trữ bắt buộc phải được mã hóa (password hashing), tuyệt đối không lưu plain text.
* Quy tắc 3.4 - Xử lý chuỗi: Tự động cắt khoảng trắng (trim) ở đầu/cuối của Username khi submit. Password bắt buộc phân biệt chữ hoa/chữ thường (case-sensitive).

4. Nhóm Hiệu năng và Giao diện (UI/UX)

* Quy tắc 4.1 - Masking & Toggle: Ô nhập Password tự động che giấu ký tự (•••) VÀ có icon "Show/Hide" để xem/ẩn mật khẩu.
* Quy tắc 4.2 - Bắt lỗi bỏ trống (Empty state): Nếu người dùng bấm Login mà bỏ trống ô Username hoặc Password, frontend bôi đỏ ô đó và hiển thị text "Vui lòng nhập trường này" mà không gọi API.
* Quy tắc 4.3 - Thao tác phím: Hỗ trợ submit form đăng nhập bằng phím Enter.
* Quy tắc 4.4 - Trạng thái Loading: Khi submit, nút Đăng nhập chuyển sang trạng thái loading và bị disable để ngăn người dùng click liên tục gửi nhiều request.

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Task** | **Nội dung** | **Phân loại** | **Người phụ trách** | **Ưu tiên** | **Estimate** |
| T1.1 | Xây dựng User/Role/Account Status model | Database | **LocLD11** (Chính) | P0 | 0.5 PD |
| T1.2 | Viết API POST /login, xử lý mã hóa mật khẩu (Password Hashing), cơ chế cấp phát Session/Token (JWT) và bảo mật thông tin trả về | API / Security | **LocLD11** (Chính) | P0 | 1.5 PD |
| T1.3 | Dựng giao diện form Login (Input, Validation, Show/Hide Password), xử lý trạng thái Loading chống duplicate submit và thiết lập Protected Route điều hướng theo Role ở Frontend | UI / Routing | **PhanDV2** (Chính UI)  **LocLD11** (Hỗ trợ cấu hình luồng Auth Guard) | P0 | 1.0 PD |
| T1.4 | Viết Unit Test cho thuật toán hash, thực thi Postman Test kiểm tra các case (Đăng nhập đúng/sai, tài khoản bị khóa, chặn 403 khi cố truy cập trái phép) và test giao diện | Test / QA | Cả hai cùng thực thi (Review chéo) | P0 | 0.5 PD |

**Subtotal: 3.5 PD**

### US02 – Admin quản lý tài khoản

**User Story:** *As an Administrator, I want to manage user accounts and roles so that only authorized users can access OpsFlow.*

**Business rules đã chốt**

* Admin tạo, khóa/mở khóa và quản lý role.
* Không delete account đã có lịch sử.
* Không được khóa/hạ quyền Administrator cuối cùng đang hoạt động.
* Agent đang có ticket mở cần được xử lý assignment trước khi khóa/đổi role.

| **Task** | **Nội dung** | **Ưu tiên** | **Estimate** |
| --- | --- | --- | --- |
| T1.5 | API list/create/update account và role | P0 | 1.0 PD |
| T1.6 | UI User Management | P0 | 0.75 PD |
| T1.7 | Rule khóa Agent còn Ticket đang mở | P0 | 0.5 PD |
| T1.8 | Rule bảo vệ Administrator cuối cùng | P0 | 0.25 PD |

**Subtotal: 2.5 PD**

**Acceptance Criteria**

1. Nhóm Chức năng (Functional/Happy Path)

* **Kịch bản 1.1: Tạo tài khoản mới**
  + **Given:** Quản trị viên (Admin) đang ở màn hình Quản lý tài khoản (User Management).
  + **When:** Điền đầy đủ thông tin hợp lệ (Tên, Username/Email, Mật khẩu mặc định) và chọn Role, sau đó bấm Lưu.
  + **Then:** Hệ thống tạo tài khoản mới thành công với trạng thái mặc định là "Hoạt động" (Active) VÀ tài khoản này lập tức có thể đăng nhập.
* **Kịch bản 1.2: Khóa / Mở khóa tài khoản**
  + **Given:** Admin chọn một tài khoản bình thường (Employee hoặc Agent không vướng ticket) đang ở trạng thái Active/Locked.
  + **When:** Thực hiện thao tác Khóa (Lock/Deactivate) hoặc Mở khóa (Unlock/Activate).
  + **Then:** Trạng thái tài khoản được cập nhật tương ứng VÀ (nếu bị khóa) token hiện tại của user đó sẽ bị vô hiệu hóa ngay lập tức.
* **Kịch bản 1.3: Thay đổi Role (Phân quyền)**
  + **Given:** Admin chọn một tài khoản hợp lệ.
  + **When:** Thay đổi Role của user đó (Ví dụ: từ Employee lên Agent) và Lưu.
  + **Then:** Hệ thống cập nhật Role mới VÀ áp dụng bộ quyền (Permission) mới cho tài khoản này ở lần thao tác tiếp theo.

2. Nhóm Lỗi và Ngoại lệ (Negative/Error)

* **Kịch bản 2.1: Chặn Khóa/Đổi Role của Agent đang có Ticket mở (Rule T1.7)**
  + **Given:** Một tài khoản Agent đang được gán (Assign) xử lý các Ticket ở trạng thái NEW, IN\_PROGRESS, hoặc WAITING\_FOR\_EMPLOYEE.
  + **When:** Admin cố gắng Khóa tài khoản HOẶC hạ quyền/đổi Role của Agent này sang Employee.
  + **Then:** Hệ thống từ chối thao tác VÀ hiển thị cảnh báo chặn: "Agent đang có ticket mở cần được xử lý assignment trước khi khóa/đổi role." (Bắt buộc Admin phải Reassign ticket cho người khác trước).
* **Kịch bản 2.2: Bảo vệ Admin cuối cùng**
  + **Given:** Hệ thống hiện tại chỉ còn duy nhất 01 tài khoản mang Role Administrator đang ở trạng thái Hoạt động.
  + **When:** Chính Admin đó (hoặc qua API) cố gắng Khóa tài khoản này HOẶC hạ quyền (đổi Role) xuống Agent/Employee.
  + **Then:** Hệ thống từ chối thao tác VÀ thông báo: "Không được khóa hoặc hạ quyền Administrator cuối cùng đang hoạt động."
* **Kịch bản 2.3: Tạo trùng Username/Email**
  + **Given:** Trong Database đã tồn tại Username là nguyenvana.
  + **When:** Admin tạo một tài khoản mới cũng dùng Username nguyenvana.
  + **Then:** Hệ thống báo lỗi "Username/Email đã tồn tại, vui lòng chọn tên khác" VÀ không tạo mới tài khoản.

3. Nhóm Biên và Giới hạn (Boundary/Data Constraints)

* **Quy tắc 3.1 - Không xóa cứng (No Hard Delete):** Giao diện và API tuyệt đối không cung cấp tính năng/nút "Xóa" (Delete) vì không được delete account đã có lịch sử làm việc. Tài khoản không dùng nữa chỉ được phép Khóa (Deactivate).
* **Quy tắc 3.2 - Thẩm quyền truy cập:** Chỉ có tài khoản mang Role Administrator mới được phép gọi các API list/create/update account và role. Các role khác truy cập sẽ bị trả về lỗi 403 Forbidden.
* **Quy tắc 3.3 - Dữ liệu bắt buộc:** Khi tạo hoặc chỉnh sửa User, các trường Tên hiển thị, Username, và Role là bắt buộc nhập.

4. Nhóm Hiệu năng và Giao diện (UI/UX)

* **Quy tắc 4.1 - Phân biệt trực quan:** Trên danh sách User, cột Trạng thái (Status) và Role phải có màu sắc phân biệt rõ ràng (Ví dụ: Active = Xanh lá, Locked = Xám/Đỏ).
* **Quy tắc 4.2 - Xác nhận thao tác nhạy cảm:** Mọi thao tác đổi Role hoặc Khóa tài khoản đều phải hiển thị một hộp thoại xác nhận (Confirm Dialog) hỏi lại Admin (VD: "Bạn có chắc chắn muốn khóa tài khoản này không?") trước khi thực thi.
* **Quy tắc 4.3 - Bảng phân trang:** Danh sách người dùng (UI User Management) phải được phân trang để tránh tải dữ liệu quá chậm khi số lượng User lớn.

## EPIC 2 – Request Type Administration

### US03 – Quản lý Request Type

**User Story:** *As an Administrator, I want to maintain request types so that Employees can classify support requests.*

**Business rules đã chốt**

* MVP quản lý Request Type/Category tối thiểu cần để vận hành.
* Không xây Department Management vì PO đã chốt không có Affected User/Department trong MVP.

**Quy ước triển khai MVP:**

* Request Type có trạng thái ACTIVE hoặc INACTIVE.
* Administrator được list, create, update, activate và deactivate Request Type.
* Employee chỉ được chọn Request Type đang ACTIVE khi tạo mới hoặc chỉnh sửa Ticket.
* Khi một Request Type chuyển sang INACTIVE, các Ticket đã sử dụng Request Type đó vẫn giữ và hiển thị Request Type cũ để bảo toàn lịch sử.
* MVP ưu tiên deactivate thay vì xóa cứng Request Type đã được sử dụng.

| **Task** | **Nội dung** | **Ưu tiên** | **Estimate** |
| --- | --- | --- | --- |
| T2.1 | Request Type model + API list/create/update/activate/deactivate; chỉ Request Type ACTIVE được dùng cho thao tác tạo/sửa Ticket | P1 | 0.75 PD |
| T2.2 | Admin UI quản lý Request Type | P1 | 0.5 PD |
| T2.3 | Validation, permission và test Request Type ACTIVE/INACTIVE, đảm bảo Ticket cũ vẫn giữ được Request Type đã sử dụng | P1 | 0.25 PD |

**Subtotal: 1.5 PD**

**Acceptance Criteria**

1. Nhóm Chức năng (Functional/Happy Path)

* **Kịch bản 1.1: Xem danh sách Request Type**
  + **Given:** Quản trị viên (Admin) truy cập vào màn hình Quản lý Request Type.
  + **When:** Màn hình được tải.
  + **Then:** Hiển thị danh sách tất cả các phân loại sự cố (Request Type) hiện có trên hệ thống, bao gồm Tên, Mô tả (nếu có), và Trạng thái (Hoạt động / Ngừng hoạt động).
* **Kịch bản 1.2: Tạo mới Request Type**
  + **Given:** Admin đang ở màn hình Quản lý Request Type.
  + **When:** Bấm "Thêm mới", nhập Tên Request Type (Ví dụ: "Hỗ trợ Phần mềm") và bấm Lưu.
  + **Then:** Hệ thống tạo thành công Request Type với trạng thái mặc định là "Hoạt động" (Active) VÀ Request Type này lập tức xuất hiện trong danh sách chọn của Employee khi tạo Ticket.
* **Kịch bản 1.3: Chỉnh sửa Request Type**
  + **Given:** Admin chọn một Request Type bất kỳ trong danh sách.
  + **When:** Sửa đổi tên hoặc mô tả và bấm Lưu.
  + **Then:** Hệ thống cập nhật thông tin mới VÀ tên mới được phản ánh trên các Ticket đang sử dụng phân loại này.
* **Kịch bản 1.4: Vô hiệu hóa / Kích hoạt lại (Activate/Deactivate)**
  + **Given:** Admin chọn một Request Type.
  + **When:** Bấm đổi trạng thái từ Hoạt động sang Ngừng hoạt động (Deactivate) hoặc ngược lại (Activate).
  + **Then:** Hệ thống cập nhật trạng thái thành công. Nếu bị Ngừng hoạt động, Employee sẽ không thấy Request Type này khi tạo Ticket mới, nhưng các Ticket cũ đã dùng phân loại này vẫn hiển thị bình thường.

2. Nhóm Lỗi và Ngoại lệ (Negative/Error Scenarios)

* **Kịch bản 2.1: Bỏ trống tên Request Type**
  + **Given:** Admin mở form Tạo mới hoặc Chỉnh sửa Request Type.
  + **When:** Bỏ trống trường "Tên phân loại" và bấm Lưu.
  + **Then:** Hệ thống chặn thao tác VÀ báo lỗi "Tên Request Type không được để trống".
* **Kịch bản 2.2: Tạo trùng tên Request Type**
  + **Given:** Trong hệ thống đã tồn tại Request Type tên là "Lỗi Mạng".
  + **When:** Admin tạo mới hoặc sửa một Request Type khác thành "Lỗi Mạng".
  + **Then:** Hệ thống chặn thao tác VÀ báo lỗi "Tên phân loại này đã tồn tại, vui lòng chọn tên khác".
* **Kịch bản 2.3: Xóa Request Type đã có dữ liệu (Ràng buộc toàn vẹn)**
  + **Given:** Admin chọn một Request Type đang được sử dụng bởi một hoặc nhiều Ticket cũ.
  + **When:** Admin tìm cách bấm nút Xóa cứng (Delete - nếu có hiển thị).
  + **Then:** Hệ thống phải chặn thao tác Xóa (hoặc chỉ cho phép Deactivate) để bảo vệ lịch sử dữ liệu của Ticket.

3. Nhóm Biên và Giới hạn (Boundary/Data Constraints)

* **Quy tắc 3.1 - Giới hạn phạm vi (MVP Scope):** Tính năng này chỉ quản lý danh mục phân loại sự cố cốt lõi (Request Type/Category). Tuyệt đối không bao gồm chức năng quản lý Phòng ban (Department Management) hoặc Affected User.
* **Quy tắc 3.2 - Thẩm quyền truy cập:** Chỉ duy nhất Role Administrator mới có quyền thao tác (CRUD/activate/deactivate) trên danh mục này. Employee và Agent chỉ có quyền sử dụng (Read-only khi tạo/view Ticket).

4. Nhóm Hiệu năng và Giao diện (Non-Functional/UI/UX)

* **Quy tắc 4.1 - Sắp xếp hiển thị:** Trong form tạo Ticket của Employee, danh sách các Request Type (đang Active) nên được sắp xếp theo thứ tự Alphabet (A-Z) để dễ tìm kiếm.
* **Quy tắc 4.2 - Cảnh báo thay đổi:** Khi thao tác Ngừng hoạt động (Deactivate) một Request Type, hệ thống nên hiển thị popup hỏi lại: "Bạn có chắc chắn muốn ngừng hoạt động phân loại này? Người dùng sẽ không thể chọn nó khi tạo yêu cầu mới."

## EPIC 3 – Create Ticket & Priority

### US04 – Employee tạo Ticket

**User Story:** *As an Employee, I want to create an IT support Ticket so that the IT Support team can handle my problem.*

**Business rules đã chốt**

* Chỉ Employee được tạo ticket; không có tạo hộ.
* Ticket ghi nhận code, creator/owner, title, description, request type, impact, urgency, priority, status và created time.
* Ticket mới có Status = NEW.

| **Task** | **Nội dung** | **Phân loại** | **Người đảm nhận** | **Ưu tiên** | **Estimate** |
| --- | --- | --- | --- | --- | --- |
| T3.1 | Xây dựng Ticket Model, định nghĩa các thuộc tính cơ bản (Ticket Code unique, Title, Description, Status, Request Type, Impact, Urgency, Priority, Creator, Assignee, Created Time), thiết lập quan hệ (Relation) với User và viết file Database Migration. | Database / API | **PhanDV2** (Chính thiết kế model Ticket)  **LocLD11** (Phối hợp duyệt schema & Migration) | P0 | 1.0 PD |
| T3.2 | Implement Impact/Urgency và Priority Matrix P1–P4 |  |  | P0 | 1.0 PD |
| T3.3 | Create Ticket API + validation + chỉ Employee được tạo |  |  | P0 | 0.75 PD |
| T3.4 | Create Ticket UI |  |  | P0 | 1.0 PD |
| T3.5 | Test Priority Matrix và Create Ticket |  |  | P0 | 0.75 PD |

**Subtotal: 4.5 PD**

|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Priority Matrix**   |  |  |  |  | | --- | --- | --- | --- | |  | Impact High | Impact Medium | Impact Low | | Urgency High | P1 | P2 | P3 | | Urgency Medium | P2 | P3 | P4 | | Urgency Low | P3 | P4 | P4 | |

**Acceptance Criteria**

1. Nhóm Chức năng (Functional/Happy Path)

* **Kịch bản 1.1: Employee tạo Ticket thành công**
  + **Given:** Người dùng đăng nhập với role Employee và truy cập màn hình "Tạo Yêu Cầu".
  + **When:** Nhập/chọn đầy đủ các thông tin hợp lệ gồm: Tiêu đề (Title), Mô tả (Description), Phân loại (Request Type), Mức độ ảnh hưởng (Impact) và Mức độ khẩn cấp (Urgency), sau đó bấm "Gửi".
  + **Then:** Hệ thống lưu Ticket vào database VÀ thông báo tạo thành công. Ticket tự động được chuyển về màn hình "My Tickets" của Employee.
* **Kịch bản 1.2: Ghi nhận thông tin hệ thống tự động (System-generated fields)**
  + **Given:** Một Ticket vừa được tạo thành công bởi Employee.
  + **When:** Truy vấn thông tin chi tiết của Ticket đó.
  + **Then:** Hệ thống phải tự động gán chính xác các trường sau:
    - **Creator/Owner:** User ID của Employee vừa tạo.
    - **Created Time:** Thời gian thực tế lúc submit (Timestamp).
    - **Status:** Bắt buộc là NEW.
    - **Ticket Code:** Mã định danh duy nhất (Unique Ticket Code) (Ví dụ: TKT-1001).
    - **Assignee:** Trống (Unassigned).
* **Kịch bản 1.3: Tự động tính toán Độ ưu tiên (Priority Matrix P1-P4)**
  + **Given:** Hệ thống có ma trận quy định Priority dựa trên Impact và Urgency.
  + **When:** Employee chọn các tổ hợp Impact và Urgency khác nhau.
  + **Then:** Hệ thống *tự động nội suy* và gắn Priority tương ứng cho Ticket mà không cho phép người dùng tự chọn Priority trực tiếp. (Chi tiết theo test case ở phần 3).

2. Nhóm Lỗi và Ngoại lệ (Negative/Error Scenarios)

* **Kịch bản 2.1: Bỏ trống các trường bắt buộc**
  + **Given:** Employee đang ở màn hình tạo Ticket.
  + **When:** Bỏ trống một hoặc nhiều trường: Title, Description, Request Type, Impact, Urgency và submit.
  + **Then:** Hệ thống chặn submit VÀ bôi đỏ các trường bị thiếu kèm thông báo "Vui lòng nhập/chọn thông tin này".
* **Kịch bản 2.2: Ngăn chặn truy cập sai Role (Không có tạo hộ)**
  + **Given:** Người dùng đang đăng nhập với role là Support Agent hoặc Administrator.
  + **When:** Cố tình gọi trực tiếp API Create Ticket (qua Postman) HOẶC truy cập URL trang tạo Ticket.
  + **Then:** Hệ thống (Backend và Frontend) từ chối thao tác VÀ trả lỗi 403 Forbidden. Business rule chốt: "Chỉ Employee được tạo ticket; không có tạo hộ."
* **Kịch bản 2.3: Payload chứa mã nhúng (XSS / SQL Injection)**
  + **Given:** Employee nhập vào ô Tiêu đề hoặc Mô tả các chuỗi mã độc (VD: <script>alert(1)</script>).
  + **When:** Submit form.
  + **Then:** Hệ thống mã hóa (sanitize) dữ liệu đầu vào an toàn trước khi lưu xuống Database, đảm bảo khi hiển thị lại không thực thi mã độc.

3. Nhóm Biên và Giới hạn (Boundary/Data Constraints)

* **Quy tắc 3.1 - Test Case Ma trận Priority (T3.2 & T3.5):** Bắt buộc vượt qua 9 tổ hợp tính toán sau:
  + Impact **High** + Urgency **High** ➔ Priority = **P1**
  + Impact **High** + Urgency **Medium** ➔ Priority = **P2**
  + Impact **High** + Urgency **Low** ➔ Priority = **P3**
  + Impact **Medium** + Urgency **High** ➔ Priority = **P2**
  + Impact **Medium** + Urgency **Medium** ➔ Priority = **P3**
  + Impact **Medium** + Urgency **Low** ➔ Priority = **P4**
  + Impact **Low** + Urgency **High** ➔ Priority = **P3**
  + Impact **Low** + Urgency **Medium** ➔ Priority = **P4**
  + Impact **Low** + Urgency **Low** ➔ Priority = **P4**
* **Quy tắc 3.2 - Không ghi đè Priority:** API tuyệt đối không nhận trường priority từ payload gửi lên của Frontend. Priority phải được tính toán và gán bởi logic ở Backend.
* **Quy tắc 3.3 - Độ dài Text:**
  + Title: Tối thiểu 5 ký tự, tối đa 255 ký tự.
  + Description: Tối thiểu 10 ký tự, tối đa 5000 ký tự.

4. Nhóm Hiệu năng và Giao diện (Non-Functional/UI/UX)

* **Quy tắc 4.1 - Ngăn Duplicate Submit:** Nút "Gửi yêu cầu" phải chuyển sang trạng thái Loading và bị vô hiệu hóa (disabled) ngay lập tức sau cú click đầu tiên để tránh tạo ra 2 ticket trùng lặp do user bấm đúp.
* **Quy tắc 4.2 - Dữ liệu Request Type:** Dropdown chọn "Phân loại (Request Type)" chỉ được load những danh mục đang có trạng thái Hoạt động (Active).
* **Quy tắc 4.3 - Giao diện giải thích Matrix:** Dưới dropdown chọn Impact và Urgency nên có một tooltip nhỏ hoặc text ghi chú hiển thị kết quả Priority dự kiến để Employee hiểu mức độ ưu tiên của vé mình sắp tạo.

### US05 – Agent/Admin điều chỉnh Impact/Urgency

**User Story:** *As an assigned Support Agent or Administrator, I want to adjust Impact and Urgency when the actual effect of a Ticket is clarified so that Priority reflects the current business impact.*
**Business rules đã chốt:**
Impact:
 • High: từ 50 người trở lên bị ảnh hưởng hoặc dịch vụ dùng chung toàn công ty bị gián đoạn.
 • Medium: từ 2–49 người bị ảnh hưởng và không thuộc mức High.
 • Low: một người bị ảnh hưởng và không thuộc mức High.
Urgency:
 • High: công việc bị chặn hoàn toàn, không có giải pháp tạm.
 • Medium: vẫn làm được một phần hoặc có giải pháp tạm nhưng gây bất tiện đáng kể.
 • Low: yêu cầu theo kế hoạch hoặc chưa cản trở công việc hiện tại.
Agent phụ trách hoặc Administrator được điều chỉnh Impact/Urgency khi Ticket ở NEW, IN\_PROGRESS hoặc WAITING\_FOR\_EMPLOYEE.

Mỗi lần điều chỉnh:
• Bắt buộc nhập lý do.
• Lưu before/after, actor và timestamp vào History.
• Hệ thống tự tính lại Priority theo Priority Matrix.
• Không cho phép sửa Priority trực tiếp.

|  |  |  |  |
| --- | --- | --- | --- |
| **Task** | **Nội dung** | **Ưu tiên** | **Estimate** |
| T3.6 | Implement API/business rule cho Agent phụ trách/Admin điều chỉnh Impact/Urgency + reason + permission + recalculated Priority + Audit Event | P0 | 0.5 PD |
| T3.7 | UI điều chỉnh Impact/Urgency, hiển thị Calculated Priority và validation theo status/permission | P0 | 0.5 PD |

**Subtotal: 1.0 PD**

**Epic estimate: 5.5 PD**

## EPIC 4 – Employee Ticket Management

### US06 – My Tickets & Ticket Detail

**User Story:** *As an Employee, I want to view my Tickets so that I can follow their progress.*

**Business rules đã chốt**

* Employee chỉ xem ticket do mình tạo và public data được phép xem.

| **Task** | **Nội dung** | **Ưu tiên** | **Estimate** |
| --- | --- | --- | --- |
| T4.1 | API My Tickets + Ticket Detail với ownership permission | P0 | 0.5 PD |
| T4.2 | UI My Tickets + Ticket Detail | P0 | 0.5 PD |

**Subtotal: 1.0 PD**

**Acceptance Criteria**

1. Nhóm Chức năng (Functional/Happy Path)

* **Kịch bản 1.1: Xem danh sách yêu cầu cá nhân (My Tickets)**
  + **Given:** Người dùng đang đăng nhập với role Employee.
  + **When:** Truy cập vào menu hoặc màn hình "My Tickets".
  + **Then:** Hệ thống gọi API danh sách và trả về toàn bộ các Ticket do chính Employee này tạo ra, hiển thị các thông tin tóm tắt (Ticket Code, Tiêu đề, Trạng thái, Độ ưu tiên, Ngày tạo).
* **Kịch bản 1.2: Xem chi tiết yêu cầu (Ticket Detail)**
  + **Given:** Employee đang ở màn hình danh sách "My Tickets".
  + **When:** Click vào một Ticket bất kỳ trong danh sách.
  + **Then:** Hệ thống điều hướng sang màn hình Chi tiết Ticket VÀ hiển thị đầy đủ các public data được phép xem (bao gồm: Tiêu đề, Mô tả ban đầu, Trạng thái hiện tại, Người phụ trách/Assignee, và Lịch sử trao đổi/Public Comment).

2. Nhóm Lỗi và Ngoại lệ (Negative/Error Scenarios)

* **Kịch bản 2.1: Truy cập trái phép Ticket của người khác**
  + **Given:** Một Employee tên A đang đăng nhập hợp lệ.
  + **When:** Employee A cố tình nhập ID/URL của một Ticket do Employee B tạo (hoặc dùng Postman để gọi API detail của Ticket đó).
  + **Then:** API của Backend phát hiện sai quyền sở hữu lập tức từ chối truy cập, trả về mã lỗi 404 Not Found (để ẩn sự tồn tại của Ticket).
* **Kịch bản 2.2: Ngăn chặn rò rỉ dữ liệu nội bộ (Internal Data Leakage)**
  + **Given:** Ticket do Employee tạo đang được Agent xử lý và có chứa các ghi chú nội bộ (Internal Notes).
  + **When:** Employee gọi API lấy chi tiết Ticket (Ticket Detail).
  + **Then:** Hệ thống chỉ trả về các public data được phép xem. Các bình luận đánh dấu là Internal Note tuyệt đối không được xuất hiện trong response của API này.
* **Kịch bản 2.3: Truy cập Ticket không tồn tại**
  + **Given:** Employee đang đăng nhập hợp lệ.
  + **When:** Nhập một Ticket Code không tồn tại trên hệ thống vào URL (Ví dụ: TKT-999999).
  + **Then:** Hệ thống hiển thị màn hình báo lỗi "Không tìm thấy Yêu cầu hỗ trợ" (404 Not Found) kèm nút quay lại danh sách.

3. Nhóm Biên và Giới hạn (Boundary/Data Constraints)

* **Quy tắc 3.1 - Lọc dữ liệu tuyệt đối (Ownership Rule):** API My Tickets không bao giờ nhận tham số user\_id từ Frontend gửi lên để query, mà bắt buộc phải trích xuất user\_id từ chính Token đăng nhập (Context/Session) để đảm bảo Employee chỉ xem ticket do mình tạo.
* **Quy tắc 3.2 - Phân trang mặc định:** Nếu số lượng Ticket của Employee quá lớn, danh sách trả về phải được phân trang (Ví dụ: mặc định 20 ticket/trang), kèm theo tổng số ticket (total count) hợp lệ thuộc sở hữu của họ.

4. Nhóm Hiệu năng và Giao diện (Non-Functional/UI/UX)

* **Quy tắc 4.1 - Trạng thái rỗng (Empty State):** Nếu Employee chưa từng tạo Ticket nào, màn hình "My Tickets" không hiển thị bảng trống hay báo lỗi, mà phải hiển thị minh họa UI "Bạn chưa có yêu cầu hỗ trợ nào" kèm theo một nút Call-to-Action "Tạo Ticket mới".
* **Quy tắc 4.2 - Dấu hiệu nhận biết Trạng thái (Visual Status):** Các nhãn trạng thái (Status: NEW, IN\_PROGRESS, RESOLVED...) và Độ ưu tiên (Priority: P1, P2...) phải được thiết kế dưới dạng Badge (thẻ màu) phân biệt rõ ràng để người dùng lướt nhanh tiến độ (Ví dụ: NEW = Xanh dương, RESOLVED = Xanh lá).

### US07 – Edit Ticket khi còn NEW

**User Story:** *As an Employee, I want to correct ticket information before processing starts so that the Support Agent receives accurate information.*

**Business rules đã chốt**

* Employee được sửa Title, Description, Request Type, Impact, Urgency khi ticket còn NEW, kể cả đã assign.
* Khi ticket rời NEW, thông tin bổ sung phải gửi bằng Public Comment.
* Mọi thay đổi field nghiệp vụ phải lưu before/after, actor, time.

| **Task** | **Nội dung** | **Ưu tiên** | **Estimate** |
| --- | --- | --- | --- |
| T4.3 | Edit Ticket API + kiểm tra status/owner | P0 | 0.75 PD |
| T4.4 | Recalculate Priority khi Impact/Urgency đổi | P0 | 0.25 PD |
| T4.5 | Edit Ticket UI + disable action khi không hợp lệ | P0 | 0.5 PD |

**Subtotal: 1.5 PD**

**Acceptance Criteria**

1. Nhóm Chức năng (Functional/Happy Path)

* **Kịch bản 1.1: Chỉnh sửa Ticket thành công**
  + **Given:** Employee đang ở màn hình Chi tiết Ticket do mình tạo, và Ticket đang ở trạng thái NEW.
  + **When:** Thay đổi một hoặc nhiều thông tin cho phép (Title, Description, Request Type, Impact, Urgency) rồi bấm "Lưu".
  + **Then:** Hệ thống cập nhật thành công thông tin mới lên giao diện.
* **Kịch bản 1.2: Tự động tính lại Độ ưu tiên (Priority Recalculation)**
  + **Given:** Employee đang chỉnh sửa Ticket ở trạng thái NEW.
  + **When:** Employee thay đổi giá trị của Mức độ ảnh hưởng (Impact) hoặc Mức độ khẩn cấp (Urgency).
  + **Then:** Backend tự động tính toán lại và cập nhật Priority (P1-P4) mới tương ứng với ma trận.
* **Kịch bản 1.3: Chỉnh sửa khi Ticket đã có người nhận (Assigned but NEW)**
  + **Given:** Ticket đang ở trạng thái NEW nhưng ĐÃ CÓ Agent nhấn nút "Take" (tức là đã có Assignee).
  + **When:** Employee thực hiện chỉnh sửa thông tin và Lưu.
  + **Then:** Hệ thống vẫn cho phép cập nhật bình thường vì điều kiện chốt là "khi ticket còn NEW, kể cả đã assign".
* **Kịch bản 1.4: Lưu vết lịch sử thay đổi (Audit Logging)**
  + **Given:** Employee vừa lưu thành công thay đổi trên Ticket.
  + **When:** Hệ thống ghi nhận vào Database.
  + **Then:** Mọi field nghiệp vụ bị thay đổi bắt buộc phải được lưu lại lịch sử, bao gồm: giá trị cũ (before), giá trị mới (after), người thực hiện (actor), và thời gian sửa (time).

2. Nhóm Lỗi và Ngoại lệ (Negative/Error Scenarios)

* **Kịch bản 2.1: Chặn chỉnh sửa khi Ticket không còn là NEW**
  + **Given:** Ticket đã chuyển sang trạng thái khác (VD: IN\_PROGRESS, WAITING\_FOR\_EMPLOYEE...).
  + **When:** Employee cố tình gọi API Edit (qua Postman hoặc Bypass UI) để sửa Title, Description.
  + **Then:** Backend bắt buộc từ chối thao tác, trả về mã lỗi 403/400 kèm thông báo: "Chỉ được sửa yêu cầu khi ở trạng thái Mới. Vui lòng gửi thông tin bổ sung qua phần Bình luận".
* **Kịch bản 2.2: Chặn chỉnh sửa Ticket của người khác (Ownership Check)**
  + **Given:** Một Employee đang có Token hợp lệ.
  + **When:** Cố tình gọi API Edit truyền vào ID của một Ticket (đang NEW) do Employee khác tạo.
  + **Then:** Backend phát hiện sai quyền sở hữu (owner check) VÀ lập tức từ chối truy cập (HTTP 403).
* **Kịch bản 2.3: Bỏ trống các trường bắt buộc khi Edit**
  + **Given:** Employee đang trong form chỉnh sửa Ticket NEW.
  + **When:** Xóa trắng ô Tiêu đề hoặc Mô tả rồi bấm Lưu.
  + **Then:** Hệ thống chặn submit VÀ báo lỗi "Không được để trống trường này" (áp dụng validation giống hệt lúc Create Ticket).

3. Nhóm Biên và Giới hạn (Boundary/Data Constraints)

* **Quy tắc 3.1 - Các trường được phép chỉnh sửa:** API Update của Employee chỉ chấp nhận thay đổi 5 trường: Title, Description, Request Type, Impact, Urgency. Tuyệt đối không cho phép gửi lên trường priority, status, hay assignee để tránh lỗ hổng bảo mật ghi đè dữ liệu.
* **Quy tắc 3.2 - Nguyên tắc Transaction:** Việc cập nhật dữ liệu Ticket mới và ghi log lịch sử (History) phải được bọc trong cùng một Database Transaction. Nếu ghi log thất bại thì việc cập nhật Ticket cũng phải bị rollback.

4. Nhóm Hiệu năng và Giao diện (UI/UX)

* **Quy tắc 4.1 - Ẩn/Hiện nút Edit theo trạng thái:** Giao diện Frontend phải kiểm tra Status của Ticket. Nếu Status == NEW, hiển thị nút "Chỉnh sửa". Nếu Status != NEW, Frontend phải disable action hoặc ẩn hoàn toàn nút "Chỉnh sửa".
* **Quy tắc 4.2 - Gợi ý khi ẩn nút Edit:** Khi Ticket không còn ở NEW và nút Edit bị ẩn, nên có một tooltip hoặc dòng chữ mờ gần khu vực mô tả: "Yêu cầu đang được xử lý. Để bổ sung thông tin, vui lòng sử dụng phần Bình luận." (đúng business rule: thông tin bổ sung phải gửi bằng Public Comment).

### US08 – Cancel Ticket

**User Story:** *As a ticket owner, I want to cancel a ticket that no longer needs support so that the queue stays accurate.*

**Business rules đã chốt**

* Employee hoặc Admin có thể Cancel ở NEW, IN\_PROGRESS hoặc WAITING\_FOR\_EMPLOYEE.
* Cancel bắt buộc có lý do và lưu History.
* Không Cancel từ RESOLVED/CLOSED; không Delete Ticket trong MVP.

| **Task** | **Nội dung** | **Ưu tiên** | **Estimate** |
| --- | --- | --- | --- |
| T4.6 | Cancel business rule + reason + permission | P0 | 0.5 PD |
| T4.7 | UI Cancel + reason dialog | P0 | 0.5 PD |
| T4.8 | Test edit/cancel/permission/state | P0 | 0.5 PD |

**Subtotal: 1.5 PD**

**Epic estimate: 4.0 PD**

**Acceptance Criteria**

1. Nhóm Chức năng (Functional/Happy Path)

* **Kịch bản 1.1: Employee hủy yêu cầu của chính mình**
  + **Given:** Employee đang xem một Ticket do mình tạo, hiện đang ở một trong các trạng thái: NEW, IN\_PROGRESS, hoặc WAITING\_FOR\_EMPLOYEE.
  + **When:** Bấm chọn "Hủy yêu cầu", nhập lý do hợp lệ và xác nhận.
  + **Then:** Trạng thái Ticket chuyển sang CANCELLED VÀ mọi đồng hồ đo SLA lập tức dừng lại.
* **Kịch bản 1.2: Admin hủy yêu cầu**
  + **Given:** Quản trị viên (Admin) đang xem một Ticket bất kỳ trên hệ thống ở trạng thái hợp lệ (NEW, IN\_PROGRESS, WAITING\_FOR\_EMPLOYEE).
  + **When:** Bấm chọn "Hủy yêu cầu", nhập lý do hợp lệ và xác nhận.
  + **Then:** Ticket bị hủy thành công (chuyển sang CANCELLED).
* **Kịch bản 1.3: Ghi nhận lịch sử (Audit Logging)**
  + **Given:** Một Ticket vừa được hủy thành công.
  + **When:** Truy vấn lịch sử (History) của Ticket đó.
  + **Then:** Hệ thống bắt buộc phải lưu lại sự kiện thay đổi trạng thái, người thực hiện (Actor), thời gian VÀ lý do hủy chi tiết.

2. Nhóm Lỗi và Ngoại lệ (Negative/Error Scenarios)

* **Kịch bản 2.1: Chặn thao tác hủy khi sai trạng thái**
  + **Given:** Ticket đang ở trạng thái RESOLVED hoặc CLOSED.
  + **When:** Người dùng cố tình gọi API Cancel (thông qua Postman hoặc công cụ bên thứ ba).
  + **Then:** Backend từ chối thao tác VÀ trả về mã lỗi HTTP 400 kèm thông báo "Không thể hủy yêu cầu đã có giải pháp hoặc đã đóng".
* **Kịch bản 2.2: Bỏ trống lý do hủy**
  + **Given:** Form/Dialog hủy Ticket đang mở ra.
  + **When:** Người dùng để trống ô nhập "Lý do hủy" và bấm xác nhận.
  + **Then:** Hệ thống chặn thao tác, bôi đỏ ô nhập liệu VÀ hiển thị cảnh báo "Bắt buộc phải nhập lý do hủy".
* **Kịch bản 2.3: Agent bình thường không được phép hủy**
  + **Given:** Một Support Agent đang xem Ticket (không có quyền Admin và không phải người tạo Ticket).
  + **When:** Cố tình gọi API Cancel.
  + **Then:** Backend phát hiện sai thẩm quyền, từ chối thao tác VÀ trả về lỗi HTTP 403 (Forbidden).

3. Nhóm Biên và Giới hạn (Boundary/Data Constraints)

* **Quy tắc 3.1 - Tuyệt đối không xóa dữ liệu (No Delete):** Hệ thống không cung cấp chức năng Delete Ticket (xóa cứng khỏi Database) trong phiên bản MVP này, kể cả đối với Role Admin. Mọi Ticket không cần thiết đều chỉ được đổi trạng thái sang CANCELLED.
* **Quy tắc 3.2 - Trạng thái kết thúc (Terminal State):** CANCELLED là trạng thái đóng băng vĩnh viễn (terminal). Khi Ticket đã chuyển sang CANCELLED, hệ thống không cho phép bất kỳ thao tác nào khác (Re-open, Edit, hay Comment).
* **Quy tắc 3.3 - Độ dài lý do:** Lý do hủy phải chứa ít nhất 10 ký tự và tối đa 1000 ký tự để đảm bảo có đủ thông tin đối soát.

4. Nhóm Hiệu năng và Giao diện (Non-Functional/UI/UX)

* **Quy tắc 4.1 - Giao diện nhập lý do (Reason Dialog):** Thao tác hủy không được chuyển sang một trang mới mà phải mở ra một Dialog/Modal Pop-up ngay tại màn hình hiện tại để người dùng nhập lý do một cách thuận tiện.
* **Quy tắc 4.2 - Ẩn nút thao tác:** Giao diện Frontend (UI) bắt buộc phải ẩn hoàn toàn nút "Hủy yêu cầu" đối với các Ticket đang ở trạng thái RESOLVED hoặc CLOSED.

## EPIC 5 – Support Queue & Assignment

### US09 – Support Agent xem Support Queue

**User Story:** *As a Support Agent, I want to see the IT Support queue so that I can identify work that needs attention.*

**Business rules đã chốt**

* Agent được xem toàn bộ ticket của đội IT.
* Agent khác chủ yếu view-only; action cập nhật tuân theo permission của assignee/admin.

| **Task** | **Nội dung** | **Ưu tiên** | **Estimate** |
| --- | --- | --- | --- |
| T5.1 | Support Queue API và permission view toàn đội | P0 | 0.5 PD |
| T5.2 | Support Queue UI + All / Unassigned / Assigned to Me | P0 | 0.5 PD |

**Subtotal: 1.0 PD**

**Acceptance Criteria**

1. Nhóm Chức năng (Functional/Happy Path)

* **Kịch bản 1.1: Xem toàn bộ hàng đợi (All Tickets)**
  + **Given:** Người dùng đăng nhập với Role Support Agent (hoặc Admin) và truy cập vào màn hình "Support Queue".
  + **When:** Màn hình được tải hoặc người dùng chọn chế độ xem "All".
  + **Then:** Hệ thống hiển thị toàn bộ Ticket đang có trên hệ thống của đội IT, bao gồm cả Ticket đã có người nhận và chưa có người nhận.
* **Kịch bản 1.2: Xem hàng đợi chưa phân công (Unassigned)**
  + **Given:** Agent đang ở màn hình Support Queue.
  + **When:** Chọn bộ lọc hoặc tab "Unassigned".
  + **Then:** Hệ thống chỉ trả về danh sách các Ticket chưa có Assignee (người phụ trách đang để trống).
* **Kịch bản 1.3: Xem công việc của tôi (Assigned to Me)**
  + **Given:** Agent đang ở màn hình Support Queue.
  + **When:** Chọn bộ lọc hoặc tab "Assigned to Me".
  + **Then:** Hệ thống chỉ hiển thị danh sách các Ticket mà Agent đang đăng nhập được gán làm người phụ trách (Assignee).

2. Nhóm Lỗi và Ngoại lệ (Negative/Error Scenarios)

* **Kịch bản 2.1: Giới hạn quyền cập nhật (View-only đối với Agent khác)**
  + **Given:** Một Agent (không phải Admin) đang xem chi tiết một Ticket thuộc về bộ lọc "All" nhưng đã được gán (Assigned) cho một Agent khác.
  + **When:** Agent này cố gắng thao tác các action cập nhật (như chuyển trạng thái IN\_PROGRESS, RESOLVED, hoặc sửa Ticket).
  + **Then:** Hệ thống chặn thao tác VÀ ẩn hoặc disable các nút cập nhật, vì các Agent khác chủ yếu chỉ có quyền xem (view-only), mọi hành động cập nhật phải tuân theo permission của Assignee thực sự hoặc Admin.
* **Kịch bản 2.2: Ngăn chặn Employee truy cập hàng đợi IT**
  + **Given:** Một người dùng đang đăng nhập với Role Employee.
  + **When:** Cố tình truy cập URL của trang Support Queue hoặc gọi API Support Queue qua Postman.
  + **Then:** Backend và Frontend từ chối truy cập VÀ trả về lỗi HTTP 403 Forbidden.

3. Nhóm Biên và Giới hạn (Boundary/Data Constraints)

* **Quy tắc 3.1 - Thông tin hiển thị mặc định:** Bảng danh sách Support Queue phải hiển thị các cột thông tin tối thiểu gồm: Mã Ticket (Ticket Code), Tiêu đề (Title), Trạng thái (Status), Độ ưu tiên (Priority), Người tạo (Creator), Người phụ trách (Assignee), và Ngày tạo.
* **Quy tắc 3.2 - Phân trang dữ liệu:** Để đảm bảo hiệu năng, API trả về danh sách Support Queue bắt buộc phải được phân trang (Pagination), ví dụ mặc định 20 Ticket mỗi trang, kèm theo tổng số đếm (Total Count).

4. Nhóm Hiệu năng và Giao diện (Non-Functional/UI/UX)

* **Quy tắc 4.1 - Phân tách khu vực linh hoạt (UI Tabs/Filters):** Giao diện màn hình Support Queue phải cung cấp các Tab (hoặc Dropdown/Nút bấm) trực quan để người dùng chuyển đổi nhanh chóng giữa 3 chế độ xem: All, Unassigned, và Assigned to Me mà không cần phải tự cấu hình bộ lọc thủ công.
* **Quy tắc 4.2 - Làm nổi bật Ticket cần xử lý:** Các Ticket chưa có người nhận (Unassigned) và ở trạng thái NEW nên được làm nổi bật (ví dụ in đậm) để thu hút sự chú ý của Agent vào nhận việc.

### US10 – Agent tự nhận Ticket

**User Story:** *As a Support Agent, I want to take an unassigned NEW ticket so that I can take responsibility for it.*

**Business rules đã chốt**

* Take chỉ hợp lệ khi ticket NEW và chưa có Assignee.
* Take chỉ gán Assignee, status vẫn NEW.
* Hai Agent cùng Take: chỉ một người được nhận thành công.

| **Task** | **Nội dung** | **Ưu tiên** | **Estimate** |
| --- | --- | --- | --- |
| T5.3 | Take Ticket business rule | P0 | 0.75 PD |
| T5.4 | Xử lý case hai Agent cùng Take theo rule Q&A đã Close | P0 | 0.25 PD |

**Subtotal: 1.0 PD**

**Acceptance Criteria**

1. Nhóm Chức năng (Functional/Happy Path)

* **Kịch bản 1.1: Agent tự nhận Ticket thành công**
  + **Given:** Một Ticket đang ở trạng thái NEW và chưa có người phụ trách (Assignee bị trống).
  + **When:** Một Support Agent truy cập vào Ticket này và bấm nút "Nhận việc" (Take).
  + **Then:** Hệ thống cập nhật Agent đó thành Assignee của Ticket VÀ trạng thái Ticket bắt buộc vẫn giữ nguyên là NEW.
* **Kịch bản 1.2: Ghi nhận lịch sử (Audit History)**
  + **Given:** Thao tác nhận Ticket (Take) vừa được thực thi thành công.
  + **When:** Truy vấn tab Lịch sử (History) của Ticket.
  + **Then:** Sự kiện thay đổi Assignee phải được ghi log đầy đủ với Actor là Agent vừa thao tác, giá trị cũ (Trống), giá trị mới (Tên Agent), và thời gian thực hiện.

2. Nhóm Lỗi và Ngoại lệ (Negative/Error Scenarios)

* **Kịch bản 2.1: Hai Agent cùng thao tác đồng thời (Concurrency / Race Condition)**
  + **Given:** Ticket đang NEW và chưa có Assignee. Hai Agent (A và B) đang cùng mở màn hình chi tiết của Ticket này.
  + **When:** Cả Agent A và Agent B cùng nhấn nút "Nhận việc" (Take) gần như cùng một lúc.
  + **Then:** Backend phải sử dụng cơ chế kiểm tra dữ liệu cũ (version check hoặc kiểm tra Assignee is null tại thời điểm query). Chỉ một người duy nhất được hệ thống ghi nhận thành công. Người chậm hơn một nhịp phải bị từ chối với thông báo "Yêu cầu này đã được người khác nhận, vui lòng tải lại trang" (Lỗi 409 Conflict hoặc 400 Bad Request).
* **Kịch bản 2.2: Ticket không còn ở trạng thái hợp lệ**
  + **Given:** Ticket đã chuyển sang trạng thái IN\_PROGRESS (hoặc các trạng thái khác ngoài NEW).
  + **When:** Agent cố tình gọi API Take cho Ticket này.
  + **Then:** Backend từ chối thao tác VÀ trả về lỗi "Chỉ có thể nhận yêu cầu đang ở trạng thái Mới".
* **Kịch bản 2.3: Ticket đã có người phụ trách**
  + **Given:** Ticket vẫn ở trạng thái NEW nhưng đã được Admin Assign cho một Agent khác.
  + **When:** Agent hiện tại cố tình gọi API Take.
  + **Then:** Backend từ chối thao tác VÀ trả về lỗi "Yêu cầu này đã có người phụ trách".
* **Kịch bản 2.4: Employee cố gắng tự nhận Ticket**
  + **Given:** Một Employee đang đăng nhập.
  + **When:** Cố tình gọi API Take.
  + **Then:** Backend từ chối truy cập VÀ trả lỗi 403 Forbidden.

3. Nhóm Biên và Giới hạn (Boundary/Data Constraints)

* **Quy tắc 3.1 - Không thay đổi trạng thái (No Status Change):** Logic của API Take tuyệt đối không được phép kích hoạt sự kiện chuyển trạng thái sang IN\_PROGRESS. Điều này đảm bảo đồng hồ tính SLA Resolution tiếp tục đếm thời gian ở trạng thái NEW như quy định chốt với PO.
* **Quy tắc 3.2 - Một người phụ trách duy nhất:** Tại một thời điểm, chỉ có tối đa 01 Support Agent chịu trách nhiệm chính (không có multi-assignee trong MVP). Thao tác Take chỉ cập nhật vào một biến assignee\_id duy nhất của Ticket model.

4. Nhóm Hiệu năng và Giao diện (Non-Functional/UI/UX)

* **Quy tắc 4.1 - Điều kiện hiển thị nút "Nhận việc":** Nút bấm "Nhận việc" (Take) trên giao diện Frontend chỉ được hiển thị khi thỏa mãn ĐỒNG THỜI 2 điều kiện: Ticket Status là NEW VÀ Ticket chưa có Assignee. Nếu không thỏa mãn, Frontend phải ẩn nút này đi.
* **Quy tắc 4.2 - Cập nhật giao diện tự động khi tranh chấp:** Khi Agent B bị lỗi thao tác do Agent A đã Take trước (ở Kịch bản 2.1), sau khi đóng hộp thoại báo lỗi, Frontend nên tự động tải lại (reload) thông tin Ticket để cập nhật tên Agent A vào ô Assignee, tránh để Agent B thao tác nhầm trên dữ liệu cũ.

### US11 – Admin Assign Ticket

**User Story:** *As an Administrator, I want to assign an unassigned ticket to an active Support Agent so that work can be coordinated.*

**Business rules đã chốt**

* Admin có thể assign ticket cho Support Agent đang hoạt động.

| **Task** | **Nội dung** | **Ưu tiên** | **Estimate** |
| --- | --- | --- | --- |
| T5.5 | Assign API + Agent validation | P0 | 0.5 PD |
| T5.6 | Assign UI | P0 | 0.5 PD |

**Subtotal: 1.0 PD**

**Acceptance Criteria**

1. Nhóm Chức năng (Functional/Happy Path)

* **Kịch bản 1.1: Admin phân công Ticket thành công**
  + **Given:** Quản trị viên (Admin) đang xem một Ticket chưa có người phụ trách (Unassigned).
  + **When:** Admin chọn một Support Agent từ danh sách và thực hiện thao tác "Phân công" (Assign).
  + **Then:** Hệ thống cập nhật Agent đó thành người phụ trách (Assignee) của Ticket VÀ trạng thái của Ticket bắt buộc không bị thay đổi (không tự động chuyển sang IN\_PROGRESS).
* **Kịch bản 1.2: Ghi nhận lịch sử hệ thống (Audit Logging)**
  + **Given:** Thao tác phân công (Assign) vừa được Admin thực hiện thành công.
  + **When:** Truy vấn lịch sử (History) của Ticket.
  + **Then:** Hệ thống phải ghi nhận sự kiện cập nhật Assignee với Actor là Admin thực hiện, giá trị trước đó là Trống (Unassigned), giá trị mới là Tên Support Agent, và timestamp tương ứng.

2. Nhóm Lỗi và Ngoại lệ (Negative/Error Scenarios)

* **Kịch bản 2.1: Phân công cho Agent không hợp lệ hoặc đã bị khóa**
  + **Given:** Admin đang thực hiện thao tác phân công Ticket.
  + **When:** Admin cố tình truyền ID của một Agent đang bị khóa (Inactive) thông qua API, hoặc API nhận ID của một Employee/Admin khác.
  + **Then:** Backend phát hiện user không hợp lệ, từ chối thao tác phân công VÀ trả về thông báo lỗi: "Tài khoản nhận phân công không phải là Support Agent hoặc không còn hoạt động".
* **Kịch bản 2.2: Ticket đã có người phụ trách từ trước (Xung đột dữ liệu)**
  + **Given:** Ticket chưa có Assignee khi Admin tải trang, nhưng sau đó vừa được một Agent khác tự nhận (Take).
  + **When:** Admin hiện tại bấm xác nhận phân công (Assign) trên giao diện cũ.
  + **Then:** Backend kiểm tra thấy dữ liệu đã bị thay đổi, từ chối thao tác VÀ báo lỗi "Yêu cầu này đã có người phụ trách. Vui lòng tải lại trang" (Quy tắc xử lý stale data).
* **Kịch bản 2.3: Agent hoặc Employee cố tình gọi API Assign**
  + **Given:** Một người dùng đang đăng nhập với quyền Employee hoặc Support Agent.
  + **When:** Cố tình gọi API Assign của Admin.
  + **Then:** Backend kiểm tra quyền, từ chối thao tác VÀ trả về lỗi HTTP 403 Forbidden.

3. Nhóm Biên và Giới hạn (Boundary/Data Constraints)

* **Quy tắc 3.1 - Lọc danh sách Agent đích:** Hệ thống chỉ cho phép assign ticket cho các tài khoản thỏa mãn đồng thời 2 điều kiện: Role chính xác là Support Agent VÀ Trạng thái tài khoản đang là Active. Không được assign cho Employee hay Admin.
* **Quy tắc 3.2 - Điều kiện đầu vào của Ticket:** Thao tác Assign theo US11 chỉ hợp lệ trên các Ticket đang bị bỏ trống trường Assignee (Unassigned). Nếu Ticket đã có Assignee, hệ thống phải áp dụng luồng của tính năng Reassign (US12) có bắt buộc kèm lý do.

4. Nhóm Hiệu năng và Giao diện (Non-Functional/UI/UX)

* **Quy tắc 4.1 - Nguồn dữ liệu Dropdown UI:** Dropdown chọn người phụ trách trên giao diện (Assign UI) phải được tự động lọc sẵn từ Backend, tuyệt đối không tải toàn bộ danh sách người dùng của hệ thống xuống Frontend để tự ẩn.
* **Quy tắc 4.2 - Ẩn/Hiện tính năng theo Role:** Giao diện hoặc nút "Phân công" chỉ được hiển thị khi người dùng đang đăng nhập có Role là Administrator. Với Employee và Support Agent, giao diện này phải bị ẩn hoàn toàn.

### US12 – Admin Reassign Ticket

**User Story:** *As an Administrator, I want to reassign a ticket to another Agent so that responsibility can be transferred when needed.*

**Business rules đã chốt**

* Chỉ Admin được Reassign trong MVP.
* Reassign bắt buộc lý do; giữ nguyên status; không reset SLA; lưu History.
* IN\_PROGRESS và WAITING\_FOR\_EMPLOYEE phải luôn có Assignee.

| **Task** | **Nội dung** | **Ưu tiên** | **Estimate** |
| --- | --- | --- | --- |
| T5.7 | Reassign API + invariant + reason | P0 | 0.75 PD |
| T5.8 | Reassign UI | P0 | 0.5 PD |
| T5.9 | Assignment test suite | P0 | 1.25 PD |

**Subtotal: 2.5 PD**

**Epic estimate: 5.5 PD**

**Acceptance Criteria**

1. Nhóm Chức năng (Functional/Happy Path)

* **Kịch bản 1.1: Admin chuyển người phụ trách thành công**
  + **Given:** Quản trị viên (Admin) đang xem một Ticket đã có người phụ trách (Assignee).
  + **When:** Admin chọn "Chuyển người phụ trách" (Reassign), chọn một Support Agent khác đang hoạt động, nhập lý do bắt buộc và xác nhận.
  + **Then:** Hệ thống cập nhật Assignee mới thành công. Trạng thái (Status) của Ticket bắt buộc phải được giữ nguyên. Mọi đồng hồ SLA (First Response, Resolution) tiếp tục tính toán bình thường và tuyệt đối không bị reset.
* **Kịch bản 1.2: Lưu vết lịch sử kèm lý do**
  + **Given:** Thao tác Reassign vừa được thực hiện thành công.
  + **When:** Người dùng truy vấn tab Lịch sử (History) của Ticket.
  + **Then:** Hệ thống hiển thị bản ghi lịch sử chứa: Người thao tác (Admin), Người phụ trách cũ, Người phụ trách mới, thời gian thực hiện, VÀ bắt buộc phải hiển thị lý do chuyển giao (Reason).

2. Nhóm Lỗi và Ngoại lệ (Negative/Error Scenarios)

* **Kịch bản 2.1: Bỏ trống lý do bắt buộc**
  + **Given:** Admin đang mở form/dialog Reassign.
  + **When:** Admin chọn người phụ trách mới nhưng để trống ô "Lý do" và bấm xác nhận.
  + **Then:** Hệ thống chặn thao tác VÀ hiển thị cảnh báo "Bắt buộc phải nhập lý do khi chuyển người phụ trách".
* **Kịch bản 2.2: Không đúng thẩm quyền thao tác**
  + **Given:** Một người dùng đang đăng nhập với Role là Support Agent hoặc Employee.
  + **When:** Cố tình gọi API Reassign (thông qua Postman hoặc công cụ bên thứ ba).
  + **Then:** Backend phát hiện sai quyền, từ chối thao tác VÀ trả về mã lỗi HTTP 403 Forbidden. Chỉ Admin mới được phép Reassign trong MVP.
* **Kịch bản 2.3: Reassign cho tài khoản không hợp lệ**
  + **Given:** Admin đang gọi API Reassign.
  + **When:** Admin cố tình truyền ID của một Agent đã bị khóa (Inactive) hoặc ID của một Employee.
  + **Then:** Backend từ chối cập nhật VÀ trả về lỗi "Tài khoản nhận phân công không hợp lệ hoặc không còn hoạt động".

3. Nhóm Biên và Giới hạn (Boundary/Data Constraints)

* **Quy tắc 3.1 - Tính toàn vẹn của Assignee (Invariant):** Hệ thống không bao giờ cho phép một Ticket đang ở trạng thái IN\_PROGRESS hoặc WAITING\_FOR\_EMPLOYEE bị gỡ bỏ Assignee (trở thành null). Thao tác Reassign bắt buộc phải là luồng chuyển giao trực tiếp từ Agent A sang Agent B.
* **Quy tắc 3.2 - Độ dài của Lý do (Reason):** Trường lý do chuyển giao phải có độ dài tối thiểu 10 ký tự và tối đa 1000 ký tự để đảm bảo tính minh bạch của thông tin đối soát.

4. Nhóm Hiệu năng và Giao diện (Non-Functional/UI/UX)

* **Quy tắc 4.1 - Thiết kế Reassign UI:** Thao tác chuyển người phụ trách không được thiết kế dưới dạng một Dropdown đơn giản đổi tên trực tiếp, mà bắt buộc phải mở ra một Modal/Dialog riêng biệt để nhập người nhận mới và lý do.
* **Quy tắc 4.2 - Ẩn tính năng theo Role:** Nút thao tác "Reassign" trên giao diện chi tiết Ticket chỉ được hiển thị (render) khi người dùng đang đăng nhập là Administrator. Các role khác sẽ không nhìn thấy tính năng này trên UI.

## EPIC 6 – Ticket Lifecycle

|  |
| --- |
| **State Machine đã chốt**  NEW → IN\_PROGRESS.  IN\_PROGRESS → WAITING\_FOR\_EMPLOYEE. WAITING\_FOR\_EMPLOYEE → IN\_PROGRESS theo hai trường hợp: • Employee gửi Public Comment: hệ thống tự chuyển về IN\_PROGRESS. • Agent phụ trách hoặc Administrator chủ động Resume Processing: bắt buộc nhập lý do.  IN\_PROGRESS → RESOLVED. RESOLVED → CLOSED.  RESOLVED có thể Reopen về IN\_PROGRESS.  NEW / IN\_PROGRESS / WAITING\_FOR\_EMPLOYEE có thể Cancel theo quyền đã chốt.  CLOSED và CANCELLED là terminal. |

### US13–US17 – State transitions

**User Story:** *As an authorized user, I want to move a ticket through valid workflow states so that its progress is accurately represented.*

**Business rules đã chốt**

* Agent phụ trách/Admin: NEW→IN\_PROGRESS.
* Agent phụ trách/Admin: IN\_PROGRESS→WAITING\_FOR\_EMPLOYEE kèm Public Comment hỏi thông tin.
* Khi Ticket ở WAITING\_FOR\_EMPLOYEE:
  • Employee gửi Public Comment thì hệ thống tự chuyển Ticket về IN\_PROGRESS.
  • Agent phụ trách hoặc Administrator có thể chủ động Resume Processing nếu nhận thấy đã có đủ thông tin để tiếp tục xử lý; thao tác này bắt buộc nhập lý do và lưu History.
* Agent phụ trách/Admin: IN\_PROGRESS→RESOLVED kèm nội dung giải pháp công khai.
* Employee: RESOLVED→CLOSED hoặc RESOLVED→IN\_PROGRESS (Reopen) kèm lý do; Admin có thể Close/Reopen theo rule đã chốt.
* Không có Pending Vendor, Rejected hay auto-close sau 3 ngày trong MVP.

| **Task** | **Nội dung** | **Ưu tiên** | **Estimate** |
| --- | --- | --- | --- |
| T6.1 | Xây State Transition Service và permission matrix | P0 | 1.5 PD |
| T6.2 | Implement NEW → IN\_PROGRESS | P0 | 0.5 PD |
| T6.3 | Implement IN\_PROGRESS → WAITING\_FOR\_EMPLOYEE + Public Question | P0 | 0.75 PD |
| T6.4 | Implement WAITING\_FOR\_EMPLOYEE → IN\_PROGRESS: Employee Public Comment tự động Resume hoặc Agent phụ trách/Admin chủ động Resume với lý do | P0 | 0.75 PD |
| T6.5 | Implement IN\_PROGRESS → RESOLVED + Public Solution | P0 | 0.75 PD |
| T6.6 | Implement RESOLVED → CLOSED / IN\_PROGRESS | P0 | 0.75 PD |
| T6.7 | Chặn thao tác tại CLOSED/CANCELLED | P0 | 0.5 PD |
| T6.8 | Test toàn bộ transition matrix, bao gồm cả hai trường hợp Resume từ WAITING\_FOR\_EMPLOYEE | P0 | 0.5 PD |

**Subtotal: 6.0 PD**

**Acceptance Criteria**

1. Nhóm Chức năng (Functional/Happy Path)

* **Kịch bản 1.1: Bắt đầu xử lý (NEW → IN\_PROGRESS)**
  + **Given:** Ticket đang ở trạng thái NEW và đã có người phụ trách.
  + **When:** Support Agent phụ trách hoặc Admin nhấn chọn "Bắt đầu xử lý" (Start Processing).
  + **Then:** Trạng thái Ticket chuyển sang IN\_PROGRESS VÀ hệ thống ghi nhận lịch sử thay đổi.
* **Kịch bản 1.2: Tạm dừng chờ thông tin (IN\_PROGRESS → WAITING\_FOR\_EMPLOYEE)**
  + **Given:** Ticket đang ở trạng thái IN\_PROGRESS.
  + **When:** Agent phụ trách hoặc Admin chuyển trạng thái sang "Chờ phản hồi", nhập câu hỏi dưới dạng Public Comment và xác nhận.
  + **Then:** Hệ thống lưu Public Comment VÀ chuyển trạng thái Ticket sang WAITING\_FOR\_EMPLOYEE.
* **Kịch bản 1.3: Tự động tiếp tục xử lý (Tự động Resume)**
  + **Given:** Ticket đang ở trạng thái WAITING\_FOR\_EMPLOYEE.
  + **When:** Employee thực hiện gửi một Public Comment (trả lời thông tin) vào Ticket.
  + **Then:** Bình luận được lưu thành công VÀ hệ thống tự động cập nhật trạng thái Ticket quay trở về IN\_PROGRESS mà không cần Agent thao tác.
* **Kịch bản 1.4: Chủ động tiếp tục xử lý (Manual Resume by Agent/Admin)**
  + **Given:** Ticket đang ở trạng thái WAITING\_FOR\_EMPLOYEE.
  + **When:** Agent phụ trách hoặc Admin bấm nút "Tiếp tục xử lý" (Resume Processing), nhập lý do và xác nhận.
  + **Then:** Trạng thái Ticket chuyển về IN\_PROGRESS VÀ lý do chuyển trạng thái được lưu vào History.
* **Kịch bản 1.5: Đưa ra giải pháp (IN\_PROGRESS → RESOLVED)**
  + **Given:** Ticket đang ở trạng thái IN\_PROGRESS.
  + **When:** Agent phụ trách hoặc Admin bấm "Giải quyết", nhập nội dung giải pháp công khai và xác nhận.
  + **Then:** Trạng thái chuyển sang RESOLVED, giải pháp được gửi dưới dạng Public Comment VÀ đồng hồ SLA độ phân giải (Resolution) tạm dừng.
* **Kịch bản 1.6: Đóng hoặc Mở lại Yêu cầu (RESOLVED → CLOSED / IN\_PROGRESS)**
  + **Given:** Ticket đang ở trạng thái RESOLVED.
  + **When:** Employee hoặc Admin bấm "Đóng yêu cầu" (chuyển sang CLOSED) HOẶC bấm "Mở lại yêu cầu" (Reopen, chuyển về IN\_PROGRESS) kèm theo lý do.
  + **Then:** Trạng thái Ticket được cập nhật tương ứng VÀ ghi nhận lịch sử.

2. Nhóm Lỗi và Ngoại lệ (Negative/Error Scenarios)

* **Kịch bản 2.1: Chặn thao tác sai quyền (Permission Control)**
  + **Given:** Ticket đang ở trạng thái IN\_PROGRESS.
  + **When:** Một Employee HOẶC một Agent *không phải người phụ trách* gọi API chuyển trạng thái (sang Waiting hoặc Resolved).
  + **Then:** Backend phát hiện sai quyền, từ chối thao tác VÀ trả về mã lỗi 403 Forbidden.
* **Kịch bản 2.2: Bỏ trống thông tin bắt buộc khi chuyển trạng thái**
  + **Given:** Người dùng mở form chuyển trạng thái.
  + **When:** Để trống nội dung câu hỏi (khi sang WAITING), bỏ trống giải pháp (khi sang RESOLVED), hoặc bỏ trống lý do (khi Manual Resume hoặc Reopen) và submit.
  + **Then:** Hệ thống chặn thao tác VÀ thông báo lỗi "Bắt buộc phải nhập thông tin/lý do cho thao tác này".
* **Kịch bản 2.3: Thao tác tại trạng thái kết thúc (Terminal States)**
  + **Given:** Ticket đang ở trạng thái CLOSED hoặc CANCELLED.
  + **When:** Người dùng cố tình gọi bất kỳ API chuyển trạng thái nào (ví dụ: chuyển lại về IN\_PROGRESS).
  + **Then:** Backend bắt buộc từ chối VÀ báo lỗi "Không thể thay đổi trạng thái của yêu cầu đã đóng hoặc đã hủy" (HTTP 400).

3. Nhóm Biên và Giới hạn (Boundary/Data Constraints)

* **Quy tắc 3.1 - Ma trận trạng thái (State Transition Matrix):** Backend chỉ cho phép chuyển đổi trạng thái tuần tự theo đúng luồng định sẵn (Ví dụ: Không thể nhảy cóc từ NEW thẳng sang RESOLVED, hoặc từ WAITING\_FOR\_EMPLOYEE sang RESOLVED). Mọi API call vi phạm luồng bị từ chối 400 Bad Request.
* **Quy tắc 3.2 - Tính nhất quán dữ liệu (Transaction):** Mọi thao tác chuyển trạng thái kéo theo việc tạo Comment (như hỏi thêm thông tin, giải pháp) hoặc tạo History log bắt buộc phải được thực hiện trong cùng một Database Transaction. Nếu một trong các tiến trình thất bại, toàn bộ thao tác bị hủy (rollback).
* **Quy tắc 3.3 - Không tự động đóng (No Auto-close):** Hệ thống không có cơ chế tự động chuyển từ RESOLVED sang CLOSED (ví dụ sau 3 ngày). Việc đóng Ticket bắt buộc phải do Employee (người tạo) hoặc Admin thực hiện thủ công bằng tay.

4. Nhóm Hiệu năng và Giao diện (Non-Functional/UI/UX)

* **Quy tắc 4.1 - Nút thao tác động (Dynamic Action Buttons):** Frontend chỉ hiển thị các nút thao tác (Start, Pause, Resolve, Close, Reopen, Resume) tương ứng hợp lệ với Trạng thái (Status) hiện tại của Ticket VÀ Quyền (Role/Assignee) của người đang đăng nhập.
* **Quy tắc 4.2 - Trải nghiệm nhập liệu chuyển trạng thái:** Các thao tác cần thông tin bổ sung (Hỏi thêm thông tin, Cung cấp giải pháp, Resume Processing, Mở lại yêu cầu) phải mở ra một Pop-up/Dialog ngay tại màn hình chi tiết Ticket để nhập liệu, không được phép điều hướng sang trang web khác gây đứt gãy luồng theo dõi của người dùng.

## EPIC 7 – Communication

### US18–US19 – Public Comment & Internal Note

**User Story:** *As a ticket participant, I want to exchange information in the ticket context while respecting visibility rules.*

**Business rules đã chốt**

* Chủ ticket chỉ viết Public Comment.
* Agent phụ trách/Admin được viết Public Comment và Internal Note.
* Agent khác chỉ xem.
* Internal Note chỉ Agent/Admin thấy và không được xuất hiện trong API/history công khai của Employee.
* Không edit/delete comment; không đổi Internal Note thành Public; CLOSED/CANCELLED không nhận thêm trao đổi.
* Attachment không bắt buộc trong MVP.

| **Task** | **Nội dung** | **Ưu tiên** | **Estimate** |
| --- | --- | --- | --- |
| T7.1 | Comment model: PUBLIC / INTERNAL | P0 | 0.5 PD |
| T7.2 | Comment API + permission/visibility | P0 | 0.75 PD |
| T7.3 | Đảm bảo Internal Note không leak sang Employee API | P0 | 0.5 PD |
| T7.4 | UI comment timeline + composer | P0 | 1.0 PD |
| T7.5 | Rule no edit/delete + terminal status | P0 | 0.25 PD |
| T7.6 | Permission/security tests | P0 | 0.75 PD |

**Subtotal: 3.75 PD**

**Acceptance Criteria**

1. Nhóm Chức năng (Functional/Happy Path)

* **Kịch bản 1.1: Employee trao đổi thông tin (Public Comment)**
  + **Given:** Employee đang xem Ticket do mình tạo, trạng thái Ticket hợp lệ (không phải là CLOSED/CANCELLED).
  + **When:** Nhập nội dung trao đổi và bấm Gửi.
  + **Then:** Hệ thống lưu thành công một Public Comment VÀ hiển thị bình luận đó lên dòng thời gian (Timeline) cho mọi vai trò (Employee, Agent, Admin) cùng thấy.
* **Kịch bản 1.2: Agent phụ trách / Admin gửi Public Comment**
  + **Given:** Support Agent phụ trách hoặc Admin đang xem chi tiết Ticket hợp lệ.
  + **When:** Chọn loại bình luận là "Công khai" (Public), nhập nội dung và gửi.
  + **Then:** Hệ thống lưu thành công một Public Comment VÀ Employee nhận được/nhìn thấy nội dung trao đổi này.
* **Kịch bản 1.3: Agent phụ trách / Admin ghi chú nội bộ (Internal Note)**
  + **Given:** Support Agent phụ trách hoặc Admin đang xem chi tiết Ticket hợp lệ.
  + **When:** Chọn loại bình luận là "Nội bộ" (Internal Note), nhập nội dung và gửi.
  + **Then:** Hệ thống lưu thành công một Internal Note, chỉ hiển thị bình luận này trên giao diện của đội ngũ IT (Agent/Admin).

2. Nhóm Lỗi và Ngoại lệ (Negative/Error Scenarios)

* **Kịch bản 2.1: Chặn gửi bình luận khi Ticket đã kết thúc (Terminal State)**
  + **Given:** Ticket đang ở trạng thái CLOSED hoặc CANCELLED.
  + **When:** Người dùng cố tình gọi API thêm comment hoặc note qua công cụ bên ngoài.
  + **Then:** Backend phát hiện trạng thái đóng băng, từ chối lưu VÀ trả về lỗi "Không thể thêm bình luận vào yêu cầu đã đóng hoặc đã hủy".
* **Kịch bản 2.2: Ngăn chặn rò rỉ ghi chú nội bộ (Data Leakage Strict Test)**
  + **Given:** Ticket có chứa các Internal Note của Agent.
  + **When:** Employee thực hiện gọi API lấy danh sách bình luận (hoặc chi tiết Ticket) thông qua Token của mình.
  + **Then:** Payload dữ liệu trả về từ API Backend tuyệt đối không được chứa bất kỳ bản ghi Internal Note nào. (Đảm bảo lọc dữ liệu ngay từ Backend thay vì chỉ ẩn ở Frontend).
* **Kịch bản 2.3: Agent khác cố gắng bình luận trái phép**
  + **Given:** Một Support Agent đang xem một Ticket *không được phân công cho mình* (tức là không phải Assignee).
  + **When:** Cố tình gọi API gửi Public Comment hoặc Internal Note.
  + **Then:** Backend kiểm tra quyền (owner/assignee), từ chối thao tác VÀ trả về lỗi HTTP 403 Forbidden. Quy định: "Agent khác chủ yếu view-only".

3. Nhóm Biên và Giới hạn (Boundary/Data Constraints)

* **Quy tắc 3.1 - Bất biến dữ liệu (No Edit/Delete):** Hệ thống không cung cấp API cũng như tính năng trên giao diện để Sửa (Edit) hoặc Xóa (Delete) bất kỳ comment/note nào sau khi đã được lưu thành công.
* **Quy tắc 3.2 - Bất biến loại bình luận:** Không cho phép chuyển đổi một Internal Note thành Public Comment hoặc ngược lại sau khi đã đăng.
* **Quy tắc 3.3 - Giới hạn nhập liệu:** Nội dung bình luận không được để trống (tối thiểu 1 ký tự) và có giới hạn tối đa để tránh quá tải database (ví dụ: 5000 ký tự).
* **Quy tắc 3.4 - Không hỗ trợ file đính kèm:** MVP không yêu cầu chức năng upload file (Attachment). API tạo comment sẽ bỏ qua hoặc báo lỗi nếu payload có chứa dữ liệu file.

4. Nhóm Hiệu năng và Giao diện (UI/UX)

* **Quy tắc 4.1 - Phân biệt thị giác rõ ràng:** Trên giao diện Timeline của Admin/Agent, các Internal Note phải được thiết kế nổi bật và khác biệt hoàn toàn so với Public Comment (ví dụ: có nền màu vàng nhạt, viền khác màu, hoặc gắn nhãn "Chỉ nội bộ" thật to) để tránh Agent gầm lẫn mà trao đổi nhầm thông tin nhạy cảm.
* **Quy tắc 4.2 - Form nhập liệu động theo Role:**
  + Với Employee: Khung soạn thảo chỉ có một nút "Gửi" mặc định là Public Comment.
  + Với Agent phụ trách/Admin: Khung soạn thảo bắt buộc phải có Tab chuyển đổi hoặc Switch/Radio button để lựa chọn rõ ràng giữa "Gửi cho người dùng" (Public) và "Thêm ghi chú nội bộ" (Internal).
* **Quy tắc 4.3 - Ẩn khung soạn thảo:** Khi trạng thái Ticket là CLOSED hoặc CANCELLED, UI phải tự động ẩn hoàn toàn khung soạn thảo (Composer) đối với mọi Role để không gây hiểu nhầm là vẫn còn chat được.

## EPIC 8 – Audit History

### US20 – Xem lịch sử Ticket

**User Story:** *As an authorized user, I want to review ticket history so that I can understand what changed, when, and by whom.*

**Business rules đã chốt**

* Employee xem public history của ticket mình tạo.
* Support Agent xem business history của Ticket trong đội IT theo quyền được phép.
* Administrator xem đầy đủ Audit History, bao gồm:

- Thay đổi thông tin Ticket.
- Thay đổi Impact/Urgency/Priority.
- Assignment/Reassignment.
- Các Lifecycle transition.
- Cancel/Reopen/Close.
- Hoạt động quản trị User, Role và Account Status.
- Hoạt động quản trị Request Type.

* Audit Event lưu tối thiểu actor, action, timestamp, before/after và reason đối với các thao tác bắt buộc lý do.

| **Task** | **Nội dung** | **Phân loại** | **Người đảm nhận** | **Ưu tiên** | **Estimate** |
| --- | --- | --- | --- | --- | --- |
| T8.1 | Audit Event model/service | Xây dựng Audit Event Model và Audit Service dùng chung. Thiết kế cấu trúc lưu trữ log dạng đa hình (hỗ trợ lưu vết thay đổi của Ticket, User, Request Type) với các trường tối thiểu: Actor, Action, Timestamp, Before/After, Reason. Cung cấp hàm Helper/Aspect để các service khác gọi ghi log tự động. | **LocLD11** (Chính xây dựng Audit Service & Helper)  **PhanDV2** (Phối hợp tích hợp chuẩn hóa format log) | P1 | 1.0 PD |
| T8.2 | Gắn Audit vào Edit Ticket, Impact/Urgency/Priority, Assignment/Reassignment, Lifecycle, Cancel và các thao tác quản trị User/Role/Account Status/Request Type |  |  | P1 | 1.25 PD |
| T8.3 | History API với visibility theo role |  |  | P1 | 0.75 PD |
| T8.4 | UI Timeline / History |  |  | P1 | 0.5 PD |
| T8.5 | Audit visibility/permission tests cho Employee, Agent và Administrator, bao gồm Audit của các thao tác quản trị |  |  | P1 | 0.5 PD |

**Subtotal: 4.0 PD**

**Acceptance Criteria**

1. Nhóm Chức năng (Functional/Happy Path)

* **Kịch bản 1.1: Employee xem lịch sử Ticket cá nhân**
  + **Given:** Người dùng đăng nhập với Role Employee và đang xem chi tiết một Ticket do chính mình tạo.
  + **When:** Mở tab Lịch sử (History) hoặc Dòng thời gian (Timeline).
  + **Then:** Hệ thống chỉ trả về danh sách lịch sử công khai (Public History) bao gồm: Tạo mới, Chỉnh sửa thông tin cơ bản, Đổi trạng thái hiển thị cho người dùng, và các Public Comment.
* **Kịch bản 1.2: Agent xem lịch sử nghiệp vụ của Ticket**
  + **Given:** Support Agent đang xem chi tiết một Ticket bất kỳ của đội IT.
  + **When:** Truy vấn lịch sử của Ticket đó.
  + **Then:** Hệ thống trả về lịch sử nghiệp vụ (Business History) bao gồm các thay đổi của Employee, cộng thêm các thao tác nội bộ như: Nhận việc, Phân công (Assign), thay đổi Priority, và Internal Notes.
* **Kịch bản 1.3: Admin xem toàn bộ lịch sử hệ thống (Audit History)**
  + **Given:** Người dùng đăng nhập với Role Administrator.
  + **When:** Truy cập vào Lịch sử Ticket hoặc trang Quản lý Hệ thống.
  + **Then:** Hệ thống trả về toàn bộ dữ liệu kiểm toán đầy đủ. Bao gồm lịch sử của Ticket VÀ lịch sử hoạt động quản trị hệ thống (như tạo/khóa tài khoản, đổi Role, kích hoạt/hủy kích hoạt Request Type).
* **Kịch bản 1.4: Ghi nhận đầy đủ thông tin vào bản ghi (Audit Event)**
  + **Given:** Có một sự kiện thay đổi dữ liệu xảy ra trên hệ thống (Ví dụ: Đổi trạng thái từ IN\_PROGRESS sang WAITING\_FOR\_EMPLOYEE).
  + **When:** Hệ thống lưu Audit Event vào Database.
  + **Then:** Bản ghi bắt buộc phải lưu trữ tối thiểu các trường: Người thực hiện (Actor), Hành động (Action), Thời gian (Timestamp), Giá trị trước (Before), Giá trị sau (After), và Lý do (Reason) nếu thao tác đó bắt buộc phải có lý do (ví dụ Reassign, Cancel).

2. Nhóm Lỗi và Ngoại lệ (Negative/Error Scenarios)

* **Kịch bản 2.1: Ngăn chặn Employee xem lịch sử Ticket của người khác**
  + **Given:** Một Employee đang đăng nhập hợp lệ.
  + **When:** Cố tình gọi API History và truyền vào ID của một Ticket do người khác tạo.
  + **Then:** Backend phát hiện sai quyền sở hữu, từ chối trả dữ liệu VÀ trả về lỗi HTTP 403 (Forbidden) hoặc 404 (Not Found).
* **Kịch bản 2.2: Rò rỉ dữ liệu lịch sử nội bộ (Visibility check)**
  + **Given:** Một Ticket có lịch sử thao tác của Agent (Assign, đổi Priority) và Admin (Reassign).
  + **When:** Employee (người tạo Ticket) gọi API lấy History.
  + **Then:** Payload API trả về cho Employee tuyệt đối không được chứa các sự kiện nội bộ của IT (chỉ hiển thị những gì thuộc Public History để tránh lộ thông tin nội bộ).
* **Kịch bản 2.3: Thất bại khi ghi nhận lịch sử (Rollback)**
  + **Given:** Một Agent thực hiện thao tác nghiệp vụ (VD: Edit Ticket).
  + **When:** Việc ghi bản ghi Audit Event bị lỗi (do mất kết nối DB hoặc thiếu trường dữ liệu).
  + **Then:** Thao tác nghiệp vụ chính (Edit Ticket) cũng phải bị hủy bỏ (Rollback) VÀ báo lỗi cho người dùng, đảm bảo không có bất kỳ thay đổi nào xảy ra mà không được lưu vết.

3. Nhóm Biên và Giới hạn (Boundary/Data Constraints)

* **Quy tắc 3.1 - Tính bất biến (Immutable):** Dữ liệu trong bảng History là dữ liệu chỉ đọc (Read-only) tuyệt đối. Không có bất kỳ API hay tính năng giao diện nào cho phép Xóa (Delete) hoặc Sửa (Edit) các bản ghi Audit History, kể cả đối với Role Administrator.
* **Quy tắc 3.2 - Điều kiện lưu Before/After:** Hệ thống chỉ lưu trường Before và After khi sự kiện đó là cập nhật dữ liệu (Update). Với sự kiện tạo mới (Create), trường Before sẽ rỗng/null. Với các sự kiện thao tác không làm đổi field dữ liệu cụ thể (như Comment), chỉ cần lưu Action.

4. Nhóm Hiệu năng và Giao diện (Non-Functional/UI/UX)

* **Quy tắc 4.1 - Phân trang dữ liệu lịch sử:** Nếu một Ticket có quá trình xử lý dài, danh sách History hiển thị trên giao diện hoặc qua API bắt buộc phải được phân trang (Ví dụ: tải từng cụm 20 bản ghi) để không làm chậm thời gian tải trang.
* **Quy tắc 4.2 - Bố cục hiển thị Dòng thời gian (Timeline):** Trên giao diện Chi tiết Ticket (Ticket Detail), Lịch sử và Bình luận nên được sắp xếp xen kẽ theo thứ tự thời gian từ mới nhất đến cũ nhất (hoặc ngược lại tùy thiết kế) để người dùng dễ dàng đọc được mạch diễn biến sự việc.
* **Quy tắc 4.3 - Nhận diện trực quan cho Admin:** Tại màn hình xem Audit History riêng của Admin, cần có tính năng lọc (Filter) theo loại đối tượng (Ví dụ: Ticket, User, Request Type) để Admin dễ dàng truy xuất các thay đổi quản trị hệ thống khi cần đối soát.

## EPIC 9 – Search / Filter / Pagination

### US21 – Tra cứu Ticket

**User Story:** *As a user, I want to search and filter accessible tickets so that I can find relevant work efficiently.*

**Business rules đã chốt**

* Search: exact Ticket Code hoặc partial Title.
* Filter: Status, Priority, Request Type, Assignee gồm Unassigned, Created Date Range, từng SLA violation flag; Creator dành cho Agent/Admin.
* Filter khác loại kết hợp AND; nhiều giá trị cùng filter kết hợp OR.
* Pagination 20/50/100, mặc định 20; total count cũng phải tuân thủ permission.

| **Task** | **Nội dung** | **Ưu tiên** | **Estimate** |
| --- | --- | --- | --- |
| T9.1 | Backend dynamic filtering + AND/OR + permission scope | P1 | 1.5 PD |
| T9.2 | Search Code / Partial Title | P1 | 0.5 PD |
| T9.3 | Pagination 20/50/100 và total count | P1 | 0.5 PD |
| T9.4 | UI Search/Filter/Pagination | P1 | 0.75 PD |
| T9.5 | Query/permission tests | P1 | 0.25 PD |

**Subtotal: 3.5 PD**

**Acceptance Criteria**

1. Nhóm Chức năng (Functional/Happy Path)

* **Kịch bản 1.1: Tìm kiếm theo từ khóa (Search)**
  + **Given:** Người dùng đang ở màn hình danh sách Ticket.
  + **When:** Nhập từ khóa vào ô tìm kiếm và thực hiện tìm kiếm.
  + **Then:** Hệ thống trả về kết quả khớp chính xác (exact match) với Ticket Code HOẶC khớp một phần (partial match) với tiêu đề (Title) của Ticket.
* **Kịch bản 1.2: Lọc dữ liệu đơn lẻ (Filter)**
  + **Given:** Người dùng đang ở màn hình danh sách Ticket.
  + **When:** Chọn một hoặc nhiều tiêu chí lọc bao gồm: Status, Priority, Request Type, Assignee (gồm cả tùy chọn Unassigned), khoảng ngày tạo (Created Date Range), hoặc từng cờ vi phạm SLA (SLA violation flag).
  + **Then:** Hệ thống trả về danh sách Ticket thỏa mãn chính xác các tiêu chí lọc đã chọn VÀ nằm trong phạm vi quyền hạn xem của người dùng.
* **Kịch bản 1.3: Xử lý logic kết hợp bộ lọc (AND/OR Logic)**
  + **Given:** Người dùng thiết lập bộ lọc nâng cao.
  + **When:** Chọn nhiều giá trị trong cùng một loại bộ lọc (Ví dụ: Status = NEW và IN\_PROGRESS) VÀ kết hợp với loại bộ lọc khác (Ví dụ: Priority = P1).
  + **Then:** Hệ thống kết hợp bằng logic OR cho các giá trị cùng loại (lấy NEW hoặc IN\_PROGRESS) VÀ kết hợp bằng logic AND giữa các loại bộ lọc khác nhau (phải là P1).
* **Kịch bản 1.4: Lọc theo người tạo (Filter by Creator)**
  + **Given:** Người dùng đăng nhập với Role Support Agent hoặc Administrator.
  + **When:** Mở bộ lọc tìm kiếm.
  + **Then:** Cung cấp thêm trường lọc theo Người tạo (Creator) để Agent/Admin dễ dàng tra cứu yêu cầu của một Employee cụ thể.
* **Kịch bản 1.5: Phân trang và Đếm tổng (Pagination & Total count)**
  + **Given:** Người dùng thực hiện tìm kiếm hoặc lọc dữ liệu.
  + **When:** Hệ thống trả về danh sách kết quả.
  + **Then:** Dữ liệu được phân trang theo các mức 20, 50, hoặc 100 kết quả trên một trang, mặc định hiển thị 20 kết quả/trang. Bắt buộc trả về tổng số kết quả (total count) khớp với quyền hạn (permission) của người dùng hiện tại.

2. Nhóm Lỗi và Ngoại lệ (Negative/Error Scenarios)

* **Kịch bản 2.1: Truyền tham số lọc ngoài thẩm quyền**
  + **Given:** Một Employee đang đăng nhập hệ thống.
  + **When:** Cố tình gọi API lấy danh sách Ticket kèm theo tham số lọc creator\_id của một Employee khác (thông qua Postman hoặc sửa URL).
  + **Then:** Backend bắt buộc ghi đè tham số phân quyền, chỉ trả về các Ticket do chính Employee đang thao tác tạo ra, tuyệt đối không trả về Ticket của người khác (Total count cũng phải tính theo permission).
* **Kịch bản 2.2: Không tìm thấy dữ liệu**
  + **Given:** Người dùng thực hiện một bộ lọc hoặc tìm kiếm.
  + **When:** Cấu hình bộ lọc không khớp với bất kỳ Ticket nào trong Database.
  + **Then:** Hệ thống trả về mảng dữ liệu rỗng, tổng số lượng (Total count) bằng 0 VÀ giao diện hiển thị trạng thái rỗng (Empty state) thay vì báo lỗi hệ thống.
* **Kịch bản 2.3: Tham số phân trang không hợp lệ**
  + **Given:** Người dùng gọi API tìm kiếm.
  + **When:** Truyền tham số số lượng phân trang (size) không hợp lệ như số âm, bằng 0, hoặc lớn hơn 100 (VD: size=999).
  + **Then:** Backend từ chối tham số và trả về lỗi 400 Bad Request, HOẶC tự động điều chỉnh về mức phân trang mặc định hợp lệ.

3. Nhóm Biên và Giới hạn (Boundary/Data Constraints)

* **Quy tắc 3.1 - Tính độc lập của Search và Filter:** Chức năng Tìm kiếm (Search) theo Code/Title và chức năng Lọc (Filter) theo các trường nghiệp vụ có thể hoạt động độc lập hoặc hoạt động đồng thời (kết hợp bằng logic AND).
* **Quy tắc 3.2 - Phân quyền trong Base Query:** Mọi truy vấn (query) vào cơ sở dữ liệu để tìm kiếm, lọc, hoặc đếm (count) bắt buộc phải luôn tự động gắn kèm mệnh đề giới hạn quyền (Permission Scope) tại Backend trước khi thực thi.
* **Quy tắc 3.3 - Giới hạn bộ lọc Creator:** Bộ lọc Creator (Người tạo) bị vô hiệu hóa hoàn toàn đối với tài khoản Role Employee, chỉ khả dụng cho Role Agent và Admin.

4. Nhóm Hiệu năng và Giao diện (Non-Functional/UI/UX)

* **Quy tắc 4.1 - Giao diện chọn kích thước phân trang:** Tại khu vực phân trang (thường ở dưới cùng của bảng danh sách), phải có Dropdown cho phép người dùng chủ động chọn mức hiển thị 20, 50, hoặc 100 dòng.
* **Quy tắc 4.2 - Hiển thị số đếm rõ ràng:** Giao diện cần hiển thị rõ cấu trúc số đếm (Ví dụ: "Hiển thị 1 - 20 trong tổng số 145 Yêu cầu") dựa trên biến total count trả về từ Backend.
* **Quy tắc 4.3 - Giữ trạng thái bộ lọc (Filter Persistence):** Khi người dùng click vào xem chi tiết một Ticket từ kết quả tìm kiếm, sau đó bấm "Quay lại", màn hình danh sách nên giữ nguyên các tham số tìm kiếm, bộ lọc và vị trí trang hiện tại để họ không phải thao tác lại từ đầu.

## EPIC 10 – SLA & Time Attention

| **Priority** | **First Response** | **Resolution** |
| --- | --- | --- |
| P1 | 15 phút | 4 giờ |
| P2 | 1 giờ | 8 giờ |
| P3 | 4 giờ | 24 giờ |
| P4 | 8 giờ | 72 giờ |

### US22–US25 – Theo dõi SLA

**User Story:** *As Support/Admin, I want to see response and resolution SLA status so that tickets needing attention are visible.*

**Business rules đã chốt**

* Cả hai clock bắt đầu từ Created At và tính 24/7.
* First Response dừng tại Public Comment đầu tiên của Agent phụ trách/Admin; Take/Assign/status/Internal Note không tính response.
* Resolution cộng thời gian ở NEW và IN\_PROGRESS; pause ở WAITING\_FOR\_EMPLOYEE và RESOLVED; resume khi quay lại IN\_PROGRESS/Reopen; stop ở CLOSED/CANCELLED.
* Warning riêng từng clock: <80% Normal; 80–100% Due Soon; >100% Overdue; đúng 100% vẫn trong hạn.
* Reassign không reset SLA. Đổi Priority áp dụng target mới cho mục tiêu chưa đạt, giữ elapsed time; lịch sử breach đã có không bị xóa.

| **Task** | **Nội dung** | **Ưu tiên** | **Estimate** |
| --- | --- | --- | --- |
| T10.1 | SLA policy P1–P4 | P1 | 0.5 PD |
| T10.2 | First Response clock và stop condition | P1 | 1.0 PD |
| T10.3 | Resolution accumulated time + pause/resume | P1 | 2.0 PD |
| T10.4 | Priority/Reassign interaction với SLA | P1 | 1.0 PD |
| T10.5 | Normal / Due Soon / Overdue calculation | P1 | 0.75 PD |
| T10.6 | UI SLA indicator | P1 | 0.5 PD |
| T10.7 | SLA test scenarios | P1 | 0.75 PD |

**Subtotal: 6.5 PD**

|  |
| --- |
| **Lưu ý:** Epic SLA là hạng mục rủi ro estimate cao nhất vì Resolution Time phải cộng dồn theo trạng thái, không thể chỉ dùng Current Time - Created Time. |

**Acceptance Criteria**

1. Nhóm Chức năng (Functional/Happy Path)

* **Kịch bản 1.1: Khởi động đồng hồ SLA (SLA Clock Start)**
  + **Given:** Một Ticket vừa được Employee tạo thành công.
  + **When:** Hệ thống ghi nhận vào cơ sở dữ liệu.
  + **Then:** Cả hai đồng hồ SLA (First Response và Resolution) bắt đầu tính thời gian ngay lập tức từ mốc Created At và chạy xuyên suốt theo cơ chế 24/7 (không loại trừ ngoài giờ làm việc hay ngày nghỉ).
* **Kịch bản 1.2: Dừng đồng hồ First Response (Phản hồi đầu tiên)**
  + **Given:** Ticket đang chạy đồng hồ First Response.
  + **When:** Support Agent phụ trách hoặc Admin gửi một bình luận loại "Công khai" (Public Comment) đầu tiên vào Ticket.
  + **Then:** Đồng hồ First Response dừng lại vĩnh viễn và ghi nhận trạng thái đạt (Met) hoặc trễ (Overdue) tại thời điểm đó.
* **Kịch bản 1.3: Tạm dừng và Tiếp tục SLA Resolution (Pause & Resume)**
  + **Given:** Ticket đang ở trạng thái IN\_PROGRESS (đồng hồ Resolution đang chạy).
  + **When:** Ticket được chuyển sang WAITING\_FOR\_EMPLOYEE hoặc RESOLVED.
  + **Then:** Đồng hồ Resolution tạm dừng (pause).
  + **And When:** Ticket quay trở lại trạng thái IN\_PROGRESS (Employee phản hồi hoặc Reopen).
  + **Then:** Đồng hồ Resolution tiếp tục chạy (resume), thời gian giải quyết sẽ được cộng dồn (tổng thời gian ở NEW + IN\_PROGRESS).
* **Kịch bản 1.4: Dừng vĩnh viễn SLA Resolution (Terminal Stop)**
  + **Given:** Ticket đang được xử lý.
  + **When:** Trạng thái Ticket chuyển sang CLOSED hoặc CANCELLED.
  + **Then:** Đồng hồ Resolution dừng tính thời gian hoàn toàn.
* **Kịch bản 1.5: Đổi Priority (Tác động đến SLA)**
  + **Given:** Một Ticket chưa hoàn thành mục tiêu SLA.
  + **When:** Agent/Admin thay đổi mức độ ưu tiên (Ví dụ từ P3 sang P1).
  + **Then:** Mốc thời gian mục tiêu (Target time) mới được áp dụng ngay lập tức cho các mục tiêu chưa đạt VÀ thời gian đã trôi qua (elapsed time) vẫn được giữ nguyên không reset. (Nếu SLA đã bị vi phạm trước đó, lịch sử breach không bị xóa).
* **Kịch bản 1.6: Reassign người phụ trách**
  + **Given:** Admin thực hiện luồng Reassign Ticket sang một Agent khác.
  + **When:** Ticket được phân công lại thành công.
  + **Then:** Toàn bộ đồng hồ SLA tiếp tục chạy bình thường, tuyệt đối không bị reset.

2. Nhóm Lỗi và Ngoại lệ (Negative/Error Scenarios)

* **Kịch bản 2.1: Các thao tác không làm dừng First Response SLA**
  + **Given:** Ticket đang đếm giờ First Response.
  + **When:** Agent thực hiện thao tác: Nhận vé (Take), Admin phân công (Assign), Đổi trạng thái (chuyển sang IN\_PROGRESS) HOẶC Agent gửi Ghi chú nội bộ (Internal Note).
  + **Then:** Đồng hồ First Response KHÔNG ĐƯỢC DỪNG. Bắt buộc phải có Public Comment từ Agent/Admin mới được tính là đã phản hồi.
* **Kịch bản 2.2: Thay đổi Priority cho mục tiêu SLA đã đóng**
  + **Given:** Ticket đã hoàn thành First Response SLA (có Public Comment), nhưng chưa hoàn thành Resolution SLA.
  + **When:** Agent thay đổi Priority (Ví dụ P2 thành P1).
  + **Then:** Mục tiêu First Response giữ nguyên kết quả cũ (không áp dụng target mới do đã đạt), mục tiêu Resolution áp dụng target mới của P1.

3. Nhóm Biên và Giới hạn (Boundary/Data Constraints)

* **Quy tắc 3.1 - Các mốc cảnh báo tỷ lệ phần trăm (Warning Thresholds):** Hệ thống phải tính toán chính xác tỷ lệ thời gian đã trôi qua so với thời gian mục tiêu:
  + Dưới 80% (<80%): Trạng thái Bình thường (Normal).
  + Từ 80% đến 100% (80-100%): Sắp đến hạn (Due Soon). Đúng 100% vẫn tính là trong hạn.
  + Lớn hơn 100% (>100%): Quá hạn (Overdue).
* **Quy tắc 3.2 - Bảng thời gian chuẩn:** Code backend phải cấu hình cứng mốc thời gian mục tiêu 24/7 theo từng mức Priority:
  + **P1:** First Response = 15 phút, Resolution = 4 giờ.
  + **P2:** First Response = 1 giờ, Resolution = 8 giờ.
  + **P3:** First Response = 4 giờ, Resolution = 24 giờ.
  + **P4:** First Response = 8 giờ, Resolution = 72 giờ.

4. Nhóm Hiệu năng và Giao diện (Non-Functional/UI/UX)

* **Quy tắc 4.1 - Phân tách hai chỉ số SLA:** Giao diện chi tiết Ticket và bảng Support Queue phải hiển thị cờ cảnh báo (SLA indicator) riêng biệt cho từng clock: một cờ cho First Response, một cờ cho Resolution.
* **Quy tắc 4.2 - Mã màu SLA Indicator (Visual Cues):** Cờ cảnh báo SLA trên UI nên sử dụng màu sắc trực quan để Agent dễ nhận diện: Normal = Xanh lá hoặc Xám nhạt, Due Soon = Vàng/Cam, Overdue = Đỏ.
* **Quy tắc 4.3 - Cập nhật theo thời gian thực (Real-time evaluation):** Khi người dùng tải lại trang Support Queue hoặc Dashboard, các mốc thời gian và cờ cảnh báo (Normal/Due Soon/Overdue) phải được tính toán và hiển thị chính xác tương đối với thời điểm hiện tại.

## EPIC 11 – Reporting / Dashboard

### US26–US28 – Workload, Overdue & Average Resolution Dashboard

**User Story:** *As an Administrator, I want basic operational metrics including average resolution time so that I can monitor current load, overdue work and processing performance.*

**Business rules đã chốt**

* Workload = số ticket đang mở được assign cho từng Agent: NEW, IN\_PROGRESS, WAITING\_FOR\_EMPLOYEE.
* Không cộng RESOLVED, CLOSED, CANCELLED vào workload hiện tại; Unassigned hiển thị riêng.
* Ticket vượt Resolution SLA được xem là quá hạn giải quyết; không tạo rule long-running riêng.
* Dashboard MVP bắt buộc có Thời gian giải quyết trung bình. Average First Response Time trên Dashboard chưa bắt buộc; First Response SLA vẫn được theo dõi trên từng Ticket.
* Chỉ tính Ticket hiện đang RESOLVED hoặc CLOSED và có lần chuyển sang RESOLVED gần nhất nằm trong kỳ báo cáo; loại CANCELLED, NEW, IN\_PROGRESS và WAITING\_FOR\_EMPLOYEE. Mỗi Ticket chỉ được tính một lần.
* Thời gian giải quyết của một Ticket = tổng thời gian Ticket nằm ở NEW và IN\_PROGRESS, cộng dồn qua các lần Reopen; không tính thời gian ở WAITING\_FOR\_EMPLOYEE hoặc RESOLVED.
* Kỳ báo cáo dùng thời điểm chuyển sang RESOLVED gần nhất theo giờ Việt Nam. Mặc định 30 ngày lịch gồm hôm nay và người dùng có thể chọn kỳ khác. Nếu không có Ticket đủ điều kiện thì hiển thị “Chưa có dữ liệu”.
* Nếu Ticket đã RESOLVED nhưng sau đó Reopen và hiện đang IN\_PROGRESS hoặc WAITING\_FOR\_EMPLOYEE thì tạm loại khỏi tập tính. Khi RESOLVED lại, Ticket được tính theo kỳ chứa lần RESOLVED mới nhất và thời gian giải quyết tiếp tục cộng dồn, không reset.

| **Task** | **Nội dung** | **Ưu tiên** | **Estimate** |
| --- | --- | --- | --- |
| T11.1 | Workload by Agent + Unassigned query | P1 | 0.75 PD |
| T11.2 | Resolution Overdue count/list | P1 | 0.75 PD |
| T11.3 | Dashboard UI cơ bản + route/permission chỉ dành cho Administrator | P1 | 0.75 PD |
| T11.4 | Average Resolution Time query: eligible set, lần Resolved gần nhất trong kỳ, accumulated NEW + IN\_PROGRESS | P1 | 1.0 PD |
| T11.5 | Kỳ báo cáo Dashboard: mặc định 30 ngày lịch, cho phép chọn kỳ khác, dùng giờ Việt Nam và trạng thái “Chưa có dữ liệu” | P1 | 0.5 PD |
| T11.6 | Test Average Resolution: Cancelled, Reopen, cross-month, current state và no-data | P1 | 0.5 PD |

**Subtotal: 4.25 PD**

|  |
| --- |
| **Phạm vi Dashboard** Dashboard MVP có Thời gian giải quyết trung bình theo business rule đã chốt. Average First Response Time trên Dashboard là đề xuất bổ sung, chưa bắt buộc trong MVP. |

**Acceptance Criteria**

1. Nhóm Chức năng (Functional/Happy Path)

* **Kịch bản 1.1: Tính toán Workload hiện tại của Agent**
  + **Given:** Quản trị viên (Administrator) truy cập vào màn hình Dashboard.
  + **When:** Hệ thống tải widget Workload (Khối lượng công việc).
  + **Then:** Hệ thống hiển thị chính xác số lượng Ticket đang mở được gán (assign) cho từng Agent. Chỉ cộng các Ticket đang ở trạng thái NEW, IN\_PROGRESS, và WAITING\_FOR\_EMPLOYEE. Tuyệt đối không cộng các Ticket đã RESOLVED, CLOSED, hoặc CANCELLED vào khối lượng này.
* **Kịch bản 1.2: Hiển thị lượng vé chưa phân công (Unassigned)**
  + **Given:** Admin đang xem widget Workload.
  + **When:** Tra cứu các Ticket chưa có người phụ trách.
  + **Then:** Lượng Ticket Unassigned (chưa gán cho ai) phải được nhóm lại và hiển thị tách biệt thành một mục riêng để dễ dàng theo dõi.
* **Kịch bản 1.3: Thống kê số lượng Ticket quá hạn (Resolution Overdue)**
  + **Given:** Admin đang xem Dashboard.
  + **When:** Hệ thống tính toán chỉ số Ticket cần chú ý.
  + **Then:** Hiển thị chính xác tổng số đếm (count) hoặc danh sách các Ticket đã vượt quá thời gian Resolution SLA quy định. Ticket vượt SLA được xem là quá hạn giải quyết (Overdue), không cần tạo rule long-running riêng biệt.
* **Kịch bản 1.4: Tính Thời gian giải quyết trung bình (Average Resolution Time)**
  + **Given:** Admin xem Dashboard ở kỳ báo cáo mặc định.
  + **When:** Hệ thống tính toán Average Resolution Time.
  + **Then:** Chỉ số này = Tổng thời gian Ticket nằm ở NEW và IN\_PROGRESS (cộng dồn qua các lần Reopen). Tuyệt đối không tính thời gian Ticket nằm ở WAITING\_FOR\_EMPLOYEE hoặc RESOLVED. Bắt buộc phải có chỉ số này trên Dashboard.
* **Kịch bản 1.5: Xử lý Ticket Reopen trong đo lường Average Resolution**
  + **Given:** Một Ticket đã từng RESOLVED nhưng sau đó bị Reopen và hiện đang ở trạng thái IN\_PROGRESS hoặc WAITING\_FOR\_EMPLOYEE.
  + **When:** Hệ thống quét tập dữ liệu để tính Average Resolution Time.
  + **Then:** Ticket này bị tạm loại khỏi tập tính toán.
  + **And When:** Ticket này được chuyển sang RESOLVED lại một lần nữa.
  + **Then:** Ticket được tính vào kỳ báo cáo chứa lần RESOLVED mới nhất, và thời gian giải quyết tiếp tục được cộng dồn thay vì reset lại từ đầu.

2. Nhóm Lỗi và Ngoại lệ (Negative/Error Scenarios)

* **Kịch bản 2.1: Chặn truy cập sai thẩm quyền (Permission Strict Check)**
  + **Given:** Một tài khoản đang đăng nhập với Role là Support Agent hoặc Employee.
  + **When:** Cố tình truy cập URL của trang Dashboard hoặc gọi API lấy số liệu thống kê.
  + **Then:** Backend phát hiện sai quyền, từ chối thao tác và trả về lỗi 403 Forbidden. Giao diện Frontend (Route) chặn truy cập và điều hướng người dùng về trang chủ của họ.
* **Kịch bản 2.2: Không có dữ liệu trong kỳ báo cáo (No Data Handling)**
  + **Given:** Admin chọn một kỳ báo cáo (từ ngày - đến ngày).
  + **When:** Trong kỳ báo cáo này không có bất kỳ Ticket nào thỏa mãn điều kiện hợp lệ.
  + **Then:** API tính toán không bị lỗi (chia cho 0) VÀ giao diện Dashboard hiển thị trạng thái "Chưa có dữ liệu" tại khu vực biểu đồ/chỉ số Average Resolution Time.

3. Nhóm Biên và Giới hạn (Boundary/Data Constraints)

* **Quy tắc 3.1 - Tập Ticket hợp lệ (Eligible Set) cho Average Resolution Time:** Chỉ được tính các Ticket HIỆN ĐANG ở trạng thái RESOLVED hoặc CLOSED VÀ có lần chuyển sang RESOLVED gần nhất nằm gọn trong kỳ báo cáo. Bắt buộc phải loại toàn bộ Ticket đang CANCELLED, NEW, IN\_PROGRESS và WAITING\_FOR\_EMPLOYEE.
* **Quy tắc 3.2 - Tính duy nhất:** Mỗi Ticket hợp lệ chỉ được đưa vào công thức tính một lần duy nhất trong kỳ báo cáo, không đếm trùng lặp nếu Ticket chuyển đổi nhiều lần.
* **Quy tắc 3.3 - Múi giờ hệ thống (Timezone Check):** Toàn bộ các phép lọc kỳ báo cáo và truy vấn mốc thời gian "chuyển sang RESOLVED gần nhất" bắt buộc phải dùng giờ Việt Nam (GMT+7) để đảm bảo số liệu báo cáo qua các ngày không bị sai lệch.
* **Quy tắc 3.4 - Phạm vi tính năng MVP:** Không bắt buộc hiển thị chỉ số Thời gian phản hồi trung bình (Average First Response Time) trên Dashboard MVP (chỉ số này vẫn được theo dõi riêng lẻ trên từng Ticket).

4. Nhóm Hiệu năng và Giao diện (Non-Functional/UI/UX)

* **Quy tắc 4.1 - Cấu hình bộ lọc thời gian mặc định:** Tại màn hình Dashboard, bộ chọn kỳ báo cáo mặc định được thiết lập là 30 ngày lịch (bao gồm cả ngày hôm nay). Giao diện phải cho phép người dùng (Admin) chọn các kỳ báo cáo khác (ví dụ: tuần này, tháng trước, hoặc custom date range).
* **Quy tắc 4.2 - Bố cục Metric (UI Metrics):** Các số liệu mang tính giám sát (Workload, Overdue, Unassigned, Average Resolution) cần được làm nổi bật bằng các thẻ hiển thị (Cards/Widgets) lớn ở phía trên cùng của Dashboard để Admin có cái nhìn tổng quan ngay lập tức về hiệu suất xử lý (processing performance).

## EPIC 12 – Quality, Security, Integration & Delivery

Các task này là yêu cầu bắt buộc để hoàn thành sản phẩm, không phải “phần dư nếu còn thời gian”.

Rule gửi lại thao tác / duplicate submit:

* Các thao tác tạo hoặc cập nhật dữ liệu phải tránh bị ghi nhận nhiều lần khi người dùng double-click, gửi lại request hoặc retry sau khi mạng chậm.
* Frontend cần ngăn gửi lặp trong lúc request đang được xử lý.
* Backend phải kiểm tra trạng thái/version hiện tại và đảm bảo request gửi lặp không tạo duplicate Ticket, Comment, History hoặc thực hiện cùng một transition nhiều lần.
* Xử lý duplicate submit không thay thế cơ chế version check của Concurrent Actions; nếu dữ liệu đã thay đổi thì thao tác stale vẫn phải bị từ chối theo rule của Epic 13.

| **Task** | **Nội dung** | **Ưu tiên** | **Estimate** |
| --- | --- | --- | --- |
| T12.1 | Ngăn duplicate submit/retry cho các thao tác ghi dữ liệu; không để double-click hoặc request gửi lại tạo dữ liệu hoặc transition trùng | P1 | 0.5 PD |
| T12.2 | Review toàn bộ server-side authorization | P0 | 0.75 PD |
| T12.3 | Test Internal Note/data không leak qua API | P0 | 0.5 PD |
| T12.4 | Kiểm tra password/secrets/log không chứa dữ liệu nhạy cảm | P0 | 0.5 PD |
| T12.5 | Loading/Error/Empty state cho các màn hình chính | P1 | 0.75 PD |
| T12.6 | Tạo test dataset + đo pagination/performance | P1 | 1.0 PD |
| T12.7 | End-to-End/Regression cho core flow | P0 | 1.5 PD |
| T12.8 | README, migration, deploy/redeploy và recovery guide | P0 | 1.5 PD |

**Epic estimate: 7.0 PD**

**Acceptance Criteria**

1. Nhóm Quality & Data Consistency (Chất lượng dữ liệu)

* **Quy tắc 1.1: Ngăn chặn Duplicate Submit (T12.1) - Phía Frontend**
  + Tại tất cả các form tạo mới (Create Ticket) và cập nhật (Edit Ticket, Add Comment, Change Status): Ngay sau khi người dùng click nút "Gửi/Lưu", nút bấm bắt buộc phải chuyển sang trạng thái "Loading" VÀ bị disable (vô hiệu hóa) cho đến khi nhận được phản hồi từ server.
* **Quy tắc 1.2: Ngăn chặn Duplicate Submit (T12.1) - Phía Backend**
  + Backend phải có cơ chế kiểm tra (Ví dụ: Idempotency key, version check, hoặc check trạng thái dữ liệu gần nhất) để đảm bảo nếu Frontend lỡ gửi 2 request giống hệt nhau cùng lúc do mạng lag/retry, hệ thống KHÔNG tạo ra 2 Ticket giống nhau, 2 Comment trùng lặp, hoặc ghi log History 2 lần.
  + *Lưu ý:* Cơ chế này hoạt động độc lập và không thay thế luật check Stale Data của luồng Concurrent (Epic 13).

2. Nhóm Security (Bảo mật & Phân quyền)

* **Quy tắc 2.1: Server-side Authorization Review (T12.2)**
  + 100% các API thay đổi dữ liệu (POST, PUT, PATCH, DELETE nếu có) phải được kiểm tra Role từ Token tại Backend. Việc ẩn nút trên UI không được coi là biện pháp bảo mật hợp lệ.
* **Quy tắc 2.2: Rò rỉ dữ liệu nội bộ (Data Leakage - T12.3)**
  + Các API dành cho Role Employee (như My Tickets, Ticket Detail) tuyệt đối không trả về trường Internal Note trong JSON Payload. (Yêu cầu viết test case tự động hoặc test Postman để chứng minh).
* **Quy tắc 2.3: Xử lý dữ liệu nhạy cảm (T12.4)**
  + Mật khẩu phải được mã hóa (hashing). Không lưu plain text.
  + Các thông tin Secrets (Database password, JWT Secret Key) không được hard-code trong mã nguồn, bắt buộc dùng biến môi trường (Environment Variables).
  + Server Logs (Console/File) không được in ra nội dung mật khẩu hoặc token của người dùng.

3. Nhóm UI/UX & Hiệu năng (Giao diện & Tốc độ)

* **Quy tắc 3.1: Trạng thái màn hình (T12.5)**
  + Tất cả các màn hình chính (Dashboard, Support Queue, My Tickets) phải có đủ 3 trạng thái:
    - **Loading State:** Hiển thị Spinner/Skeleton khi đang gọi API.
    - **Error State:** Thông báo rõ ràng (kèm nút Retry) nếu API lỗi (500, mạng rớt).
    - **Empty State:** Hình ảnh/thông báo thân thiện khi không có dữ liệu, kèm nút Call-to-action (ví dụ: "Tạo Ticket mới").
* **Quy tắc 3.2: Pagination & Performance (T12.6)**
  + Tất cả các danh sách dài (Ticket Queue, History) bắt buộc áp dụng phân trang (Pagination).
  + Phải có bộ Test Dataset (ví dụ script sinh 10,000 tickets) để đo đạc và đảm bảo API query phân trang phản hồi dưới 2 giây.

4. Nhóm Integration & Delivery (Đóng gói & Bàn giao)

* **Quy tắc 4.1: Test luồng cốt lõi (T12.7)**
  + Thực hiện chạy Regression Test thành công 100% cho Core Flow: Employee tạo Ticket → Agent nhận → Thêm Comment qua lại → Agent Resolve → Đóng.
* **Quy tắc 4.2: Tài liệu kỹ thuật (T12.8)**
  + Phải bàn giao đầy đủ file README.md hướng dẫn setup dự án.
  + Cung cấp các file script Migration Database (SQL).
  + Cung cấp tài liệu hướng dẫn Deploy/Redeploy lên môi trường server chung và Recovery Guide (Hướng dẫn phục hồi khi server sập).

## EPIC 13 – Concurrent Actions & Data Consistency

### US29 – Xử lý xung đột khi nhiều người thao tác đồng thời

**User Story:** *As a user, I want conflicting actions based on stale Ticket data to be rejected so that valid changes are not overwritten.*

**Business rules đã chốt**

|  |
| --- |
| Mỗi thao tác kiểm tra quyền, trạng thái, Assignee và phiên bản Ticket tại thời điểm ghi nhận.   * Nếu Ticket đã thay đổi sau khi người dùng tải dữ liệu, thao tác dựa trên phiên bản cũ bị từ chối; người dùng được yêu cầu tải lại dữ liệu trước khi thao tác tiếp. * Hai Agent cùng Take: chỉ một người thành công; Ticket vẫn NEW và chỉ có một Assignee. * Edit vs Start Processing: Employee lưu trước thì Start trên phiên bản cũ bị từ chối; Agent Start trước thì Edit bị từ chối và Employee bổ sung bằng Public Comment. Nội dung Employee đang nhập phải được giữ để không mất bản nháp. * Cancel vs Resolve: trạng thái được ghi nhận thành công trước được giữ; thao tác còn lại bị từ chối. * Cập nhật Ticket, SLA, comment bắt buộc và History liên quan phải cùng thành công hoặc cùng thất bại. |

| **Task / Nội dung (P0)** | **Estimate** |
| --- | --- |
| T13.1 – Kiểm tra version/stale data tập trung cho các thao tác cập nhật Ticket | 0.5 PD |
| T13.2 – Edit Ticket vs Start Processing + giữ draft và thông báo tải lại/Comment | 0.5 PD |
| T13.3 – Cancel Ticket vs Resolve Ticket theo trạng thái được ghi nhận trước | 0.5 PD |
| T13.4 – Đảm bảo tính nhất quán cho Ticket + SLA + comment bắt buộc + History | 0.5 PD |
| T13.5 – Integration test cả hai thứ tự cho Take/Take, Edit/Start và Cancel/Resolve | 0.5 PD |
| **Epic estimate** | **2.5 PD** |

**Acceptance Criteria**

1. Nhóm Chức năng (Functional/Happy Path)

* **Kịch bản 1.1: Xử lý xung đột khi hai Agent cùng nhận việc (Take vs Take)**
  + **Given:** Một Ticket đang ở trạng thái NEW và chưa có Assignee. Hai Agent (A và B) đang cùng mở màn hình chi tiết Ticket này.
  + **When:** Agent A và Agent B cùng nhấn nút "Nhận việc" (Take) gần như cùng một lúc.
  + **Then:** Request nào đến Database trước sẽ được ghi nhận thành công. Agent đó trở thành Assignee duy nhất, trạng thái Ticket vẫn giữ nguyên là NEW. Agent chậm hơn sẽ nhận được thông báo lỗi từ chối thao tác.
* **Kịch bản 1.2: Xử lý xung đột Edit vs Start Processing (Employee thao tác trước)**
  + **Given:** Employee đang mở form Edit Ticket (NEW) và Agent đang mở màn hình chi tiết Ticket đó.
  + **When:** Employee bấm Lưu (Edit) thành công TRƯỚC KHI Agent bấm "Bắt đầu xử lý" (Start Processing).
  + **Then:** Thông tin Ticket được cập nhật theo nội dung Edit của Employee. Khi Agent bấm Start, hệ thống từ chối thao tác do Agent đang dùng phiên bản dữ liệu cũ (stale data) và yêu cầu Agent tải lại trang.
* **Kịch bản 1.3: Xử lý xung đột Cancel vs Resolve (Ghi nhận theo thứ tự ưu tiên thời gian)**
  + **Given:** Ticket đang ở IN\_PROGRESS. User A (Employee/Admin) thực hiện Cancel, cùng lúc đó User B (Agent) thực hiện Resolve.
  + **When:** Request của User A hoặc User B được Database ghi nhận thành công trước.
  + **Then:** Trạng thái Ticket được chốt theo thao tác đến trước (chuyển thành CANCELLED hoặc RESOLVED). Thao tác của người đến sau sẽ bị hệ thống từ chối hoàn toàn.

2. Nhóm Lỗi và Ngoại lệ (Negative/Error Scenarios)

* **Kịch bản 2.1: Chặn thao tác cập nhật trên dữ liệu cũ (Stale Data Rejection)**
  + **Given:** Người dùng mở một Ticket ở phiên bản X.
  + **When:** Người dùng thực hiện thao tác cập nhật (đổi trạng thái, assign, edit), nhưng dữ liệu trong Database lúc này đã bị người khác thay đổi thành phiên bản X+1.
  + **Then:** Backend phát hiện sai lệch phiên bản, từ chối thao tác (trả lỗi HTTP 409 Conflict hoặc 400) VÀ trả về thông báo: "Dữ liệu đã bị thay đổi bởi người khác. Vui lòng tải lại trang trước khi tiếp tục".
* **Kịch bản 2.2: Edit vs Start Processing (Agent thao tác trước - Giữ bản nháp cho Employee)**
  + **Given:** Employee đang nhập dở nội dung vào form Edit Ticket (NEW). Cùng lúc đó, Agent bấm "Bắt đầu xử lý" thành công (Ticket chuyển sang IN\_PROGRESS).
  + **When:** Employee bấm Lưu (Save Edit) nội dung.
  + **Then:** Hệ thống từ chối thao tác Edit do Ticket không còn là NEW.
  + **Đặc biệt:** Giao diện Frontend KHÔNG ĐƯỢC xóa trắng nội dung Employee đang nhập (để không mất bản nháp). Hệ thống hiển thị cảnh báo: "Yêu cầu đã bắt đầu được xử lý. Vui lòng gửi thông tin bổ sung này thông qua phần Bình luận công khai".

3. Nhóm Biên và Giới hạn (Boundary/Data Constraints)

* **Quy tắc 3.1 - Cơ chế kiểm tra Version:** Mọi thao tác cập nhật (Update) Ticket bắt buộc phải gửi kèm một định danh phiên bản (ví dụ: version dạng số nguyên tăng dần, hoặc timestamp updated\_at của lần tải dữ liệu). Backend dùng tham số này để so sánh với version hiện tại trong Database tại thời điểm ghi nhận.
* **Quy tắc 3.2 - Tính toàn vẹn giao dịch (Database Transaction):** Việc kiểm tra version, cập nhật dữ liệu Ticket, cập nhật đồng hồ SLA, lưu Comment bắt buộc (nếu có), và ghi log History phải được thực thi trong CÙNG MỘT Transaction. Nếu phát hiện xung đột version hoặc lỗi ở bất kỳ bước nào, toàn bộ quá trình phải bị Rollback (cùng thành công hoặc cùng thất bại).

4. Nhóm Hiệu năng và Giao diện (Non-Functional/UI/UX)

* **Quy tắc 4.1 - Nút Tải lại nhanh trên thông báo lỗi:** Khi UI nhận được lỗi từ chối do Stale Data (dữ liệu cũ), hộp thoại báo lỗi nên cung cấp sẵn một nút "Tải lại dữ liệu" (Reload) để người dùng có thể cập nhật phiên bản mới nhất ngay lập tức mà không cần F5 toàn bộ trình duyệt.
* **Quy tắc 4.2 - UX cho việc giữ bản nháp (Draft Retention):** Trong trường hợp Kịch bản 2.2 (Employee bị từ chối Edit), UI có thể hỗ trợ nâng cao bằng cách tự động copy bản nháp từ form Edit dán thẳng xuống ô soạn thảo Public Comment, giúp Employee chỉ cần bấm "Gửi bình luận" là xong.

# 5. Tổng hợp Estimate

| **Epic** | **Estimate** |
| --- | --- |
| E0 – Foundation | 4.5 PD |
| E1 – Auth/User | 6.0 PD |
| E2 – Request Type | 1.5 PD |
| E3 – Create Ticket/Priority | 5.5 PD |
| E4 – Employee Ticket Management | 4.0 PD |
| E5 – Queue/Assignment | 5.5 PD |
| E6 – Lifecycle | 6.0 PD |
| E7 – Communication | 3.75 PD |
| E8 – History | 4.0 PD |
| E9 – Search/Filter | 3.5 PD |
| E10 – SLA | 6.5 PD |
| E11 – Dashboard | 4.25 PD |
| E12 – Quality/Delivery | 7.0 PD |
| E13 – Concurrent Actions & Data Consistency | 2.5 PD |
| **TỔNG BACKLOG ĐÃ CHỐT** | **64.5 PD** |

|  |
| --- |
| **Capacity** Tuần 2–8 có khoảng 70 PD lý thuyết cho 2 thành viên. Backlog đã chốt khoảng 64.5 PD, còn khoảng 5.5 PD buffer cho bug, integration, review, PO feedback và task bị underestimate. Không nên dùng buffer này để mở rộng scope sớm. |

# 6. Roadmap triển khai đề xuất (Tuần 2–8)

| **Tuần** | **Trọng tâm** | **Task ID** | **Estimate mục tiêu** |
| --- | --- | --- | --- |
| Tuần 2 | Foundation + Auth + Core Data | T0.1–T0.4; T1.1–T1.3; T3.1–T3.2; T8.1 | 9.5 PD |
| Tuần 3 | Vertical Slice + Queue/Assign + Lifecycle base | T0.5; T1.4; T3.3–T3.5; T4.1–T4.2; T5.1–T5.6; T6.1–T6.2 | 10.0 PD |
| Tuần 4 | Lifecycle + Communication + Reassign + Impact/Urgency | T3.6–T3.7; T5.7–T5.9; T6.3–T6.7; T7.1–T7.5 | 10.0 PD |
| Tuần 5 | Employee Rules + User/Request Type Admin + Audit Integration | T1.5–T1.8; T2.1–T2.3; T4.3–T4.8; T6.8; T7.6; T8.2 | 9.5 PD |
| Tuần 6 | History + Search/Filter + SLA Core | T8.3–T8.5; T9.1–T9.5; T10.1–T10.4 | 9.75 PD |
| Tuần 7 | SLA + Dashboard + Concurrent/Hardening | T10.5–T10.7; T11.1–T11.6; T12.1; T13.1–T13.5 | 9.25 PD |
| Tuần 8 | Security + Regression + Delivery | T12.2–T12.8 | 6.5 PD |
| **Tổng** | | | **64.5 PD** |

# 7. Dependency và thứ tự thực hiện

**Authentication/User Role → Ticket Domain/Impact/Urgency/Priority → Ticket Detail → Support Queue → Assignment → Lifecycle → Communication → History/Search → SLA → Reporting → Concurrent/Hardening.**

* Không làm Dashboard Overdue trước khi SLA Core hoàn thành vì metric phụ thuộc Resolution SLA.
* Audit Event model/service (T8.1) được triển khai từ giai đoạn Foundation ở Tuần 2 để các feature Edit, Impact/Urgency/Priority, Assignment, Lifecycle, Cancel và quản trị có thể phát Audit Event ngay từ đầu. History API/UI có thể hoàn thiện ở các tuần sau.
* Lifecycle nên tập trung trong một State Transition Service/Policy thay vì rải kiểm tra status ở nhiều API.
* Priority phải luôn được tính từ Impact × Urgency. Employee không chỉnh trực tiếp Priority; Agent phụ trách/Admin chỉ thay đổi Impact/Urgency theo quyền đã chốt và hệ thống tự tính lại Priority.
* Các thao tác có nhiều cập nhật liên quan như Wait for Employee, Resume Processing, Resolve, Cancel và Reassign phải đảm bảo Ticket, Comment/Reason, SLA và History được cập nhật nhất quán.
* Tích hợp sớm các tính năng cốt lõi : Các cơ chế quan trọng như ghi nhận Audit History, luồng Public Comment, và kiểm tra xung đột đồng thời (Concurrent Actions / Version Check) sẽ *không* bị dồn lại hay để đến cuối dự án mới làm. Thay vào đó, chúng được thiết kế nền tảng từ sớm và tích hợp cuốn chiếu (incremental integration) ngay vào các API lõi (như Edit Ticket, Change Status, Assign) bắt đầu từ Tuần 4 và Tuần 5. Điều này đảm bảo tính toàn vẹn dữ liệu (Transaction) và luồng End-to-End được kiểm thử xuyên suốt từ sớm.

# 8. Các hạng mục rủi ro cao cần review kỹ

| **Hạng mục** | **Rủi ro / lý do** | **Cách kiểm soát** |
| --- | --- | --- |
| SLA Resolution | Pause/resume/reopen/change priority làm timer phức tạp; không thể tính đơn giản từ Created At | Viết scenario test theo timeline và review chéo |
| Permission | Employee/Agent phụ trách/Agent khác/Admin có quyền khác nhau; Internal Note có nguy cơ leak | Enforce backend + permission test riêng |
| Lifecycle | Nhiều transition kèm điều kiện, comment/lý do và terminal status | State transition matrix + service tập trung |
| History | Nếu thêm muộn sẽ phải sửa nhiều service để ghi before/after | Thiết kế audit event sớm; UI làm sau |
| Concurrent actions | Dữ liệu cũ có thể gây Take/Edit/Start/Cancel/Resolve xung đột; các cập nhật liên quan phải nhất quán | Version check + xử lý nhất quán + test cả hai thứ tự của 3 tình huống |
| Average Resolution Dashboard | Reopen, trạng thái hiện tại và mốc Resolved gần nhất có thể làm số liệu kỳ báo cáo thay đổi | Test cross-month, reopen, Cancelled, no-data và kỳ 30 ngày theo giờ Việt Nam |

# 9. Definition of Ready (DoR)

Một User Story chỉ nên được kéo vào phát triển khi đáp ứng:

* Business rule đã Close hoặc được PO xác nhận rõ.
* Acceptance Criteria đủ để kiểm thử.
* Role/permission của thao tác rõ ràng.
* Input/output và error case chính rõ.
* Dependency đã sẵn sàng.
* Không còn câu hỏi nghiệp vụ P0 chặn việc triển khai.

# 10. Definition of Done (DoD)

* Backend business rule hoàn thành.
* Frontend hoàn thành nếu story có UI.
* Server-side permission được kiểm tra.
* Validation, loading/error/empty state phù hợp.
* Happy path và error/permission case đã test.
* Code review và xử lý review comment.
* Migration/API documentation cập nhật nếu có.
* Chạy được trên môi trường chung.
* Demo được theo Acceptance Criteria.

# 11. Nguyên tắc phân công cho 2 thành viên

Không nên chia cố định A = Frontend, B = Backend. Requirement Brief yêu cầu cả hai cùng tham gia API, dữ liệu, giao diện, testing và review. Nên chia theo vertical slice và luân phiên implement/review.

| **Feature** | **Người triển khai chính** | **Người còn lại** |
| --- | --- | --- |
| Authentication | A: backend/auth + schema | B: login UI/integration/test + review |
| Create Ticket | B: ticket schema/API | A: form UI/integration/test + review |
| Queue/Assignment | A: business/API | B: UI/test + review |
| Lifecycle/Comments | B: business/API | A: UI/test + review |
| History/Search | A: query/audit API | B: UI/test + review |
| SLA/Dashboard | B: SLA engine/query | A: UI/scenario test + review |

|  |
| --- |
| **Lưu ý:** Phân công trên là đề xuất cân bằng kỹ năng, không phải requirement nghiệp vụ. Có thể đảo A/B theo năng lực thực tế miễn vẫn đảm bảo review chéo và cả hai tham gia end-to-end. |