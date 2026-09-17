# Backend Contract Reference

Frontend tích hợp theo contract chính thức của repo
[`kiendt2312/caesar-cipher-be`](https://github.com/kiendt2312/caesar-cipher-be).

## Phiên bản được ghim

- Handoff baseline: [`9b5cfb2`](https://github.com/kiendt2312/caesar-cipher-be/blob/9b5cfb2bf75550a8c9295b06e2d0b8dc9e825be4/repo_docs/frontend-integration.md)
  (`9b5cfb2bf75550a8c9295b06e2d0b8dc9e825be4`)
- Backend implementation được handoff dẫn chiếu:
  `fa009eb92b953000afd1a8c31273ae73d901a84a`
- Nguồn có thẩm quyền: completed OpenSpec change
  `openspec/changes/caesar-cipher-week1-mvp/` trong repo Backend.

Nếu tài liệu FE khác OpenSpec Backend, OpenSpec Backend được ưu tiên và tài liệu FE phải sửa.

## Runtime boundary

- Backend thật chạy tại `http://localhost:8000`.
- FE gọi URL tương đối `/api/...`; Vite proxy `/api` về Backend khi phát triển.
- Production Week 1 là same-origin do FastAPI phục vụ UI và API; không yêu cầu CORS.
- `/docs` và `/openapi.json` dùng để đối chiếu schema; `GET /health` không thuộc contract.

## Điểm tích hợp phải giữ

- Success JSON chỉ có `success`, `result`; error JSON chỉ có `success`, `message`.
- FE kiểm tra HTTP status và body, hiển thị nguyên văn `message` hợp lệ từ Backend.
- Text whitespace-only hợp lệ; key gửi dưới dạng JSON integer thật sự, không phải string.
- File giới hạn chính xác 5 MiB; preview dùng `response_mode=content`.
- Download file là request thứ hai với `response_mode=file`, dùng attachment của Backend.
- Result server là nguồn có thẩm quyền; client-side Caesar chỉ tồn tại trong mock opt-in.

Không sao chép lại ma trận lỗi và toàn bộ scenario ở đây. Khi cần chi tiết, đọc handoff và
OpenSpec đã ghim ở trên.
