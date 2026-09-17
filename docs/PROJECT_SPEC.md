# Cipher Workbench — Frontend Week 1 Specification

## 1. Phạm vi

Frontend Week 1 chỉ hỗ trợ Caesar Cipher với hai chế độ mã hóa/giải mã và hai nguồn
đầu vào: văn bản hoặc file `.txt`. Hill, Huffman, authentication, history,
database và các cipher động nằm ngoài phạm vi.

Contract tích hợp không được định nghĩa lại trong tài liệu này. Nguồn có thẩm quyền
được ghim tại [`BACKEND_CONTRACT.md`](BACKEND_CONTRACT.md).

## 2. UI bắt buộc

- Branding là `Cipher Workbench`; không hiển thị nhãn nội bộ hoặc cipher ngoài phạm vi.
- Trạng thái ban đầu: mã hóa, nguồn văn bản, chưa có input/key/result.
- Có chế độ mã hóa/giải mã, nguồn văn bản/file, nút tạo ví dụ và làm mới toàn bộ.
- Input, key và output có status neutral/valid/error riêng, gồm cả text/ký hiệu và live region.
- Output có hai view `Văn bản` và `Phân tích`; sao chép, xóa và tải kết quả bị khóa khi chưa có result.
- Bảng dịch chuyển gồm hai hàng A–Z, dùng key chuẩn hóa; mapping 0 khi key không hợp lệ.
- File panel hỗ trợ picker, kéo thả, bàn phím, preview, đổi file, gỡ file và kích thước byte/KiB/MiB.
- Tất cả control có focus indicator, semantics phù hợp và bị khóa thật sự trong khi xử lý.
- Desktop dùng hai cột; màn hình từ 800 px trở xuống dùng một cột; không tạo horizontal scroll toàn trang.

## 3. State và hành vi

- Đổi mode/source hoặc sửa input/key phải xóa result, analysis và notice cũ.
- Đổi source vẫn giữ dữ liệu riêng của nguồn văn bản và file.
- Submit xóa result cũ trước khi request và chỉ hiển thị result do server trả về.
- Lỗi API/network/download để result rỗng và cho phép thử lại.
- Xóa input chỉ xóa nguồn đang chọn; xóa output giữ input/key; làm mới reset toàn bộ.
- `Tạo ví dụ` chọn nguồn văn bản, điền `Hello World`, key `3` và làm action sẵn sàng.
- Text chỉ rỗng khi `length === 0`; whitespace-only là hợp lệ.
- Key text là JSON integer không mất chính xác; key file sau trim tối đa 32 ký tự.
- Shift-map và analysis được tính phía client để minh họa; result luôn do server quyết định.

## 4. File và download

- File phải có đuôi `.txt` không phân biệt hoa thường, lớn hơn 0 byte và tối đa
  `5 MiB = 5.242.880 byte`.
- Preview gửi `response_mode=content`.
- Download file gửi request thứ hai với `response_mode=file`; không đóng preview vào Blob.
- Download text được phép tạo Blob từ result server với tên `ket-qua.encrypted.txt` hoặc
  `ket-qua.decrypted.txt`.
- Download file dùng filename trong `Content-Disposition`; Backend quyết định BOM và nội dung.

## 5. Mock ngoại lệ

Mock là ngoại lệ duy nhất so với quy tắc “không tính result Caesar trong browser”:

- `npm run dev` luôn dùng API thật qua proxy `/api` đến `localhost:8000`.
- `npm run dev:mock` mới bật mock.
- UI hiển thị `Bản demo giả lập` khi mock đang bật.
- Mock phải mô phỏng response, validation, file preview, attachment filename và BOM của Backend.
- Không bật mock trong production hoặc integration test.

## 6. Definition of Done

- Format, lint, TypeScript, unit/component test và production build đều đạt.
- Mock E2E đạt trên desktop/mobile.
- Integration E2E đạt khi Backend baseline đang chạy tại cổng `8000`.
- Không còn URL Backend hard-code trong runtime code, CORS assumption, `/health` API assumption,
  error `code`, giới hạn 1 MiB hoặc filename kiểu `_encrypted.txt`.
