OpsFlow

Yêu cầu dự án OJT

Requirement Brief | Phiên bản 1.0 | 21 tháng 9 năm 2026
Đối tượng: 2 sinh viên (LocLD11, PhanDV2) | Thời lượng: 8 tuần

Nhóm xây dựng ứng dụng web quản lý yêu cầu hỗ trợ nội bộ. Tài liệu này mô tả nhu cầu ban đầu để
nhóm khảo sát với Product Owner (PO), đề xuất giải pháp và triển khai một sản phẩm có thể trình diễn,
kiểm thử và bàn giao.

1. Bối cảnh
Một công ty khoảng 300–500 nhân viên đang tiếp nhận yêu cầu IT qua email và chat: sự cố máy tính,
tài khoản, quyền truy cập hoặc cài đặt phần mềm. Yêu cầu dễ thất lạc; người gửi không biết tiến độ;
đội hỗ trợ khó theo dõi trách nhiệm và khối lượng công việc.

2. Mục tiêu
•  Tập trung việc gửi, tiếp nhận và theo dõi yêu cầu trên một hệ thống.
•  Giúp đội hỗ trợ biết công việc cần xử lý và trao đổi đúng ngữ cảnh.
•  Cung cấp lịch sử xử lý và số liệu phục vụ quản lý.
•  Rèn luyện làm rõ nghiệp vụ, thiết kế, lập trình, kiểm thử, review và triển khai theo nhóm.

3. Phạm vi
MVP phục vụ một công ty và một đội IT Support. Bao gồm quản lý yêu cầu, trao đổi, phân công, theo
dõi tiến độ, tra cứu, báo cáo cơ bản và quản trị cần thiết. Nhóm đề xuất cách chia các đợt bàn giao và
thống nhất với PO trước khi triển khai.

Ngoài phạm vi ban đầu: ứng dụng di động riêng, nhiều công ty trên một hệ thống, tích hợp email hoặc
chat, SSO doanh nghiệp, quản lý tài sản, AI tự động xử lý và quy trình phê duyệt nhiều cấp. Chỉ bổ
sung khi PO chấp thuận thay đổi phạm vi.

OpsFlow • Requirement Brief  |  1

4. Vai trò và yêu cầu tổng quan

Vai trò

Nhu cầu chính

Employee

Gửi yêu cầu, theo dõi tiến độ và trao đổi về yêu cầu của mình.

Support Agent

Xem hàng đợi hỗ trợ, tiếp nhận công việc, cập nhật tiến độ và phối hợp xử lý.

Administrator

Quản lý người dùng, danh mục cần thiết, cấu hình trong phạm vi được thống nhất và
xem báo cáo.

Mã

Yêu cầu ở mức tổng quan

FR01

Đăng nhập và giới hạn dữ liệu, thao tác phù hợp với vai trò.

FR02

Tạo yêu cầu với tiêu đề, nội dung, loại yêu cầu và thông tin giúp đánh giá độ ưu tiên; hệ thống ghi
nhận mã, người gửi và thời điểm tạo.

FR03

Theo dõi trạng thái, người xử lý và tiến độ của yêu cầu.

FR04

Hỗ trợ tiếp nhận, phân công và quản lý công việc của đội hỗ trợ.

FR05

Cho phép trao đổi trong ngữ cảnh yêu cầu và ghi nhận thông tin phục vụ xử lý.

FR06

Lưu lịch sử thay đổi để người có quyền có thể tra cứu.

FR07

Tìm kiếm, lọc và phân trang danh sách theo nhu cầu công việc.

FR08

Giúp nhận biết yêu cầu cần chú ý về thời gian xử lý.

FR09

Cung cấp báo cáo về yêu cầu đang mở, xử lý kéo dài, thời gian xử lý và khối lượng công việc.

FR10

Quản lý tài khoản và các danh mục tối thiểu để vận hành MVP.

Luồng trạng thái, quyền thao tác cụ thể, cách đánh giá ưu tiên, cách tính thời gian và định nghĩa chỉ số
cần được nhóm làm rõ với PO. Nhóm ghi nhận câu hỏi, đề xuất phương án và xác nhận quyết định
trước khi coi đó là yêu cầu đã chốt.

OpsFlow • Requirement Brief  |  2

5. Sản phẩm bàn giao và cách làm việc

Sản phẩm bàn giao
•  Tài liệu yêu cầu đã làm rõ: Q&A log, user stories, acceptance criteria, phạm vi MVP và các giả định

đã được PO xác nhận.

•  Thiết kế: luồng màn hình, mô hình dữ liệu, API contract và các quyết định kỹ thuật quan trọng.
•  Mã nguồn frontend và backend, migration cơ sở dữ liệu, dữ liệu mẫu không chứa thông tin cá nhân

thật.

•  Bộ kiểm thử cho luồng chính, quyền truy cập và tình huống lỗi; báo cáo kết quả và các lỗi còn tồn

tại.

•  Môi trường demo có tài khoản theo vai trò; hướng dẫn cài đặt, cấu hình, chạy kiểm thử và triển

khai lại.

•  Tài liệu sử dụng ngắn, biên bản demo cuối kỳ, danh sách giới hạn và đề xuất phát triển tiếp.

Cách làm việc
Hai thành viên cùng chịu trách nhiệm sản phẩm đầu cuối. Chia công việc theo chức năng, luân phiên
người triển khai và người review; mỗi bạn cần tham gia cả API, dữ liệu, giao diện và kiểm thử. Có thể
dùng Java/Spring Boot, cơ sở dữ liệu SQL và React; nhóm trình bày lựa chọn cụ thể trước khi bắt đầu.

Duy trì backlog chung. Mỗi tuần demo phần chạy được, cập nhật rủi ro và trao đổi với PO. Trước khi
làm một story, phải có acceptance criteria đủ để kiểm thử. Mỗi quyết định nghiệp vụ ghi ngày, người
xác nhận và story bị ảnh hưởng; không tự biến giả định thành yêu cầu.

Một hạng mục được xem là hoàn tất khi đã được review, kiểm thử phù hợp, cập nhật tài liệu và trình
diễn trên môi trường chung theo tiêu chí đã thống nhất. Nếu có yêu cầu mới, nhóm đánh giá ảnh
hưởng và thương lượng lại phạm vi hoặc thời gian với PO.

Kỳ vọng phi chức năng
•  Bảo mật: kiểm tra quyền ở phía máy chủ, bảo vệ mật khẩu và cấu hình bí mật; không đưa thông tin

nhạy cảm vào log hoặc kho mã.

•  Tính đúng đắn: thao tác lỗi không để dữ liệu dở dang; xử lý phù hợp khi nhiều người cùng cập

nhật hoặc người dùng gửi lại thao tác.

•  Khả dụng: thông báo lỗi dễ hiểu, biểu mẫu rõ ràng, có trạng thái tải và trạng thái không có dữ liệu;

dùng được trên trình duyệt máy tính phổ biến.

•  Hiệu năng: danh sách có phân trang. Nhóm thống nhất dữ liệu thử, mức tải và ngưỡng phản hồi

với PO, sau đó đo và báo cáo.

•  Vận hành: có log phục vụ chẩn đoán, migration, hướng dẫn khôi phục dữ liệu và quy trình build

hoặc kiểm thử tự động.

OpsFlow • Requirement Brief  |  3

6. Tiến độ gợi ý
Lộ trình 2 tháng khoảng 8 tuần có thể điều chỉnh theo lịch OJT và năng lực thực tế. Ưu tiên một MVP
hoạt động đầy đủ; chỉ nhận phần mở rộng sau khi các luồng cốt lõi ổn định.

Thời gian

Trọng tâm

Đầu ra để review

Tuần 1

Khảo sát và làm rõ

Q&A, backlog, acceptance criteria, wireframe và phạm vi MVP.

Tuần 2

Nền tảng và luồng đầu tiên

Thiết kế dữ liệu/API, đăng nhập, tạo và xem yêu cầu trên môi
trường chung.

Tuần 3–4

Xử lý công việc

Luồng xử lý, phân công và trao đổi theo quyết định PO đã chốt.

Tuần 5–6

Tra cứu và theo dõi

Lịch sử, tìm kiếm/lọc, theo dõi thời gian và dashboard cơ bản.

Tuần 7

Kiểm thử và hoàn thiện

Kiểm tra quyền, cập nhật đồng thời, lỗi, hiệu năng; xử lý phản
hồi demo.

Tuần 8

Nghiệm thu và bàn giao

Demo end-to-end, báo cáo kiểm thử, hướng dẫn triển khai và
tổng kết cá nhân.

Chuẩn bị cho buổi làm rõ đầu tiên
Nhóm gửi trước danh sách câu hỏi được ưu tiên theo mức ảnh hưởng đến thiết kế và kiểm thử. Các
chủ đề cần khảo sát gồm: vòng đời yêu cầu; trách nhiệm xử lý; quyền xem và sửa; mức độ ưu tiên;
thời gian cam kết; phạm vi thông tin trao đổi; cách hiểu từng số liệu báo cáo.

Với mỗi điểm chưa rõ, ghi tình huống minh họa và đề xuất cách xử lý để PO phản hồi. Sau buổi trao
đổi, cập nhật backlog và acceptance criteria, đồng thời chỉ ra những điểm còn chờ quyết định.

OpsFlow • Requirement Brief  |  4

