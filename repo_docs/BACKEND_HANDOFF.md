# Cipher Workbench Backend Handoff

## 1. Mục đích tài liệu

Tài liệu này là API contract chính thức để Backend triển khai tính năng Caesar Cipher cho sản phẩm Cipher Workbench và để Frontend chuyển từ mock API sang API thật. Các yêu cầu được đánh dấu bắt buộc phải được đáp ứng trước khi tích hợp; thông tin hạ tầng chưa có được ghi rõ là đang chờ xác nhận.

Phạm vi hiện tại chỉ gồm Caesar Cipher. Hill và Huffman mới là lựa chọn hiển thị trên giao diện, chưa cần Backend xử lý trong phase này.

## 2. Kết quả Backend cần bàn giao

Backend cần cung cấp ba API:

| Chức năng          | Method | Endpoint              |
| ------------------ | ------ | --------------------- |
| Mã hóa văn bản     | `POST` | `/api/caesar/encrypt` |
| Giải mã văn bản    | `POST` | `/api/caesar/decrypt` |
| Xử lý file văn bản | `POST` | `/api/caesar/file`    |

Ngoài ba API trên, Backend phải cung cấp `GET /health` và response lỗi theo mục 7.

## 3. Quy tắc nghiệp vụ Caesar Cipher

Backend phải áp dụng cùng quy tắc với Frontend:

- Chỉ dịch chuyển ký tự ASCII `A-Z` và `a-z`.
- Giữ nguyên chữ hoa và chữ thường.
- Giữ nguyên số, dấu câu, khoảng trắng, xuống dòng, ký tự tiếng Việt và các ký tự Unicode khác.
- Encrypt dịch tiến theo khóa đã chuẩn hóa.
- Decrypt dịch lùi theo khóa đã chuẩn hóa.
- Khóa đầu vào phải là số nguyên an toàn trong JavaScript, từ `-9007199254740991` đến `9007199254740991`.
- Chuẩn hóa khóa bằng công thức `((key % 26) + 26) % 26`.

Ví dụ:

| Input            | Mode    |  Key | Normalized key | Result           |
| ---------------- | ------- | ---: | -------------: | ---------------- |
| `Hello World`    | encrypt |  `3` |            `3` | `Khoor Zruog`    |
| `Khoor Zruog`    | decrypt |  `3` |            `3` | `Hello World`    |
| `Abc XYZ`        | encrypt | `29` |            `3` | `Def ABC`        |
| `Abc XYZ`        | encrypt | `-3` |           `23` | `Xyz UVW`        |
| `Xin chào 2026!` | encrypt |  `3` |            `3` | `Alq fkàr 2026!` |

Lưu ý: ký tự `à` trong ví dụ cuối không thuộc ASCII nên phải được giữ nguyên.

## 4. API xử lý văn bản

### 4.1 Encrypt

```http
POST /api/caesar/encrypt
Content-Type: application/json
```

Request body:

```json
{
  "text": "Hello World",
  "key": 3
}
```

Success response:

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

```json
{
  "success": true,
  "result": "Khoor Zruog"
}
```

### 4.2 Decrypt

```http
POST /api/caesar/decrypt
Content-Type: application/json
```

Request body và response dùng cùng schema với Encrypt. Với request:

```json
{
  "text": "Khoor Zruog",
  "key": 3
}
```

Backend trả:

```json
{
  "success": true,
  "result": "Hello World"
}
```

### 4.3 Validation cho text API

- `text` là string bắt buộc.
- `text` rỗng hoặc chỉ chứa whitespace là không hợp lệ.
- `key` là JSON number bắt buộc.
- `key` phải là số nguyên hữu hạn trong phạm vi số nguyên an toàn của JavaScript.
- Backend không tự trim hoặc thay đổi nội dung hợp lệ của `text`; kết quả phải giữ nguyên line break và whitespace.
- Không cần nhận `mode` trong body vì mode đã được xác định bởi endpoint.

## 5. API xử lý file

```http
POST /api/caesar/file
Content-Type: multipart/form-data
```

Các field:

| Field    | Kiểu dữ liệu   | Bắt buộc | Quy tắc                                              |
| -------- | -------------- | -------- | ---------------------------------------------------- |
| `file`   | File           | Có       | Tên kết thúc bằng `.txt`, không phân biệt hoa thường |
| `key`    | Integer string | Có       | Cùng phạm vi với key của text API                    |
| `action` | String         | Có       | Chỉ nhận `encrypt` hoặc `decrypt`                    |

Quy tắc file:

- File phải có kích thước lớn hơn `0` byte và không vượt quá `1 MiB`, tương đương `1,048,576` byte.
- Nội dung file phải là UTF-8 hợp lệ. Backend không tự đoán hoặc chuyển đổi encoding khác.
- Backend trả kết quả trong JSON, không trả file stream trong phase hiện tại.
- `result` chứa toàn bộ nội dung sau xử lý và phải giữ nguyên line break cùng whitespace cơ bản.
- Frontend tự tạo file `.txt` để người dùng tải xuống.

Success response:

```json
{
  "success": true,
  "result": "Nội dung file sau khi xử lý"
}
```

Ví dụ request:

```bash
curl -X POST http://localhost:8080/api/caesar/file \
  -F "file=@sample.txt;type=text/plain" \
  -F "key=3" \
  -F "action=encrypt"
```

## 6. Response contract

### 6.1 Thành công

```ts
interface CaesarSuccessResponse {
  success: true;
  result: string;
}
```

Quy tắc:

- HTTP status là `200`.
- `success` luôn là `true`.
- `result` luôn tồn tại và là string; không trả `null`.

### 6.2 Thất bại

```ts
interface CaesarErrorResponse {
  success: false;
  message: string;
  code: string;
}
```

Ví dụ:

```json
{
  "success": false,
  "message": "Khóa phải là số nguyên.",
  "code": "INVALID_KEY"
}
```

Quy tắc:

- Mọi lỗi nghiệp vụ và lỗi validation đều trả JSON theo schema trên.
- Mỗi response chỉ trả một lỗi ưu tiên đầu tiên; phase hiện tại không có `details[]`.
- `message` là nội dung tiếng Việt có thể hiển thị trực tiếp cho người dùng.
- `code` là mã ổn định để FE có thể xử lý theo loại lỗi; không dùng message làm mã định danh.
- Response lỗi không cần field `result`.
- Lỗi không mong đợi không được trả stack trace, đường dẫn máy chủ hoặc thông tin nhạy cảm.

## 7. HTTP status và error code

| HTTP status | Error code đề xuất      | Trường hợp                                         |
| ----------: | ----------------------- | -------------------------------------------------- |
|       `400` | `INVALID_REQUEST`       | Thiếu field, sai JSON hoặc sai kiểu dữ liệu        |
|       `400` | `EMPTY_TEXT`            | Text rỗng hoặc chỉ chứa whitespace                 |
|       `400` | `INVALID_KEY`           | Key không phải số nguyên hoặc vượt phạm vi an toàn |
|       `400` | `INVALID_ACTION`        | Action không phải `encrypt` hoặc `decrypt`         |
|       `400` | `EMPTY_FILE`            | File có kích thước bằng 0                          |
|       `413` | `FILE_TOO_LARGE`        | File vượt quá `1 MiB`                              |
|       `415` | `UNSUPPORTED_FILE_TYPE` | File không có phần mở rộng `.txt`                  |
|       `415` | `UNSUPPORTED_ENCODING`  | File không thể đọc dưới dạng UTF-8 hợp lệ          |
|       `422` | `PROCESSING_FAILED`     | Request hợp lệ nhưng không thể xử lý               |
|       `500` | `INTERNAL_ERROR`        | Lỗi không mong đợi từ server                       |

Không trả HTTP `200` với `success: false`. HTTP status và field `success` phải nhất quán.

## 8. Domain, routing và CORS

Frontend lấy URL Backend từ biến build-time. Local integration dùng:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_USE_MOCK_API=false
```

Môi trường local hiện tại:

- Frontend: `http://localhost:8081`
- Backend dự kiến: `http://localhost:8080`

Backend cần cho phép tối thiểu:

- Origin local: `http://localhost:8081`.
- Method: `POST` và `OPTIONS`.
- Request headers: `Content-Type`.
- Không cần credentials hoặc cookie trong phase hiện tại.

Production dự kiến dùng cùng origin:

```text
Frontend: https://cipherworkbench.com
API:      https://cipherworkbench.com/api/...
```

Trạng thái của `cipherworkbench.com` là **pending registration and DNS configuration**. Domain chưa được xem là sẵn sàng cho đến khi việc đăng ký, DNS và TLS được xác nhận.

Production build dùng:

```env
VITE_API_BASE_URL=
VITE_USE_MOCK_API=false
```

Với cùng origin, trình duyệt không cần CORS giữa FE và BE. Reverse proxy tại production phải chuyển `/api/*` tới Backend. Nginx của FE chưa cấu hình `proxy_pass` cho đến khi BE cung cấp upstream URL hoặc Docker service name.

Nếu staging hoặc một môi trường khác tách FE và BE thành hai origin, danh sách origin cho phép phải được cấu hình bằng environment variable. Không hard-code wildcard `*` nếu hệ thống sử dụng credentials.

## 9. Yêu cầu phi chức năng tối thiểu

- API xử lý tối đa một file `1 MiB` mà không cắt bớt nội dung.
- Response JSON sử dụng UTF-8.
- Không cần authentication, database, history hoặc lưu file trong phase hiện tại.
- File upload chỉ cần xử lý trong request; không lưu file lâu dài trên server.
- Nên giới hạn request body ở mức phù hợp với giới hạn file và multipart overhead.
- Nên có request logging nhưng không ghi toàn bộ nội dung text hoặc file của người dùng vào log.
- Bắt buộc cung cấp `GET /health`, trả HTTP `200` với `{ "status": "ok" }` khi service sẵn sàng nhận request.

## 10. Acceptance test cho Backend

Backend được xem là sẵn sàng tích hợp khi các trường hợp sau đều pass:

1. Encrypt `Hello World` với key `3` trả `Khoor Zruog`.
2. Decrypt `Khoor Zruog` với key `3` trả `Hello World`.
3. Key `29`, `-3`, `0` và `26` được chuẩn hóa đúng.
4. Chữ hoa, chữ thường, số, punctuation, whitespace và line break được giữ đúng quy tắc.
5. Ký tự Unicode ngoài ASCII không bị thay đổi.
6. Text rỗng, whitespace-only, thiếu key, key thập phân và key vượt safe integer trả lỗi đúng schema.
7. File `.txt` UTF-8 hợp lệ được xử lý thành công ở cả hai action.
8. File rỗng, file lớn hơn `1 MiB` và file không phải `.txt` trả đúng status cùng error code.
9. Request từ `http://localhost:8081` không bị CORS chặn.
10. Response lỗi không làm lộ stack trace hoặc thông tin nội bộ.
11. Mỗi response lỗi chỉ chứa một lỗi ưu tiên đầu tiên với `code` và `message`.
12. File không phải UTF-8 hợp lệ trả `415` với code `UNSUPPORTED_ENCODING`.
13. `GET /health` trả `200` với `{ "status": "ok" }`.

## 11. Các quyết định contract đã chốt

- [x] Giữ ba endpoint Caesar hiện tại; chưa tạo API tổng quát cho Hill và Huffman.
- [x] Text API nhận `key` dưới dạng JSON number.
- [x] File API nhận `key` dưới dạng integer string trong multipart form.
- [x] File giới hạn ở `1 MiB` và chỉ nhận UTF-8 hợp lệ.
- [x] File API trả JSON text thay vì file stream.
- [x] Backend là nguồn validation cuối cùng; FE vẫn validate sớm cho UX.
- [x] Error response luôn có `code` ổn định và `message` tiếng Việt.
- [x] Mỗi response chỉ trả một lỗi ưu tiên đầu tiên.
- [x] API không thêm `/v1` trong MVP.
- [x] Production dùng cùng origin và reverse proxy `/api`.
- [x] `GET /health` là bắt buộc.
- [ ] Đăng ký `cipherworkbench.com` và xác nhận quyền quản lý DNS.
- [ ] Cung cấp Backend upstream URL hoặc Docker service name cho reverse proxy.
- [ ] Backend test pass các acceptance test tại mục 10.

## 12. Trạng thái tích hợp hiện tại

- Frontend đang mặc định dùng mock API với `VITE_USE_MOCK_API=true`.
- Service gọi API thật đã tồn tại tại `src/features/caesar/services/caesarApi.ts`.
- Frontend chưa bật API thật mặc định cho đến khi Backend đáp ứng contract và cung cấp upstream.
- Parser lỗi HTTP hiện tại của FE mới hiển thị message tổng quát theo status. FE-05 cần được hoàn thành để đọc và ưu tiên `message` từ response lỗi trước khi tích hợp thật.

## 13. Ngoài phạm vi phase hiện tại

- Hill Cipher và Huffman Coding.
- Authentication và phân quyền.
- Database, lịch sử xử lý và lưu file.
- Brute force và frequency analysis.
- Streaming file và advanced file management.
- Rate limit theo tài khoản người dùng.

## 14. Nguồn đối chiếu

Contract này được tổng hợp từ:

- `docs/PROJECT_SPEC.md`.
- `FE Week 1 Scope – Caesar Cipher Tool UI.docx`.
- `src/features/caesar/services/caesarApi.ts`.
- `src/features/caesar/types/cipher.ts`.
- Validation và Caesar logic hiện có trong Frontend.

## 15. OpenAPI reference

Đoạn OpenAPI dưới đây là schema máy đọc tương ứng với contract trong tài liệu. Phần mô tả ở các mục trên vẫn là nguồn giải thích cho quy tắc nghiệp vụ và thứ tự validation.

```yaml
openapi: 3.1.0
info:
  title: Caesar Cipher API
  version: 1.0.0
servers:
  - url: http://localhost:8080
    description: Local Backend
  - url: https://cipherworkbench.com
    description: Planned production domain pending registration
paths:
  /health:
    get:
      operationId: getHealth
      responses:
        "200":
          description: Service is ready
          content:
            application/json:
              schema:
                type: object
                required: [status]
                properties:
                  status:
                    type: string
                    const: ok
  /api/caesar/encrypt:
    post:
      operationId: encryptText
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CaesarTextRequest"
      responses:
        "200":
          $ref: "#/components/responses/CaesarSuccess"
        "400":
          $ref: "#/components/responses/CaesarError"
        "500":
          $ref: "#/components/responses/CaesarError"
  /api/caesar/decrypt:
    post:
      operationId: decryptText
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CaesarTextRequest"
      responses:
        "200":
          $ref: "#/components/responses/CaesarSuccess"
        "400":
          $ref: "#/components/responses/CaesarError"
        "500":
          $ref: "#/components/responses/CaesarError"
  /api/caesar/file:
    post:
      operationId: processCaesarFile
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              required: [file, key, action]
              properties:
                file:
                  type: string
                  format: binary
                key:
                  type: string
                  pattern: "^-?[0-9]+$"
                action:
                  type: string
                  enum: [encrypt, decrypt]
      responses:
        "200":
          $ref: "#/components/responses/CaesarSuccess"
        "400":
          $ref: "#/components/responses/CaesarError"
        "413":
          $ref: "#/components/responses/CaesarError"
        "415":
          $ref: "#/components/responses/CaesarError"
        "422":
          $ref: "#/components/responses/CaesarError"
        "500":
          $ref: "#/components/responses/CaesarError"
components:
  schemas:
    CaesarTextRequest:
      type: object
      additionalProperties: false
      required: [text, key]
      properties:
        text:
          type: string
          minLength: 1
        key:
          type: integer
          minimum: -9007199254740991
          maximum: 9007199254740991
    CaesarSuccessResponse:
      type: object
      additionalProperties: false
      required: [success, result]
      properties:
        success:
          type: boolean
          const: true
        result:
          type: string
    CaesarErrorResponse:
      type: object
      additionalProperties: false
      required: [success, code, message]
      properties:
        success:
          type: boolean
          const: false
        code:
          type: string
        message:
          type: string
  responses:
    CaesarSuccess:
      description: Caesar operation completed
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/CaesarSuccessResponse"
    CaesarError:
      description: Request could not be processed
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/CaesarErrorResponse"
```
