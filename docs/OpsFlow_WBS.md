## Overview
| OpsFlow — Hướng dẫn và kế hoạch | Nội dung | Ghi chú |
| --- | --- | --- |
| Thời lượng | 2 tháng, khoảng 8 tuần | Khung sprint đề xuất theo roadmap đã trao đổi; chưa chốt ngày lịch. |
| Sprint 0 — Tuần 1 | Yêu cầu, Q&A, backlog, wireframe, đề xuất kỹ thuật | Đề xuất kỹ thuật lập thành file riêng. Không tự đánh dấu hoàn tất. |
| Sprint 1 — Tuần 2 | Nền tảng và luồng tạo/xem ticket đầu tiên | Chọn task theo capacity thực tế; kế hoạch cũ tuần 2 đang vượt 10 PD. |
| Sprint 2 — Tuần 3–4 | Assignment, lifecycle, comments, edit/cancel | Tích hợp public comment, audit và kiểm tra phiên bản cùng từng luồng. |
| Sprint 3 — Tuần 5–6 | History UI, tìm kiếm, SLA, dashboard | Dashboard phụ thuộc SLA. Ghi nhận thời gian/trạng thái từ các sprint trước. |
| Sprint 4 — Tuần 7 | Kiểm thử tổng hợp, quyền, đồng thời, hiệu năng, sửa lỗi | Không để đến tuần 7 mới xây cơ chế chống xung đột. |
| Sprint 5 — Tuần 8 | Nghiệm thu, tài liệu, demo và bàn giao | NaN |
| Đơn vị effort | PD — ngày công của một người | Task chung tính tổng công của hai người. |
| Capacity tuần 2–8 | 70 PD lý thuyết | 7 tuần × 5 ngày × 2 người. Trừ lịch học, nghỉ, họp và thời gian không sẵn sàng trước khi cam kết. |
| Estimate backlog v1.0 | 63,5 PD — cần rà soát lại | Chưa phải cam kết. Cập nhật sau khi bổ sung task thiếu và sửa dependency. |
| Dự phòng lý thuyết | 6,5 PD trước khi điều chỉnh capacity | Không phân bổ sẵn vào task. Không dùng để mở rộng phạm vi sớm. |
| Tổng hợp | Effort cộng từ task; ngày lấy min/max trong sprint | NaN |
| Trạng thái task | Open / In-progress / Blocked / Review / Done | NaN |
| Điều kiện bắt đầu | Rule rõ, AC kiểm thử được, dependency sẵn sàng | Gắn mã Q&A và task phụ thuộc trong Note. |
| Điều kiện hoàn tất | Code review, test, quyền API, tài liệu và demo đạt AC | NaN |
| Cách phối hợp | Hai bạn luân phiên triển khai và review | Mỗi task có PIC chính; người review ghi trong Note. |
| Thông tin thêm | Planning đầu sprint, cập nhật blocker, demo mỗi tuần | NaN |
| Báo vướng mắc | Chủ động báo mentor khi bị chặn hoặc có nguy cơ trễ | Nêu vấn đề, đã thử gì, ảnh hưởng và hỗ trợ cần thiết. |
| Công nghệ | Đề xuất kỹ thuật và tổ chức dự án | NaN |
| Repository | Chưa cung cấp | NaN |
| Giao diện tham khảo | https://opsflow-fe.vercel.app | NaN |
| Cơ sở kế hoạch | OpsFlow\_Requirement\_Brief | NaN |
| NaN | OpsFlow\_Product\_Backlog\_v1.0 | NaN |
| NaN | Q&A Management\_v1.0 | NaN |

## WBS
| Unnamed: 0 | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 | Unnamed: 6 | Unnamed: 7 | Unnamed: 8 | Unnamed: 9 | Unnamed: 10 | Unnamed: 11 | Unnamed: 12 | Unnamed: 13 | Unnamed: 14 | Unnamed: 15 | Unnamed: 16 | Unnamed: 17 | Unnamed: 18 | Unnamed: 19 | Unnamed: 20 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| NaN | OpsFlow — WBS — Kế hoạch OJT 8 tuần | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| NaN | No. | NaN | Task | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | PIC | Effort (PD) | NaN | Start | End | Status | Note |
| NaN | Tổng | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| NaN | Sprint 0 — Tuần 1 — Làm rõ yêu cầu và đề xuất kỹ thuật | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| NaN | S0.1 | NaN | Rà soát Requirement Brief, phạm vi MVP và các role/permission | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | LocLD11 / PhanDV2 |  | NaN |  |  | Review | NaN |
| NaN | S0.2 | NaN | Tổng hợp Q&A và chốt business rules làm cơ sở cho committed backlog | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | LocLD11 / PhanDV2 |  | NaN |  |  | Review | NaN |
| NaN | S0.3 | NaN | Hoàn thiện Product Backlog, estimate, dependency và roadmap | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | LocLD11 / PhanDV2 |  | NaN |  |  | Review | NaN |
| NaN | S0.4 | NaN | Rà soát Wireframe/Frontend prototype theo Backlog và Acceptance Criteria | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | LocLD11 / PhanDV2 |  | NaN |  |  | Review | NaN |
| NaN | S0.5 | NaN | Hoàn thiện đề xuất kỹ thuật: JWT/Refresh Token, Audit, SLA, concurrency, AWS/Nginx/Supabase | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | LocLD11 / PhanDV2 |  | NaN |  |  | Review | NaN |
| NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |  | NaN |  |  | NaN | NaN |
| NaN | Sprint 1 — Tuần 2 — Nền tảng và luồng đầu tiên | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| NaN | T0.1 | NaN | Thiết kế data model v1: ERD chuẩn cho các bảng User, Role, Ticket, Request Type, Comment, History và các relation chính | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | LocLD11 | 1,00 | NaN |  |  | NaN | NaN |
| NaN | T0.2 | NaN | Setup khung dự án Backend (Spring Boot/NodeJS...), Frontend (React/Flutter...), cấu hình Database kết nối và biến môi trường chung | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | LocLD11 / PhanDV2 | 1,00 | NaN |  |  | NaN | NaN |
| NaN | T0.3 | NaN | Thiết lập hệ thống Database Migration (Flyway/Liquibase) và baseline schema khởi tạo database | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | LocLD11 | 0,75 | NaN |  |  | NaN | NaN |
| NaN | T0.4 | NaN | Thống nhất API convention, cấu trúc JSON Response chuẩn, định nghĩa mã lỗi (Error Response) và quy tắc đặt tên (Naming) | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | LocLD11 / PhanDV2 | 0,75 | NaN |  |  | NaN | NaN |
| NaN | T1.1 | NaN | Xây dựng User/Role/Account Status model | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | LocLD11 | 0,50 | NaN |  |  | NaN | NaN |
| NaN | T1.2 | NaN | Viết API POST /login, xử lý mã hóa mật khẩu (Password Hashing), cơ chế cấp phát Session/Token (JWT) và bảo mật thông tin trả về | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | LocLD11 | 1,50 | NaN |  |  | NaN | NaN |
| NaN | T1.3 | NaN | Dựng giao diện form Login (Input, Validation, Show/Hide Password), xử lý trạng thái Loading chống duplicate submit và thiết lập Protected Route điều hướng theo Role ở Frontend | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | PhanDV2 | 1,00 | NaN |  |  | NaN | NaN |
| NaN | T3.1 | NaN | Xây dựng Ticket Model, định nghĩa các thuộc tính cơ bản (Ticket Code unique, Title, Description, Status, Request Type, Impact, Urgency, Priority, Creator, Assignee, Created Time), thiết lập quan hệ (Relation) với User và viết file Database Migration. | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | PhanDV2 | 1,00 | NaN |  |  | NaN | NaN |
| NaN | T3.2 | NaN | Implement Impact/Urgency và Priority Matrix P1–P4 | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 1,00 | NaN |  |  | NaN | NaN |
| NaN | T8.1 | NaN | Audit Event model/service | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | LocLD11 | 1,00 | NaN |  |  | NaN | NaN |
| NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| NaN | Sprint 2 — Tuần 3 — Vertical Slice + Queue/Assign + Lifecycle base | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| NaN | T0.5 | NaN | Thiết lập build pipeline và deploy cơ bản lên môi trường demo chung trên server | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | PhanDV2 | 1,00 | NaN | NaN | NaN | NaN | NaN |
| NaN | T1.4 | NaN | Viết Unit Test cho thuật toán hash, thực thi Postman Test kiểm tra các case (Đăng nhập đúng/sai, tài khoản bị khóa, chặn 403 khi cố truy cập trái phép) và test giao diện | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | LocLD11 / PhanDV2 | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T3.3 | NaN | Create Ticket API + validation + chỉ Employee được tạo | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,75 | NaN | NaN | NaN | NaN | NaN |
| NaN | T3.4 | NaN | Create Ticket UI | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 1,00 | NaN | NaN | NaN | NaN | NaN |
| NaN | T3.5 | NaN | Test Priority Matrix và Create Ticket | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,75 | NaN | NaN | NaN | NaN | NaN |
| NaN | T4.1 | NaN | API My Tickets + Ticket Detail với ownership permission | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T4.2 | NaN | UI My Tickets + Ticket Detail | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T5.1 | NaN | Support Queue API và permission view toàn đội | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T5.2 | NaN | Support Queue UI + All / Unassigned / Assigned to Me | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T5.3 | NaN | Take Ticket business rule | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,75 | NaN | NaN | NaN | NaN | NaN |
| NaN | T5.4 | NaN | Xử lý case hai Agent cùng Take theo rule Q&A đã Close | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,25 | NaN | NaN | NaN | NaN | NaN |
| NaN | T5.5 | NaN | Assign API + Agent validation | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T5.6 | NaN | Assign UI | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T6.1 | NaN | Xây State Transition Service và permission matrix | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 1,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T6.2 | NaN | Implement NEW → IN\_PROGRESS | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| NaN | Sprint 2 — Tuần 4 — Lifecycle + Communication + Reassign + Impact/Urgency | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| NaN | T3.6 | NaN | Implement API/business rule cho Agent phụ trách/Admin điều chỉnh Impact/Urgency + reason + permission + recalculated Priority + Audit Event | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T3.7 | NaN | UI điều chỉnh Impact/Urgency, hiển thị Calculated Priority và validation theo status/permission | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T5.7 | NaN | Reassign API + invariant + reason | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,75 | NaN | NaN | NaN | NaN | NaN |
| NaN | T5.8 | NaN | Reassign UI | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T5.9 | NaN | Assignment test suite | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 1,25 | NaN | NaN | NaN | NaN | NaN |
| NaN | T6.3 | NaN | Implement IN\_PROGRESS → WAITING\_FOR\_EMPLOYEE + Public Question | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,75 | NaN | NaN | NaN | NaN | NaN |
| NaN | T6.4 | NaN | Implement WAITING\_FOR\_EMPLOYEE → IN\_PROGRESS: Employee Public Comment tự động Resume hoặc Agent phụ trách/Admin chủ động Resume với lý do | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,75 | NaN | NaN | NaN | NaN | NaN |
| NaN | T6.5 | NaN | Implement IN\_PROGRESS → RESOLVED + Public Solution | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,75 | NaN | NaN | NaN | NaN | NaN |
| NaN | T6.6 | NaN | Implement RESOLVED → CLOSED / IN\_PROGRESS | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,75 | NaN | NaN | NaN | NaN | NaN |
| NaN | T6.7 | NaN | Chặn thao tác tại CLOSED/CANCELLED | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T7.1 | NaN | Comment model: PUBLIC / INTERNAL | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T7.2 | NaN | Comment API + permission/visibility | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,75 | NaN | NaN | NaN | NaN | NaN |
| NaN | T7.3 | NaN | Đảm bảo Internal Note không leak sang Employee API | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T7.4 | NaN | UI comment timeline + composer | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 1,00 | NaN | NaN | NaN | NaN | NaN |
| NaN | T7.5 | NaN | Rule no edit/delete + terminal status | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,25 | NaN | NaN | NaN | NaN | NaN |
| NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| NaN | Sprint 3 — Tuần 5 — Employee Rules + Admin + Audit Integration | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| NaN | T1.5 | NaN | API list/create/update account và role | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 1,00 | NaN | NaN | NaN | NaN | NaN |
| NaN | T1.6 | NaN | UI User Management | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,75 | NaN | NaN | NaN | NaN | NaN |
| NaN | T1.7 | NaN | Rule khóa Agent còn Ticket đang mở | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T1.8 | NaN | Rule bảo vệ Administrator cuối cùng | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,25 | NaN | NaN | NaN | NaN | NaN |
| NaN | T2.1 | NaN | Request Type model + API list/create/update/activate/deactivate; chỉ Request Type ACTIVE được dùng cho thao tác tạo/sửa Ticket | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,75 | NaN | NaN | NaN | NaN | NaN |
| NaN | T2.2 | NaN | Admin UI quản lý Request Type | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T2.3 | NaN | Validation, permission và test Request Type ACTIVE/INACTIVE, đảm bảo Ticket cũ vẫn giữ được Request Type đã sử dụng | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,25 | NaN | NaN | NaN | NaN | NaN |
| NaN | T4.3 | NaN | Edit Ticket API + kiểm tra status/owner | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,75 | NaN | NaN | NaN | NaN | NaN |
| NaN | T4.4 | NaN | Recalculate Priority khi Impact/Urgency đổi | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,25 | NaN | NaN | NaN | NaN | NaN |
| NaN | T4.5 | NaN | Edit Ticket UI + disable action khi không hợp lệ | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T4.6 | NaN | Cancel business rule + reason + permission | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T4.7 | NaN | UI Cancel + reason dialog | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T4.8 | NaN | Test edit/cancel/permission/state | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T6.8 | NaN | Test toàn bộ transition matrix, bao gồm cả hai trường hợp Resume từ WAITING\_FOR\_EMPLOYEE | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T7.6 | NaN | Permission/security tests | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,75 | NaN | NaN | NaN | NaN | NaN |
| NaN | T8.2 | NaN | Gắn Audit vào Edit Ticket, Impact/Urgency/Priority, Assignment/Reassignment, Lifecycle, Cancel và các thao tác quản trị User/Role/Account Status/Request Type | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 1,25 | NaN | NaN | NaN | NaN | NaN |
| NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| NaN | Sprint 3 — Tuần 6 — History + Search/Filter + SLA Core | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| NaN | T8.3 | NaN | History API với visibility theo role | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,75 | NaN | NaN | NaN | NaN | NaN |
| NaN | T8.4 | NaN | UI Timeline / History | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T8.5 | NaN | Audit visibility/permission tests cho Employee, Agent và Administrator, bao gồm Audit của các thao tác quản trị | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T9.1 | NaN | Backend dynamic filtering + AND/OR + permission scope | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 1,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T9.2 | NaN | Search Code / Partial Title | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T9.3 | NaN | Pagination 20/50/100 và total count | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T9.4 | NaN | UI Search/Filter/Pagination | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,75 | NaN | NaN | NaN | NaN | NaN |
| NaN | T9.5 | NaN | Query/permission tests | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,25 | NaN | NaN | NaN | NaN | NaN |
| NaN | T10.1 | NaN | SLA policy P1–P4 | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T10.2 | NaN | First Response clock và stop condition | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 1,00 | NaN | NaN | NaN | NaN | NaN |
| NaN | T10.3 | NaN | Resolution accumulated time + pause/resume | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 2,00 | NaN | NaN | NaN | NaN | NaN |
| NaN | T10.4 | NaN | Priority/Reassign interaction với SLA | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 1,00 | NaN | NaN | NaN | NaN | NaN |
| NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| NaN | Sprint 4 — Tuần 7 — Kiểm thử và hoàn thiện | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| NaN | T10.5 | NaN | Normal / Due Soon / Overdue calculation | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,75 | NaN | NaN | NaN | NaN | NaN |
| NaN | T10.6 | NaN | UI SLA indicator | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T10.7 | NaN | SLA test scenarios | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,75 | NaN | NaN | NaN | NaN | NaN |
| NaN | T11.1 | NaN | Workload by Agent + Unassigned query | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,75 | NaN | NaN | NaN | NaN | NaN |
| NaN | T11.2 | NaN | Resolution Overdue count/list | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,75 | NaN | NaN | NaN | NaN | NaN |
| NaN | T11.3 | NaN | Dashboard UI cơ bản + route/permission chỉ dành cho Administrator | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,75 | NaN | NaN | NaN | NaN | NaN |
| NaN | T11.4 | NaN | Average Resolution Time query: eligible set, lần Resolved gần nhất trong kỳ, accumulated NEW + IN\_PROGRESS | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 1,00 | NaN | NaN | NaN | NaN | NaN |
| NaN | T11.5 | NaN | Kỳ báo cáo Dashboard: mặc định 30 ngày lịch, cho phép chọn kỳ khác, dùng giờ Việt Nam và trạng thái “Chưa có dữ liệu” | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T11.6 | NaN | Test Average Resolution: Cancelled, Reopen, cross-month, current state và no-data | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T12.1 | NaN | Ngăn duplicate submit/retry cho các thao tác ghi dữ liệu; không để double-click hoặc request gửi lại tạo dữ liệu hoặc transition trùng | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T13.1 | NaN | Kiểm tra version/stale data tập trung cho các thao tác cập nhật Ticket | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T13.2 | NaN | Edit Ticket vs Start Processing + giữ draft và thông báo tải lại/Comment | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T13.3 | NaN | Cancel Ticket vs Resolve Ticket theo trạng thái được ghi nhận trước | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T13.4 | NaN | Đảm bảo tính nhất quán cho Ticket + SLA + comment bắt buộc + History | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T13.5 | NaN | Integration test cả hai thứ tự cho Take/Take, Edit/Start và Cancel/Resolve | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| NaN | Sprint 5 — Tuần 8 — Nghiệm thu và bàn giao | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN |
| NaN | T12.2 | NaN | Review toàn bộ server-side authorization | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,75 | NaN | NaN | NaN | NaN | NaN |
| NaN | T12.3 |  | Test Internal Note/data không leak qua API | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T12.4 |  | Kiểm tra password/secrets/log không chứa dữ liệu nhạy cảm | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T12.5 |  | Loading/Error/Empty state cho màn hình chính | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 0,75 | NaN | NaN | NaN | NaN | NaN |
| NaN | T12.6 |  | Test dataset + pagination/performance | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 1,00 | NaN | NaN | NaN | NaN | NaN |
| NaN | T12.7 |  | End-to-End / Regression core flow | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 1,50 | NaN | NaN | NaN | NaN | NaN |
| NaN | T12.8 |  | README, migration, AWS deploy/redeploy và recovery guide | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | NaN | TBD | 1,50 | NaN | NaN | NaN | NaN | NaN |

## Members
| Thành viên | Vai trò |
| --- | --- |
| ToanPT5 | PM |
| CuongNC58 | Mentor / PO |
| LocLD11 | Thực tập sinh |
| PhanDV2 | Thực tập sinh |
| Phân công | Điền PIC theo từng task, không chia cố định FE/BE |