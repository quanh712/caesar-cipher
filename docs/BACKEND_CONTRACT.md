# Backend Contract Reference

Frontend tích hợp theo contract chính thức của repo
[`kiendt2312/caesar-cipher-be`](https://github.com/kiendt2312/caesar-cipher-be).

## Phiên bản được ghim

- Consumer guide: [`82c09f4`](https://github.com/kiendt2312/caesar-cipher-be/blob/82c09f45c9c9c860850556de94c822554062dfc9/repo_docs/frontend-integration.md)
  (`82c09f45c9c9c860850556de94c822554062dfc9`)
- Backend implementation được guide dẫn chiếu:
  `1792a29a8925dc7122ebbe62fe55caef14a00a18`
- Nguồn có thẩm quyền: completed OpenSpec changes
  `openspec/changes/caesar-cipher-week1-mvp/` và
  `openspec/changes/add-playfair-vigenere-ciphers/` trong repo Backend.

Nếu tài liệu FE khác OpenSpec Backend, OpenSpec Backend được ưu tiên và tài liệu FE phải sửa.

## Runtime boundary

- Backend thật chạy tại `http://localhost:8000`.
- FE gọi URL tương đối `/api/...`; Vite proxy `/api` về Backend khi phát triển.
- Production là same-origin; không yêu cầu CORS.
- `/docs` và `/openapi.json` dùng để đối chiếu schema; `GET /health` không thuộc contract.

## Điểm tích hợp phải giữ

- Success JSON chỉ có `success`, `result`; error JSON chỉ có `success`, `message`.
- FE kiểm tra HTTP status và body, hiển thị nguyên văn `message` hợp lệ từ Backend.
- Caesar text gửi key dưới dạng JSON integer thật sự. Vigenère và Playfair gửi key string.
- Vigenère key phải khớp `[A-Za-z]+` và không được trim/sửa trước khi gửi.
- Playfair là luồng normalize có mất dữ liệu; UI phải cảnh báo và không tự xóa filler `X/Q`.
- File giới hạn chính xác 5 MiB; preview dùng `response_mode=content`.
- Download file là request thứ hai với `response_mode=file`, dùng attachment của Backend.
- Result server là nguồn có thẩm quyền; không có runtime mock hoặc local cipher result.

Không sao chép lại ma trận lỗi và toàn bộ scenario ở đây. Khi cần chi tiết, đọc handoff và
OpenSpec đã ghim ở trên.
