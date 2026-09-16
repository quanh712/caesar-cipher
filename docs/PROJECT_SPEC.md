# Caesar Cipher Frontend Week 1 Specification

## 1. Mục tiêu

Xây dựng ứng dụng web một trang cho phép người dùng mã hóa và giải mã Caesar Cipher bằng văn bản hoặc file `.txt`. Giao diện phải bám sát `Caesar_Cipher_Tool_Demo.html`, hoạt động tốt trên desktop và mobile, đồng thời sẵn sàng tích hợp Backend khi API được cung cấp.

Tài liệu này là nguồn yêu cầu chính cho quá trình phát triển Week 1. Nếu prototype HTML, tài liệu scope cũ và tài liệu này khác nhau, nhóm cần cập nhật tài liệu này sau khi thống nhất thay đổi.

## 2. Phạm vi

### 2.1 Trong phạm vi

- Chế độ Encrypt và Decrypt.
- Bộ chọn thuật toán gồm Caesar, Hill và Huffman; Caesar là thuật toán khả dụng trong phase hiện tại.
- Input bằng text hoặc file `.txt`.
- Khóa Caesar là số nguyên và được chuẩn hóa về `0–25`.
- Hiển thị, sao chép, xóa và tải xuống kết quả.
- Validation, loading, success, server error và network error.
- Mock API để FE hoạt động độc lập khi chưa có Backend.
- Docker image phục vụ static SPA bằng Nginx.

### 2.2 Ngoài phạm vi

- Authentication và phân quyền.
- Lịch sử xử lý và database.
- Logic xử lý Hill và Huffman; hai lựa chọn này chỉ hiển thị trạng thái sắp hỗ trợ.
- Brute force và frequency analysis.
- Dashboard, user settings và quản lý file nâng cao.
- Lưu trạng thái sau khi tải lại trang.

## 3. Đối tượng sử dụng

Người dùng cần thử nhanh Caesar Cipher, kiểm tra kết quả mã hóa/giải mã hoặc xử lý một file văn bản nhỏ mà không cần đăng nhập.

## 4. Luồng sử dụng

### 4.1 Text mode

1. Người dùng chọn Encrypt hoặc Decrypt.
2. Người dùng chọn Text.
3. Người dùng nhập nội dung multiline.
4. Người dùng nhập khóa số nguyên.
5. FE validate dữ liệu và chỉ bật nút xử lý khi hợp lệ.
6. FE gửi request đến API hoặc mock API.
7. FE hiển thị kết quả và thông báo trạng thái.
8. Người dùng có thể copy hoặc clear kết quả.

### 4.2 File mode

1. Người dùng chọn Encrypt hoặc Decrypt.
2. Người dùng chọn File `.txt`.
3. Người dùng chọn file hợp lệ và nhập khóa.
4. FE validate file trước khi gửi.
5. FE gửi multipart request đến API hoặc mock API.
6. FE hiển thị kết quả, cho phép copy, clear hoặc download file kết quả.

## 5. Yêu cầu chức năng và acceptance criteria

### FE-01 Caesar Tool Layout

Ứng dụng cung cấp bố cục debugger gồm header, mode selector, input panel, output panel, key configuration, action button và notification.

Acceptance criteria:

- Giao diện bám sát màu sắc, khoảng cách, typography và bố cục của file HTML demo.
- Desktop từ `901px`: input và output hiển thị hai cột.
- Tablet/mobile từ `900px` trở xuống: input và output chuyển thành một cột.
- Không xuất hiện horizontal scroll ở viewport từ `320px` trở lên, ngoại trừ thành phần có chủ đích như alphabet map.
- Các trạng thái focus phải nhìn thấy được khi điều hướng bằng bàn phím.
- Branding hiển thị `CIPHER WORKBENCH` và không hiển thị nhãn nội bộ `Week 1 MVP`.
- Bộ chọn thuật toán nằm trên bộ chọn Encode/Decode.
- Header có nút làm mới để tải lại workspace về trạng thái ban đầu.
- Với Caesar, bảng dịch chuyển A–Z nằm ngay trên phần nhập khóa, cập nhật theo mode và khóa chuẩn hóa.
- Bảng dịch chuyển đánh dấu các chữ cái ASCII xuất hiện trong input, tương tự HTML prototype.

### FE-02 Input Panel

Acceptance criteria cho Text mode:

- Textarea hỗ trợ multiline và giữ nguyên line break.
- Clear xóa toàn bộ input.
- Copy sao chép đúng nội dung input, bao gồm line break.
- Nội dung chỉ chứa whitespace được xem là không hợp lệ.

Acceptance criteria cho File mode:

- Chỉ chấp nhận file có phần mở rộng `.txt`, không phân biệt chữ hoa/thường.
- Hiển thị tên và kích thước file đã chọn.
- Change mở lại bộ chọn file.
- Remove xóa file và dữ liệu preview khỏi state.
- File rỗng hoặc lớn hơn `1 MiB` không được xử lý.

### FE-03 Cipher Configuration

- Mode có đúng hai giá trị: `encrypt` và `decrypt`.
- Input type có đúng hai giá trị: `text` và `file`.
- Key bắt buộc là số nguyên, cho phép số âm và số lớn hơn `25`.
- Key phải nằm trong phạm vi số nguyên an toàn của JavaScript để tránh mất độ chính xác khi gửi API.
- Key được chuẩn hóa theo công thức `((key % 26) + 26) % 26`.
- UI hiển thị khóa đã chuẩn hóa khi khác khóa người dùng nhập.
- Phần khóa chỉ có ô nhập và trạng thái validation; không hiển thị nút Copy hoặc Clear.

Ví dụ:

| Key nhập | Key chuẩn hóa |
| -------: | ------------: |
|      `3` |           `3` |
|     `29` |           `3` |
|     `-3` |          `23` |
|     `26` |           `0` |

### FE-04 Output Panel

- Kết quả giữ nguyên line break và whitespace cơ bản từ response.
- Copy sao chép chính xác kết quả.
- Clear chỉ xóa output, không xóa input và key.
- Download chỉ xuất hiện trong File mode và tạo file UTF-8 `.txt`.
- Tên file download theo mẫu `{originalName}_{encrypt|decrypt}.txt`.
- Các nút output bị disable khi chưa có kết quả.

### FE-05 API Integration

- API logic nằm trong service riêng, component không gọi `fetch` trực tiếp.
- Mock API và API thật phải trả cùng response contract.
- Base URL được lấy từ `VITE_API_BASE_URL`.
- `VITE_USE_MOCK_API=true` sử dụng mock; giá trị `false` sử dụng Backend thật.
- FE không tự thay đổi message lỗi nghiệp vụ do Backend trả về.

### FE-06 Validation and State

- Action button bị disable khi input không hợp lệ, key không hợp lệ hoặc request đang chạy.
- Trong lúc request, input và key không được thay đổi.
- Trong lúc request, algorithm, mode, input type, input clear và example generator cũng bị khóa.
- Chỉ có tối đa một request xử lý được gửi tại một thời điểm.
- Thành công cập nhật output và success notification.
- Lỗi nghiệp vụ, HTTP và network không làm mất input hiện tại.
- Request mới phải xóa notification cũ nhưng giữ output cũ cho đến khi nhận kết quả thành công mới.
- Output, thống kê và tên file download phải dùng snapshot của request đã hoàn thành, không dùng input đang chỉnh sửa.

### FE-07 Notification

- Có hai nhóm hiển thị chính: success và error.
- Các trường hợp tối thiểu: encryption successful, decryption successful, invalid key, invalid file, server error và network error.
- Notification có nút đóng và hỗ trợ `role="status"` hoặc cơ chế tương đương cho assistive technology.
- Khi Backend trả `message`, FE ưu tiên hiển thị message đó.

## 6. Quy tắc Caesar Cipher

- Chỉ dịch chuyển chữ cái ASCII `A–Z` và `a–z`.
- Giữ nguyên chữ hoa/chữ thường.
- Giữ nguyên số, khoảng trắng, dấu câu, ký tự tiếng Việt và ký tự Unicode khác.
- Encrypt dịch tiến theo key chuẩn hóa.
- Decrypt dịch lùi theo key chuẩn hóa.

Ví dụ với key `3`:

- `Hello World` → `Khoor Zruog`.
- `Khoor Zruog` → `Hello World` khi decrypt.
- `Xin chào 2026!` → `Alq fkàr 2026!`; ký tự `à` được giữ nguyên.

## 7. API contract tạm thời

Contract này dùng để FE phát triển và phải được Backend xác nhận trước khi tích hợp thật.

### 7.1 Encrypt text

`POST /api/caesar/encrypt`

Request:

```json
{
  "text": "Hello World",
  "key": 3
}
```

Success response, HTTP `200`:

```json
{
  "success": true,
  "result": "Khoor Zruog"
}
```

### 7.2 Decrypt text

`POST /api/caesar/decrypt`

Request và response dùng cùng schema với Encrypt text.

### 7.3 Process file

`POST /api/caesar/file`

Content type: `multipart/form-data`.

| Field    | Type           | Required | Quy tắc                           |
| -------- | -------------- | -------- | --------------------------------- |
| `file`   | File           | Có       | `.txt`, khác rỗng, tối đa `1 MiB` |
| `key`    | Integer string | Có       | Cho phép âm và lớn hơn `25`       |
| `action` | String         | Có       | `encrypt` hoặc `decrypt`          |

Success response dùng cùng JSON schema với Text API. `result` chứa toàn bộ nội dung file đã xử lý.

### 7.4 Error response

HTTP status đề xuất:

| Status | Trường hợp                                |
| -----: | ----------------------------------------- |
|  `400` | Request thiếu field hoặc sai kiểu dữ liệu |
|  `413` | File vượt giới hạn                        |
|  `415` | File không được hỗ trợ                    |
|  `422` | Dữ liệu đúng schema nhưng không thể xử lý |
|  `500` | Lỗi không mong đợi từ server              |

Body:

```json
{
  "success": false,
  "message": "Khóa phải là số nguyên.",
  "code": "INVALID_KEY"
}
```

`code` là trường khuyến nghị để FE có thể mapping hành vi ổn định; `message` dùng để hiển thị.

### 7.5 Yêu cầu Backend cần xác nhận

- Endpoint và HTTP method chính thức.
- Key nhận JSON number hay string.
- Giới hạn file và encoding được hỗ trợ.
- Response file là JSON text hay file stream.
- Error status, error code và message chính thức.
- CORS origins cho local, staging và production.

## 8. Kiến trúc Frontend

```text
src/
├── app/                         # App shell và global styles
├── features/caesar/
│   ├── components/              # UI theo FE-01 đến FE-07
│   ├── hooks/                   # Screen state và orchestration
│   ├── services/                # API và mock adapter
│   ├── types/                   # Request, response và UI types
│   └── utils/                   # Caesar algorithm và validation
└── shared/components/           # Thành phần dùng chung
```

Nguyên tắc:

- Component tập trung render và interaction.
- Hook quản lý state và điều phối use case.
- Service chịu trách nhiệm HTTP/mock transport.
- Utils không phụ thuộc React và có thể unit test độc lập.
- Không thêm global state library trong Week 1 vì chỉ có một feature và state không cần chia sẻ toàn ứng dụng.

## 9. Công nghệ và chất lượng

- Runtime UI: React và TypeScript.
- Build tool: Vite.
- Styling: feature-scoped CSS; giao diện bám prototype.
- Unit/component test: Vitest và React Testing Library.
- API mocking: Mock Service Worker.
- End-to-end test: Playwright trên Desktop Chrome và mobile viewport.
- Code quality: ESLint và Prettier.

Các quality gate khả dụng: `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:e2e`, `npm run build` và `npm run check:all`.

## 10. Docker và triển khai

Docker image dùng hai stage:

1. `node:22-alpine` cài dependency bằng `npm ci` và tạo production build.
2. `nginx:1.27-alpine` phục vụ thư mục `dist`.

Nginx phải:

- Hỗ trợ SPA fallback về `index.html`.
- Có endpoint health check `GET /health` trả HTTP `200` và body `ok`.
- Cache static assets có hash trong thời gian phù hợp.

Chạy local:

```bash
docker compose up --build
```

Ứng dụng mặc định mở tại `http://localhost:8081` và chạy mock API.

Chạy với Backend thật:

```bash
VITE_USE_MOCK_API=false VITE_API_BASE_URL=http://localhost:8080 docker compose up --build
```

Production dự kiến dùng cùng origin:

```text
Website: https://cipherworkbench.com
API:     https://cipherworkbench.com/api/...
```

`cipherworkbench.com` đang ở trạng thái dự kiến, chờ đăng ký và cấu hình DNS. Khi build production
sau khi domain được xác nhận, đặt `VITE_USE_MOCK_API=false` và `VITE_API_BASE_URL` thành chuỗi rỗng
để FE gọi API qua đường dẫn tương đối `/api/...`.

Lưu ý: biến `VITE_*` được nhúng ở build time. Thay đổi biến yêu cầu build lại image.

## 11. Definition of Done chung

Một ticket chỉ được xem là hoàn thành khi đáp ứng toàn bộ điều kiện liên quan:

- Đáp ứng acceptance criteria trong tài liệu này.
- Không có lỗi TypeScript qua `npm run typecheck`.
- Production build thành công qua `npm run build`.
- Có unit/component test cho logic hoặc interaction mới sau khi test stack được cấu hình.
- Các test liên quan đều pass.
- Đã kiểm tra Chrome ở desktop và mobile viewport.
- Không có lỗi console trong happy path.
- Không làm sai hành vi đã hoàn thành của ticket khác.
- Tài liệu được cập nhật nếu API, validation hoặc hành vi thay đổi.
- Pull request được review trước khi merge.

## 12. Điều kiện hoàn thành Week 1

- FE-01 đến FE-07 đạt Definition of Done.
- Happy path Text Encrypt và Text Decrypt hoạt động.
- Happy path File Encrypt và File Decrypt hoạt động.
- Các validation chính được kiểm thử.
- Mock mode chạy độc lập không cần Backend.
- Real API mode sẵn sàng sau khi Backend xác nhận contract.
- Docker image build thành công và health check hoạt động.
- Không triển khai tính năng ngoài phạm vi Week 1.
