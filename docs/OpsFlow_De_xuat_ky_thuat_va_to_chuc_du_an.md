**OpsFlow**

ĐỀ XUẤT KỸ THUẬT
VÀ TỔ CHỨC DỰ ÁN

Hướng triển khai sơ bộ cho MVP

|  |  |
| --- | --- |
| **Phiên bản** | 1.0 |
| **Ngày** | 28/09/2026 |
| **Frontend** | Next.js + TypeScript |
| **Backend** | Spring Boot + Java |
| **Cơ sở** | OpsFlow Product Backlog v1.0 |

*Tài liệu ở mức đề xuất ban đầu, phục vụ thống nhất hướng triển khai trước khi thiết kế chi tiết.*

# 1. Mục tiêu và nguyên tắc

Mục tiêu của tài liệu là thống nhất một hướng kỹ thuật đủ rõ để nhóm có thể bắt đầu phát triển, review chéo và triển khai demo, nhưng chưa khóa cứng các chi tiết thiết kế mức thấp.

* Phân quyền và business rule phải được enforce ở Backend; Frontend chỉ hỗ trợ trải nghiệm và ẩn/hiện action phù hợp.
* Phát triển theo vertical slice: mỗi chức năng gồm dữ liệu/API/UI/test, hai thành viên luân phiên implement và review.
* Các quyết định chi tiết có thể điều chỉnh trong quá trình thực hiện nếu không làm thay đổi business rule đã chốt.

# 2. Công nghệ đề xuất

| **Hạng mục** | **Lựa chọn** | **Lý do** |
| --- | --- | --- |
| Frontend | Next.js + TypeScript | Phù hợp web app dạng dashboard/ticket; routing rõ ràng, component hóa tốt, TypeScript giúp giảm lỗi khi tích hợp API. |
| UI | Tailwind CSS + thư viện component nhẹ (nếu project đã dùng) | Tạo giao diện nhanh, đồng bộ spacing/color và dễ tái sử dụng component. |
| Backend | Spring Boot + Java | Phù hợp REST API, Spring Security, validation, transaction và kiến trúc service/repository rõ ràng. |
| Database | PostgreSQL | Dữ liệu OpsFlow có quan hệ rõ, cần transaction, filter/report và audit; PostgreSQL phù hợp cho mô hình này. |
| Migration | Flyway | Quản lý thay đổi schema theo version, dễ deploy/redeploy môi trường demo. |
| Build/Deploy | Docker + AWS + Nginx | Frontend Next.js và Backend Spring Boot được build thành các service/container riêng và triển khai trên hạ tầng AWS. Nginx được triển khai cùng môi trường AWS để làm reverse proxy và cung cấp một public origin duy nhất cho Frontend và Backend. Docker Compose có thể tiếp tục sử dụng cho môi trường local nếu cần, nhưng không dùng để chạy PostgreSQL ở môi trường demo vì Database sử dụng Supabase PostgreSQL. |

**2.1. Technology Baseline**
Frontend prototype hiện tại đang sử dụng:
- Next.js: [điền version từ package.json].
- React: [điền version từ package.json].
- TypeScript: [điền version từ package.json].
- Tailwind CSS: [điền version từ package.json].
- Node.js: [version nhóm thống nhất].

Backend:
- Java/JDK: [điền version].
- Spring Boot: [điền version từ pom.xml].
- Maven/Gradle: [điền version thực tế].
- Flyway: 12.4.0 (đã xác minh từ Maven dependency tree trong T0.3; Spring Boot 4.1.1 quản lý dependency). Migration hiện có và version kế tiếp ghi tại `docs/architecture/migrations.md`.

Database:
- PostgreSQL: version do Supabase Project đang sử dụng.

# 3. Tổ chức repository và cấu trúc thư mục

Đề xuất dùng monorepo để hai thành viên dễ đồng bộ version, review và triển khai demo:

| **Thư mục / file** | **Trách nhiệm chính** |
| --- | --- |
| frontend/ | Next.js: app/routes, feature components, API client, types, shared UI. |
| backend/ | Spring Boot: auth/security, user, ticket, comment, history, SLA, dashboard, common. |
| nginx/ | Cấu hình Nginx reverse proxy, route giao diện tới Next.js và /api/\* tới Spring Boot. |
| docs/ | Tài liệu API, business note, hướng dẫn demo/deploy. |
| docker-compose.yml | Chạy các service local/demo theo cùng một cấu hình. |
| .github/workflows/ hoặc CI tương đương | Build/test tự động khi mở Pull Request hoặc merge. |

## Gợi ý cấu trúc Backend

* config, security, auth: cấu hình ứng dụng, đăng nhập và authorization.
* user, requesttype, ticket, comment, audit: các domain chính.
* sla, dashboard: tính SLA và query/reporting.
* common: exception, response model, validation/util dùng chung.

## Gợi ý cấu trúc Frontend

* app/: route/layout theo Employee, Support Agent, Administrator.
* features/: UI và logic theo feature Ticket, Queue, Dashboard, User Management.
* components/: component dùng lại như table, badge, dialog, form control.
* lib/api/: lớp gọi REST API; types/: DTO/type dùng cho Frontend.

**Tái sử dụng Frontend Prototype**
Frontend prototype hiện tại được sử dụng làm baseline cho phiên bản tích hợp Backend.
Phần dự kiến tái sử dụng:
- Layout và navigation.
- Các route/màn hình theo Employee, Support Agent và Administrator.
- Shared UI components.
- Ticket List và Ticket Detail.
- Create/Edit Ticket form.
- Status/Priority/SLA components.
- Dialog và Loading/Error/Empty state đã hoàn thiện.
Phần chỉ phục vụ prototype và sẽ được thay thế:
- Mock data.
- Mock repository/service.
- Local state giả lập Backend.
- Conflict simulator.
- Prototype role switcher/demo toolbar.
Khi Spring Boot Backend sẵn sàng, Frontend thay lớp mock data/service bằng REST API client mà không viết lại toàn bộ giao diện.

# 4. Kết nối Frontend - Backend, đăng nhập và phân quyền

| **Nội dung** | **Hướng xử lý** |
| --- | --- |
| Kết nối API | Frontend Next.js gọi REST API của Spring Boot qua /api/v1. Base URL được cấu hình bằng biến môi trường, không hard-code trong source code. Khi triển khai demo cùng domain, reverse proxy chuyển /api/\* tới Spring Boot để Frontend và Backend sử dụng cùng origin. |
| Đăng nhập | Frontend gửi username/email + password tới Backend. Spring Security xác thực. Nếu hợp lệ, Backend phát hành JWT Access Token và Refresh Token. Token được gửi cho Browser thông qua HttpOnly Cookie. Frontend không lưu password, Access Token hoặc Refresh Token trong localStorage/sessionStorage. |
| Access Token | JWT Access Token có thời hạn ngắn, đề xuất 15 phút. Token chứa tối thiểu thông tin cần thiết như userId, role, authVersion, iat, exp, jti. authVersion được dùng để vô hiệu hóa Access Token đang còn hạn khi tài khoản bị khóa, thay đổi Role hoặc đổi/reset Password. |
| Refresh Token | Refresh Token có thời hạn 7 ngày và chỉ được sử dụng để lấy Access Token mới. Backend quản lý Refresh Token và lưu bản hash trong database thay vì lưu raw token. Refresh Token phải hỗ trợ revoke và rotation. |
| Token Cookie | Access Token và Refresh Token được gửi bằng HttpOnly Cookie. Access Token Cookie và Refresh Token Cookie sử dụng SameSite=Lax. Demo HTTPS sử dụng Secure=true; local HTTP sử dụng Secure=false. Không cho JavaScript phía Frontend đọc trực tiếp token. |
| Refresh Token Rotation | Mỗi lần /api/v1/auth/refresh thành công, Backend vô hiệu hóa Refresh Token cũ và cấp Refresh Token mới. Refresh Token cũ không được phép sử dụng lại. Nếu phát hiện token đã rotation nhưng bị sử dụng lại, Backend revoke toàn bộ token family tương ứng. |
| Access Token hết hạn | Khi API trả 401 do Access Token hết hạn, Frontend thực hiện một request tới /api/v1/auth/refresh. Nếu refresh thành công, Frontend retry request ban đầu một lần. Không được tạo vòng lặp refresh vô hạn. |
| Refresh Token hết hạn / không hợp lệ | Nếu Refresh Token hết hạn, bị revoke hoặc không hợp lệ, Backend trả 401. Frontend xóa trạng thái người dùng đang cache và chuyển về Login với thông báo “Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.” |
| Logout | Khi Logout, Backend revoke Refresh Token/token family tương ứng và yêu cầu Browser xóa Access Token Cookie + Refresh Token Cookie. Frontend xóa user/auth cache và chuyển về Login. |
| Account bị khóa | Khi Administrator khóa tài khoản, toàn bộ Refresh Token đang hoạt động của tài khoản phải bị revoke. Các request tiếp theo cũng phải bị từ chối theo trạng thái account. |
| Thay đổi Role | Khi Administrator thay đổi Role, toàn bộ Refresh Token hiện tại của user bị revoke để buộc đăng nhập lại. Nhờ đó user nhận Access Token mới với quyền mới thay vì tiếp tục sử dụng quyền cũ. |
| Đổi Password | Khi password được thay đổi/reset, toàn bộ Refresh Token hiện có của tài khoản bị revoke. Người dùng phải đăng nhập lại trên các phiên cũ. |
| Vô hiệu hóa Access Token đang còn hạn | Mỗi User có trường authVersion. Khi tài khoản bị khóa, thay đổi Role hoặc đổi/reset Password: - Backend tăng authVersion của User. - Revoke toàn bộ Refresh Token đang hoạt động của User. Mỗi request đã xác thực phải kiểm tra: - Account vẫn ở trạng thái ACTIVE. - authVersion trong Access Token vẫn khớp với authVersion hiện tại của User. Nếu không khớp, Backend trả 401/403 và yêu cầu người dùng đăng nhập lại. Nhờ đó Access Token cũ bị vô hiệu hóa ngay, không phải chờ hết thời hạn 15 phút. |
| Phân quyền | Backend kiểm tra authentication, role, ownership và trạng thái Ticket trước mọi business action. Frontend chỉ ẩn/hiện chức năng phù hợp và không thay thế authorization phía Backend. |
| CSRF | Vì JWT được truyền qua Cookie, các request thay đổi dữ liệu vẫn phải được bảo vệ CSRF. Spring Security quản lý CSRF token; Frontend gửi CSRF token trong header đối với POST, PUT, PATCH, DELETE và các endpoint authentication cần bảo vệ. |
| Local Environment | HTTP được phép, Secure=false. Frontend :3000 và Backend :8080 sử dụng reverse proxy/dev proxy khi có thể. |
| Demo Environment | Frontend Next.js, Backend Spring Boot và Nginx được triển khai trên hạ tầng AWS. Người dùng truy cập ứng dụng thông qua một public HTTPS domain duy nhất. Nginx route: - / và các route giao diện → Next.js. - /api/\* → Spring Boot. Authentication Cookie sử dụng Secure=true. |

![](data:image/png;base64...)

**Luồng ngắn:** Browser → Nginx → Spring Boot /api/v1 → Spring Security → Service/Business Rule → Repository → Supabase PostgreSQL.

# 4.1 Version và stale data

Mỗi Ticket có trường version dùng cho optimistic locking.
Khi Frontend tải Ticket, Backend trả cả dữ liệu Ticket và version hiện tại.
Ví dụ:

GET /api/v1/tickets/OPS-001
Response: version = 7
Khi Frontend thực hiện action làm thay đổi Ticket, request phải gửi expectedVersion tương ứng.
Ví dụ: expectedVersion = 7
Backend trước khi cập nhật kiểm tra:
- quyền của actor;
- trạng thái Ticket hiện tại;
- Assignee hiện tại;
- Ticket version hiện tại.
Nếu version hiện tại không còn bằng expectedVersion, request được xem là stale.
Backend trả:
HTTP 409 Conflict
errorCode = STALE\_TICKET
Frontend:
- không tự ghi đè dữ liệu mới;
- không tự retry business action;
- thông báo Ticket đã thay đổi;
- yêu cầu Reload Ticket;
- giữ draft người dùng đang nhập nếu có.
Sau khi update thành công, Backend tăng version và trả version mới về Frontend.

# 4.2. Tính nhất quán của Business Transaction

Các business action có nhiều thay đổi liên quan phải được thực hiện trong cùng một database transaction tại Service Layer.
Ví dụ Resolve Ticket gồm:
- kiểm tra permission/status/version;
- cập nhật Ticket sang RESOLVED;
- cập nhật dữ liệu SLA;
- tạo Public Solution bắt buộc;
- tạo Audit Event;
- cập nhật latest\_resolved\_at.

Tất cả các bước phải cùng thành công hoặc cùng thất bại.
Spring Boot sử dụng transaction để rollback toàn bộ thay đổi nếu bất kỳ bước nào lỗi.
Nguyên tắc tương tự áp dụng cho:
- Wait for Employee + Public Question.
- Resume Processing + Reason + Audit.
- Cancel + Reason + SLA + Audit.
- Reassign + Reason + Audit.
- Impact/Urgency change + recalculated Priority + Audit.
Không được xảy ra trạng thái Ticket đã thay đổi nhưng Comment, SLA hoặc Audit liên quan chưa được ghi thành công.

# 5. Sơ đồ dữ liệu sơ bộ

Các bảng dưới đây đủ để giải thích mô hình ban đầu. Chi tiết field/index/constraint sẽ được chốt ở task Data Model v1.

![](data:image/png;base64...)

| **Bảng** | **Vai trò** |
| --- | --- |
| users | Thông tin tài khoản gồm username/email, password\_hash, role, account\_status và auth\_version. Role gồm EMPLOYEE, SUPPORT\_AGENT hoặc ADMINISTRATOR. auth\_version được sử dụng để vô hiệu hóa Access Token cũ khi tài khoản bị khóa, đổi Role hoặc đổi/reset Password. |
| request\_types | Danh mục loại yêu cầu để Employee phân loại Ticket. |
| tickets | Lưu dữ liệu nghiệp vụ chính của Ticket: - ticket\_code. - requester\_id. - assignee\_id. - request\_type\_id. - title. - description. - status. - impact. - urgency. - priority. - created\_at / updated\_at. - version. version được sử dụng cho optimistic locking và phát hiện thao tác dựa trên dữ liệu cũ. Các dữ liệu thời gian cần thiết cho SLA gồm: - first\_response\_at. - resolution\_accumulated\_seconds. - resolution\_running\_since. - latest\_resolved\_at. - thông tin breach cần thiết để giữ lịch sử vi phạm SLA. |
| comments | Trao đổi theo Ticket; phân loại PUBLIC hoặc INTERNAL. |
| refresh\_tokens | Lưu thông tin Refresh Token phục vụ cơ chế JWT Authentication. Không lưu raw Refresh Token; chỉ lưu token hash. Thông tin chính gồm: - user\_id. - token\_hash. - token\_family\_id. - expires\_at. - revoked\_at. - created\_at. - replaced\_by\_token\_id nếu thực hiện rotation. Bảng này hỗ trợ Refresh Token Rotation, revoke khi Logout và revoke toàn bộ phiên khi tài khoản bị khóa, đổi Role hoặc đổi Password. |
| audit\_events | Lưu Audit Event chung của hệ thống, không chỉ riêng Ticket. Thông tin chính: - actor\_id: người thực hiện thao tác. - entity\_type: loại đối tượng bị thay đổi, ví dụ TICKET, USER, REQUEST\_TYPE. - entity\_id: ID của đối tượng. - action: loại thao tác. - before\_data: dữ liệu trước thay đổi. - after\_data: dữ liệu sau thay đổi. - reason: lý do nếu business rule yêu cầu. - created\_at: thời điểm thao tác. Ticket History được truy xuất từ audit\_events với entity\_type = TICKET. Các thao tác quản trị User, Role, Account Status và Request Type cũng được lưu vào audit\_events với entity\_type tương ứng. |

# 5.1 Dữ liệu SLA và Dashboard

SLA không được tính đơn giản bằng Current Time - Created At vì Resolution SLA có các giai đoạn pause/resume và Ticket có thể Reopen.

|  |  |
| --- | --- |
| **Nội dung** | **Hướng xử lý** |
| First Response SLA | Cần tối thiểu: - created\_at. - first\_response\_at. - Priority đang áp dụng. - thông tin breach nếu đã từng vi phạm.  first\_response\_at chỉ được ghi tại Public Comment đầu tiên của Agent phụ trách hoặc Administrator.  Take, Assign, Status change và Internal Note không được tính là First Response. |
| Resolution SLA | Cần tối thiểu: - resolution\_accumulated\_seconds: tổng thời gian đã tính SLA. - resolution\_running\_since: thời điểm bắt đầu/resume chu kỳ đang chạy. - current\_status. - current\_priority. - latest\_resolved\_at. - thông tin breach nếu đã từng vi phạm.  Resolution SLA cộng thời gian ở: - NEW. - IN\_PROGRESS.  Resolution SLA pause ở: - WAITING\_FOR\_EMPLOYEE. - RESOLVED.  Khi Ticket quay lại IN\_PROGRESS hoặc được Reopen, SLA tiếp tục từ thời gian đã tích lũy trước đó.  Khi Priority thay đổi, elapsed time không reset. Target mới được áp dụng cho objective chưa hoàn thành. |
| Dashboard Average Resolution Time | Một Ticket được tính khi: - trạng thái hiện tại là RESOLVED hoặc CLOSED; - latest\_resolved\_at nằm trong kỳ báo cáo. Resolution Time của Ticket là tổng thời gian Ticket ở NEW + IN\_PROGRESS qua tất cả các chu kỳ Reopen. |

Ví dụ SLA:

09:00 – Employee tạo Ticket, Priority = P3.

Resolution SLA bắt đầu.

09:20 – Agent điều chỉnh Impact/Urgency làm Priority chuyển từ P3 sang P2.

20 phút đã chạy vẫn được giữ, không reset.

Resolution target chuyển sang target của P2.

09:40 – Agent gửi Public Comment đầu tiên.

First Response Time = 40 phút.

11:00 – Agent chuyển Ticket sang WAITING\_FOR\_EMPLOYEE.

Resolution accumulated time lúc này = 2 giờ.

Resolution SLA pause.

14:00 – Employee gửi Public Comment.

Ticket tự chuyển về IN\_PROGRESS.

Resolution SLA tiếp tục từ 2 giờ.

17:00 – Agent Resolve Ticket.

Resolution accumulated time = 5 giờ.

Khoảng WAITING từ 11:00–14:00 không được tính.

Ngày hôm sau 09:00 – Employee Reopen Ticket.

Ticket quay lại IN\_PROGRESS và Resolution SLA tiếp tục từ 5 giờ.

11:30 – Ticket được Resolve lần thứ hai.

Resolution accumulated time = 7.5 giờ.

latest\_resolved\_at được cập nhật thành 11:30 của lần Resolve mới nhất.

Nếu Ticket hiện vẫn RESOLVED hoặc đã CLOSED, Dashboard sử dụng 7.5 giờ làm Resolution Time và xếp Ticket vào kỳ báo cáo chứa latest\_resolved\_at.

# 6. Cách chia việc, branch và review code

Backlog hiện tại đề xuất hai thành viên cùng tham gia end-to-end thay vì cố định một người Frontend và một người Backend. Vì vậy nên chia theo vertical slice.

| **Branch** | **Mục đích** |
| --- | --- |
| master | Phiên bản ổn định dùng cho milestone/release. |
| dev | Nhánh tích hợp trong tuần. |
| feature/<task-id>-<short-name> | Branch triển khai task/feature, tạo từ dev. |
| fix/<task-id>-<short-name> | Branch sửa bug/review issue, tạo từ dev. |

* Mỗi Pull Request gắn Task ID trong backlog và mô tả ngắn: phạm vi, cách test, ảnh UI/API nếu cần.
* Người còn lại review trước khi merge; với task có cả FE/BE nên review cả contract API và business rule.
* Không merge khi build/test fail hoặc còn review comment quan trọng.
* Ưu tiên squash merge để lịch sử commit trên dev/master gọn và bám theo Task ID.

# 7. Triển khai môi trường demo

| **Môi trường** | **Đề xuất** |
| --- | --- |
| Local dev | • Next.js chạy tại cổng :3000.  • Spring Boot chạy tại cổng :8080.  • Sử dụng Next.js dev proxy/rewrite để chuyển tiếp các request /api/\* tới Spring Boot.  • Backend kết nối PostgreSQL thông qua cấu hình Environment Variables.  • Có thể sử dụng Docker/Docker Compose để đồng bộ môi trường local nếu cần. |
| AWS Demo | • Frontend Next.js, Backend Spring Boot và Nginx được đóng gói thành các service/container và triển khai trên hạ tầng AWS.  • Nginx đóng vai trò là public entry point của ứng dụng.  • Routing:  - / và các route giao diện → Next.js.  - /api/\* → Spring Boot.  • Ứng dụng sử dụng một public HTTPS domain duy nhất để Frontend và Backend hoạt động cùng origin. |
| Database | • PostgreSQL sử dụng dịch vụ Supabase Managed PostgreSQL.  • Spring Boot kết nối tới Supabase PostgreSQL bằng JDBC/JPA thông qua kết nối SSL.  • Đảm bảo Frontend và Browser tuyệt đối không kết nối trực tiếp vào Database. |
| CI/CD tối thiểu | Pull Request:  • Frontend typecheck/build/test.  • Backend build/test.  Merge vào develop:  • Build container/image.  • Triển khai/redeploy môi trường demo AWS.  Merge vào master:  • Tạo phiên bản ổn định/milestone sau khi regression và review hoàn tất. |
| Secrets | • Các thông tin nhạy cảm bao gồm: JWT signing secret, Supabase Database URL, Database username/password, CSRF/security configuration.  • Quản lý hoàn toàn bằng Environment Variables hoặc secret management của môi trường AWS.  • Quy tắc cứng: Không commit secret vào Git repository. |

*\* Lưu ý hạ tầng cần xác nhận Demo:*

Để đảm bảo dự án triển khai nhanh chóng và hoàn toàn chủ động, nhóm sẽ tự chuẩn bị và quản lý toàn bộ hạ tầng cho môi trường Demo mà không phụ thuộc vào tài nguyên chung. Cụ thể:

* Hạ tầng Cloud & Mạng: Sử dụng tài khoản AWS cá nhân để cung cấp môi trường tính toán (compute environment) chạy các container. Nhóm tự thiết lập Public domain và cấu hình chứng chỉ HTTPS/TLS.
* Cơ sở dữ liệu: Chủ động khởi tạo Supabase Project (PostgreSQL), tự thiết lập database credentials và phân quyền kết nối cho Backend.
* Bảo mật & CI/CD: Toàn bộ Environment Variables/Secrets được nhóm quản lý trực tiếp trên AWS cá nhân. Nhóm cũng tự thiết lập pipeline CI/CD trên Git repository để tự động hóa quy trình deploy.

*(Trong thời gian đầu khi đang cấu hình hạ tầng Cloud, nhóm vẫn tiến hành phát triển và integration test xuyên suốt trên môi trường local để không làm gián đoạn tiến độ).*

# 8. Hướng triển khai tiếp theo

* Chốt data model v1 và API convention trước khi các feature lớn bắt đầu.
* Hoàn thành Login + Create Ticket + Ticket Detail như vertical slice đầu tiên để kiểm tra toàn bộ luồng FE-BE-DB.
* Thiết kế Audit/History và version field sớm để tránh sửa lớn khi làm concurrency và SLA.
* Sau mỗi nhóm feature: integration test, review chéo, cập nhật tài liệu và deploy lên môi trường demo.
