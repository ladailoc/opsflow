# OpsFlow — shared agent context

## A. Project overview

OpsFlow là ứng dụng web quản lý yêu cầu hỗ trợ IT nội bộ cho **một công ty và một đội IT Support**: gửi yêu cầu, tiếp nhận/phân công, trao đổi, theo dõi trạng thái và SLA, tra cứu lịch sử, quản trị và báo cáo cơ bản. MVP có ba role: **Employee**, **Support Agent**, **Administrator**. Hai thành viên là **LocLD11** và **PhanDV2**; cả hai tham gia dữ liệu, API, UI, test và review chéo. Chia việc theo **vertical slice** (data/API/UI/test) và Task ID, không coi một màn hình prototype là feature tích hợp đã hoàn thành.

Ngoài MVP: public registration, SSO/HR/email/chat integration, ứng dụng mobile riêng, multi-company, asset management, AI tự xử lý, phê duyệt nhiều cấp, ticket for others/affected-user list, multi-assignee, Pending Vendor, Rejected, xóa ticket và file attachment trong phạm vi bắt buộc. Chỉ đổi scope sau khi PO xác nhận. Xem Requirement Brief mục 1–6, Backlog mục 1.1 và Q&A #4, #8, #9, #13–15, #19.

**Trạng thái source tại ngày 30/09/2026:** `frontend/` là Next.js prototype với route Employee/Agent/Admin, component dùng lại, mock data và reducer/state cục bộ. `frontend/src/prototype/PrototypeProvider.tsx` lưu **prototype state** vào localStorage; đây không phải token hoặc authentication thật. `frontend/src/app/login/page.tsx` dùng mock users. Chưa có REST API client hoặc kết nối backend được xác minh. `backend/` và `nginx/` đang rỗng; chưa thấy Spring Boot project, migration, CI hoặc Docker config. Không đánh dấu bất kỳ task backend/auth/database/SLA nào Done từ prototype. Kiểm tra source và test lại trước khi cập nhật nhận định này.

## B. Authoritative documents

Đọc file này, sau đó đọc **phần gốc liên quan đến Task ID và toàn bộ Acceptance Criteria của User Story** trước khi code. Khi có khác biệt, phân định theo trách nhiệm sau; không tự sửa business rule của PO.

| Nguồn | Đường dẫn | Quyết định dùng cho |
| --- | --- | --- |
| Q&A Management v1.0 | `docs/QA_Management_v1.0.md` | Business rule PO đã xác nhận, nhất là câu #1–#23 có trạng thái Close; dòng #24 trống. |
| Product Backlog v1.0 | `docs/OpsFlow_Product_Backlog_v1.0.md` | MVP scope, User Story/AC, Task ID, estimate, dependency và roadmap. |
| Đề xuất kỹ thuật | `docs/OpsFlow_De_xuat_ky_thuat_va_to_chuc_du_an.md` | Stack, auth, data model sơ bộ, API, transaction, Git, deploy. Thiết kế thấp hơn vẫn chờ task tương ứng chốt. |
| WBS | `docs/OpsFlow_WBS.md` | Sprint, PIC, effort, trạng thái lập kế hoạch; `TBD` không phải phân công đã chốt. |
| Requirement Brief | `docs/OpsFlow_Requirement_Brief.md` | Mục tiêu, phạm vi, vai trò và FR01–FR10 cấp tổng quan. |

Source và config thực tế là bằng chứng cho phần **đã triển khai** và version hiện có. Backlog/Q&A là yêu cầu, không phải bằng chứng hoàn thành. Các điểm cần nhóm thống nhất: WBS overview ghi **63,5 PD** còn Backlog mục 5–6 ghi **64,5 PD**; WBS cảnh báo kế hoạch tuần 2 vượt capacity trong khi Backlog xếp 9,5 PD. Cần đối soát estimate và sprint commitment trước khi nhận việc. WBS/Backlog T0.2 mô tả setup FE/BE/DB rộng hơn nhiệm vụ **bootstrap ngữ cảnh** này; file này không tuyên bố T0.2 implementation Done. Đề xuất kỹ thuật mục 7 có một dòng CI viết `develop`, còn quy ước branch mục 6 là `dev`; dùng `dev` và sửa dòng CI khi làm T0.5. WBS/Backlog T0.1 nêu `Role` trong mô hình sơ bộ, còn Q&A #21 chốt **một role/tài khoản** và đề xuất kỹ thuật dùng `users.role`; task T0.1 chốt schema cụ thể, không suy từ chữ `Role` rằng cần bảng multi-role.

## C. Technology stack

- Frontend chốt: Next.js + TypeScript. Prototype `frontend/package.json`: Next.js **14.2.15**; React **^18.3.1**, TypeScript **^5.6.3**, Tailwind CSS **^3.4.14**, `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`. Dấu `^` là range trong manifest, không phải version cài thực tế. UI đang có `frontend/src/components/ui/` và `frontend/src/components/tickets/`; dùng lại trước khi thêm thư viện/component.
- Backend mục tiêu: Java + Spring Boot + Spring Security, REST API; chưa có `pom.xml`/`build.gradle`, nên **chưa xác minh** JDK, Spring Boot, build tool hoặc dependency version. Không tự nâng major version.
- Database: PostgreSQL, demo dùng Supabase Managed PostgreSQL qua backend và SSL. PostgreSQL/Supabase version chưa xác minh.
- Migration: Flyway; chưa có migration hoặc version cấu hình.
- Deploy mục tiêu: Docker + AWS + Nginx, cùng HTTPS origin; local có thể dùng dev proxy/Compose. Chưa có config triển khai thực tế.
- Môi trường local đã kiểm tra ngày 30/09/2026: Node.js **22.23.1**, npm **10.9.8**, Git **2.49.0.windows.1**. `npm ls --depth=0` trong `frontend/` xác nhận package đang cài: Next.js **14.2.15**, React/React DOM **18.3.1**, TypeScript **5.9.3**, Tailwind CSS **3.4.19**. Version đang cài của TypeScript/Tailwind khác mốc tối thiểu trong range `package.json`; không sửa dependency chỉ vì khác mốc này.
- Java/Javac local **Temurin 21.0.12.1**, Maven local **3.9.11**; Gradle và `psql` không có trên PATH. Docker CLI **29.8.0** có sẵn nhưng Docker daemon chưa chạy lúc kiểm tra. Đây là **toolchain của máy**, không phải version backend đã chốt. Node.js/JDK/Spring Boot/build tool/Flyway/PostgreSQL version cho dự án cần xác nhận trong T0.2 và config thực tế; không điền theo suy đoán hoặc tự nâng cấp frontend.

## D. Repository structure

| Đường dẫn | Trách nhiệm |
| --- | --- |
| `frontend/` | Next.js routes/layout trong `src/app/`; prototype UI và shared component trong `src/components/`; `src/lib/` có logic dùng cho prototype; `src/mocks/` và `src/prototype/` là dữ liệu/trạng thái demo, cần thay bằng API integration theo task. Khi tích hợp, đặt API client/DTO theo convention T0.4 và tái sử dụng UI hiện có. |
| `backend/` | Chỗ dành cho Spring Boot: config/security/auth, user, request type, ticket, comment, audit, SLA, dashboard, common. Chưa tạo project. Tổ chức theo domain và service/repository; không tạo service/helper trùng chức năng. |
| `nginx/` | Reverse proxy `/` tới Next.js và `/api/*` tới Spring Boot tại demo; hiện rỗng. |
| `docs/` | Nguồn yêu cầu hiện tại; sau này lưu API contract, quyết định nghiệp vụ và hướng dẫn demo/deploy. |
| `.github/workflows/` | CI cho build/test/deploy **nếu T0.5 áp dụng**; hiện chưa có. |

Không tạo cấu trúc song song chỉ vì tên thư mục hiện tại khác ví dụ trong tài liệu. Tái sử dụng component UI theo role và domain, tránh sao chép ba bản Employee/Agent/Admin nếu component có thể nhận dữ liệu và quyền phù hợp. Backend quyết định dữ liệu/permission, không dùng component reuse để vượt quyền.

## E. Authentication & security — yêu cầu, chưa triển khai

Theo đề xuất kỹ thuật mục 4 và US01/US02: JWT Access Token **15 phút**, Refresh Token **7 ngày**; Refresh Token chỉ lưu **hash** trong DB, hỗ trợ rotation và revoke. Refresh thành công vô hiệu token cũ; reuse token đã rotation phải revoke token family. Logout xóa cookie và revoke phiên. Access Token hết hạn: frontend refresh một lần rồi retry request một lần; refresh không hợp lệ: xóa auth cache và đưa về login.

Access/Refresh Token qua **HttpOnly Cookie**, **SameSite=Lax**; local HTTP `Secure=false`, demo HTTPS `Secure=true`. Không lưu token hay password vào localStorage/sessionStorage, không cho JavaScript đọc token. Vì dùng cookie, Spring Security bảo vệ CSRF cho mutation và các auth endpoint cần bảo vệ; frontend gửi CSRF token ở header. Mỗi User có `authVersion`; khóa tài khoản, đổi role, đổi/reset password phải tăng version và revoke mọi Refresh Token đang hoạt động. Mỗi request xác thực kiểm tra account ACTIVE và `authVersion` khớp để vô hiệu Access Token cũ ngay. Backend enforce role, ownership, assignee, status và dữ liệu trả về; UI chỉ hỗ trợ trải nghiệm. Không commit/log secret hoặc thông tin nhạy cảm. Admin không khóa/đổi role Agent khi còn ticket NEW/IN_PROGRESS/WAITING_FOR_EMPLOYEE được giao trước khi xử lý phân công; không khóa/hạ quyền Admin hoạt động cuối cùng (Q&A #5).

**Không nhầm** mock login, role switcher và localStorage prototype hiện tại với các cơ chế trên. Chưa có bằng chứng code/test auth thật.

## F. Business rules — PO đã xác nhận

Áp dụng Q&A #1–#23 và AC theo US tương ứng. Với transition/permission phức tạp, đọc nguyên Q&A/US trước khi implement.

- **Tài khoản/quyền:** một account một role. Admin tạo/quản lý tài khoản; không public registration. Chỉ Employee tạo Ticket, không tạo hộ. Employee chỉ xem ticket mình tạo; Agent xem toàn Support Queue nhưng chỉ sửa/xử lý/viết trao đổi trên ticket mình phụ trách, ngoài Take hợp lệ; Admin điều phối và thao tác theo workflow. Assignee phải là Support Agent đang hoạt động. Mỗi ticket tối đa một assignee (Q&A #1, #5, #6, #9, #14, #21; US01, US02, US04, US06, US09).
- **Assignment:** Agent Take ticket NEW chưa có assignee; Admin Assign Agent đang hoạt động, Reassign chỉ do Admin, kèm lý do. Take/Assign giữ trạng thái NEW; Start Processing là action riêng. Hai Agent Take cùng lúc chỉ một thành công. Reassign giữ trạng thái/SLA đã dùng; IN_PROGRESS hoặc WAITING_FOR_EMPLOYEE luôn có assignee (Q&A #2–#4, #23; US10–US12).
- **Sáu trạng thái:** `NEW`, `IN_PROGRESS`, `WAITING_FOR_EMPLOYEE`, `RESOLVED`, `CLOSED`, `CANCELLED`. `NEW` có thể đã assign. Agent phụ trách/Admin: NEW→IN_PROGRESS; IN_PROGRESS→WAITING_FOR_EMPLOYEE phải có câu hỏi public; IN_PROGRESS→RESOLVED phải có giải pháp public. Employee trả lời public tại WAITING_FOR_EMPLOYEE thì tự chuyển IN_PROGRESS; Agent phụ trách/Admin có thể chủ động Resume với lý do và History. Employee xác nhận RESOLVED→CLOSED; Admin đóng với lý do. Employee mở RESOLVED→IN_PROGRESS với lý do; Admin mở lại theo phản hồi Employee. Không giới hạn reopen 3 ngày, không auto close. CLOSED/CANCELLED terminal; không Pending Vendor/Rejected (Q&A #4; US13–US17).
- **Edit/Cancel:** chủ Ticket sửa Title, Description, Request Type, Impact, Urgency ở NEW kể cả đã assigned; sau NEW bổ sung qua Public Comment. Chủ ticket/Admin Cancel ở NEW, IN_PROGRESS, WAITING_FOR_EMPLOYEE với lý do và History; không Cancel từ RESOLVED/CLOSED; không Delete Ticket (Q&A #17–#19; US07–US08). Validation chi tiết theo AC, ví dụ lý do Cancel 10–1000 ký tự.
- **Communication:** Public Comment hiện cho chủ Ticket/Agent/Admin theo quyền truy cập; Internal Note chỉ Agent/Admin thấy. Chủ Ticket chỉ viết public; Agent phụ trách/Admin viết cả hai; Agent khác chỉ xem. Không sửa/xóa comment hoặc đổi Internal→Public. Không comment ở CLOSED/CANCELLED. Employee API/history không được chứa note hay sự kiện nội bộ (Q&A #10–#11; US18–US20).
- **Impact/Urgency/Priority:** Employee chọn Impact và Urgency, hệ thống tính Priority, không ai chỉnh Priority trực tiếp. Impact HIGH: ≥50 người hoặc dịch vụ chung toàn công ty gián đoạn; MEDIUM: 2–49 người ngoài mức HIGH; LOW: một người ngoài mức HIGH. Urgency HIGH: chặn hoàn toàn, không workaround; MEDIUM: làm được một phần/có workaround nhưng bất tiện đáng kể; LOW: theo kế hoạch/chưa cản trở. Ma trận theo thứ tự Urgency HIGH/MEDIUM/LOW: Impact HIGH → **P1/P2/P3**, MEDIUM → **P2/P3/P4**, LOW → **P3/P4/P4**. Agent phụ trách/Admin chỉnh Impact/Urgency ở NEW/IN_PROGRESS/WAITING_FOR_EMPLOYEE với lý do và Audit; hệ thống tính lại Priority (Q&A #7; US04–US05).
- **Version/stale data:** Ticket có `version`; mutation gửi `expectedVersion`, backend kiểm tra permission, status, assignee, version tại thời điểm ghi. Stale trả **HTTP 409**, `errorCode=STALE_TICKET`; UI thông báo/reload, giữ draft, không auto ghi đè hoặc retry business action. Ticket/SLA/comment bắt buộc/Audit cùng transaction. Xem Q&A #23, US29, đề xuất kỹ thuật mục 4.1–4.2 để test cả hai thứ tự Take/Take, Edit/Start, Cancel/Resolve.
- **Audit:** một nguồn audit chung cho Ticket, User, Request Type; ghi actor, time, before/after, reason khi cần. Employee thấy public history ticket của mình; mọi Agent xem history nghiệp vụ ticket của đội; Admin xem audit đầy đủ gồm quản trị (Q&A #11; US20).
- **SLA:** P1 first response/resolution **15 phút/4 giờ**; P2 **1 giờ/8 giờ**; P3 **4 giờ/24 giờ**; P4 **8 giờ/72 giờ**. Đồng hồ bắt đầu khi tạo, tính 24/7. First response là public comment đầu tiên của Agent phụ trách/Admin (câu hỏi hoặc solution cũng tính), không phải Take/status/internal note; dừng một lần, không reset khi reopen. Resolution cộng NEW+IN_PROGRESS, pause WAITING_FOR_EMPLOYEE+RESOLVED, resume khi trở lại IN_PROGRESS, dừng CLOSED/CANCELLED. Hủy không phải giải quyết thành công. <80% bình thường, 80–100% sắp hạn, >100% quá hạn; đúng 100% còn trong hạn. Đổi Agent không reset; đổi Priority giữ elapsed và breach history, áp target mới cho mục tiêu chưa đạt. Chờ vendor ở IN_PROGRESS vẫn tính SLA (Q&A #12, #15; US22–US25).
- **Dashboard:** chỉ Admin xem API/report. Workload là số ticket assigned ở NEW/IN_PROGRESS/WAITING_FOR_EMPLOYEE, unassigned là nhóm riêng. Average Resolution chỉ lấy ticket **hiện** RESOLVED/CLOSED có `latest_resolved_at` trong kỳ; mỗi ticket một lần, thời gian NEW+IN_PROGRESS cộng qua reopen. Mặc định 30 ngày lịch gồm hôm nay theo giờ Việt Nam; no data hiển thị “Chưa có dữ liệu”. Không tính average first response trong scope bắt buộc (Q&A #16, #22; US26–US28).
- **Search và duplicate submit:** bộ lọc khác loại kết hợp AND, nhiều giá trị cùng loại OR; tìm mã chính xác hoặc một phần title; page size 20/50/100, mặc định 20; result và total count theo quyền. Mutation chặn double-click ở UI và request lặp ở backend bằng idempotency/state check; version check vẫn bắt buộc (Q&A #20; US21; Backlog mục 1.2, T12.1).

## G. Database & migration rules

Flyway quản lý mọi schema change. Xem migration hiện có trước khi thêm version; không sửa migration đã chạy, không trùng version, không dùng Hibernate tự sửa schema thay Flyway, không chạy destructive migration trên DB chung, không đưa credentials vào Git. T0.1 chốt ERD/data contract trước T0.3 baseline và T3.1 Ticket schema; hiện **chưa có migration**.

Mô hình sơ bộ (đề xuất kỹ thuật mục 5): `users` với `auth_version`, `refresh_tokens` chỉ chứa token hash/family/revoke metadata, `tickets` với `version` và các mốc/accumulator SLA, `request_types`, `comments` PUBLIC/INTERNAL, `audit_events` đa hình (`entity_type`, `entity_id`, `actor_id`, `action`, `before_data`, `after_data`, `reason`, `created_at`). Ticket History lấy từ audit events loại TICKET; event quản trị dùng chung bảng. Schema/index/constraint cụ thể là hợp đồng của T0.1/T0.3, không tự khóa ở file này.

## H. API contract

REST prefix **`/api/v1`**, JSON response/error thống nhất do **T0.4** chốt. Chưa có implementation/convention cụ thể; không tự lập response envelope hoặc naming riêng cho module. Mỗi endpoint phải có validation ở backend, HTTP status code phù hợp AC, error code ổn định, actor/visibility filtering, cookie auth và CSRF cho mutation. Theo US06, Employee hỏi ticket không sở hữu phải trả 404 để che sự tồn tại. Theo đề xuất kỹ thuật mục 4.1, stale Ticket là 409 `STALE_TICKET`. Ticket mutation gửi `expectedVersion` và trả version mới khi thành công. API không trả Internal Note, audit nội bộ hay dữ liệu khác vượt quyền actor. Base URL qua environment config; demo một HTTPS origin với `/api/*` qua Nginx. T1.2 công bố Auth API contract cho T1.3; agent khác tái sử dụng contract đã review.

## I. Git & parallel development

`master` = milestone ổn định; `dev` = tích hợp; `feature/<task-id>-<short-name>` và `fix/<task-id>-<short-name>` tạo từ `dev` đã đồng bộ. Mỗi task/commit/PR gắn Task ID; PR nêu scope, test, ảnh UI/API nếu cần; người còn lại review. Không commit trực tiếp lên master/dev sau bootstrap, không tự merge, không force push/reset branch dùng chung, không sửa ngoài scope task nếu chưa thống nhất. Với nhiều agent, mỗi agent dùng worktree/clone/workspace riêng, **không cùng working directory**. Kiểm tra branch, status, remote trước mọi task; hiện repo được bootstrap cục bộ, chưa có remote.

## J. Cross-agent contracts

- **T0.1** (LocLD11 chính, PhanDV2 duyệt) chốt data model v1 → **T0.3** (LocLD11) Flyway baseline, **T1.1** User model, **T3.1** Ticket model. **T0.4** (cả hai) chốt JSON/error/naming và phiên bản contract trước các API độc lập.
- **T1.1** (LocLD11) User/Role/Status + authVersion → **T1.2** (LocLD11) auth/security API → **T1.3** (PhanDV2 UI, LocLD11 hỗ trợ auth guard) integration. **T1.4** cả hai review/test.
- **T3.1** (PhanDV2 chính, LocLD11 duyệt schema/migration) Ticket contract → **T3.2** Priority Matrix → **T3.3** Create Ticket API → **T3.4** UI/**T3.5** tests. WBS ghi PIC `TBD` cho T3.2 và nhiều task sau, cần gán trước khi làm.
- **T8.1** (LocLD11 chính, PhanDV2 phối hợp) Audit Service chung từ foundation → T8.2 tích hợp vào Edit/Priority/Assignment/Lifecycle/Cancel/quản trị; T8.3–T8.5 history sau. Version/transaction design cần có từ API lõi, không đợi Epic 13 mới thêm.
- Auth/User → Ticket/Priority → Detail → Queue → Assignment → Lifecycle/Communication → History/Search → SLA → Dashboard. T10 SLA core phải có trước T11 overdue/report. T0.5 (PhanDV2 chính, LocLD11 hỗ trợ) build/deploy.

Không tự thay public API, entity contract, enum hoặc schema mà task khác đang dùng. Trước thay đổi, xác định consumer, migration và test chịu ảnh hưởng; báo nhóm và cập nhật contract được review. Nếu dependency chưa có hoặc contract mâu thuẫn, ghi blocker/ảnh hưởng, không dựng implementation thay thế tùy tiện.

## K. Coding standards

Viết code rõ ràng, có type, validation và lỗi có thể xử lý. Tái sử dụng component/service/helper hiện có; không hard-code hoặc log secret. Backend là nguồn thực thi business rule và authorization. Không dùng mock để giả kết quả backend thật; khi chuyển prototype sang integration, phân biệt rõ UI demo và flow API thật. Giới hạn thay đổi theo Task ID; không tự làm feature hoặc lỗi không liên quan. Với action cập nhật nhiều bảng, dùng transaction và test rollback. Không dựa riêng vào disable button cho idempotency hoặc frontend filtering cho data security.

## L. Testing & Definition of Done

Task chỉ Done khi AC liên quan đạt; code được review; test happy/error/permission/concurrency tương ứng và build chạy thành công; không còn lỗ hổng bảo mật đã biết; migration được kiểm tra nếu có; API/contract/docs được cập nhật; chạy được ở môi trường chung và demo theo AC; PR được review và merge đúng quy trình (Backlog mục 9–10; Requirement Brief mục 5). Viết xong code hoặc prototype UI không đủ. Test đặc biệt cần có: note không leak, khóa/đổi role vô hiệu phiên, Priority Matrix 9 ô, SLA pause/reopen, transaction rollback, hai thứ tự của xung đột và duplicate submit.

## M. Mandatory agent workflow

1. Đọc `AGENTS.md` và tài liệu gốc/Q&A/AC liên quan Task ID.
2. Kiểm tra source/test/config thực tế; kiểm tra Git status, branch, remote.
3. Đồng bộ `dev`, tạo branch `feature/<task-id>-...` hoặc `fix/<task-id>-...`; dùng checkout riêng khi làm song song.
4. Xác định scope, PIC, dependency, public contract/schema/enum và tác động tới task khác; báo blocker hoặc mâu thuẫn trước khi sửa contract.
5. Triển khai đúng scope, chạy test/build/migration check phù hợp; kiểm tra permission và dữ liệu trả về.
6. Xem Git diff, xác nhận không có secret/artefact/lỗi ngoài scope; commit có Task ID.
7. Push và tạo/chuẩn bị PR vào `dev`, nêu AC, test, rủi ro và ảnh; chờ review, không tự merge.
8. Báo cáo thay đổi, bằng chứng test, trạng thái PR và dependency còn mở. Nếu không có remote/quyền push, báo rõ và giữ branch/commit cục bộ.
