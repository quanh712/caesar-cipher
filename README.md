# Cipher Workbench Frontend

React/Vite frontend cho Caesar Cipher Week 1. UI tích hợp theo Backend contract được ghim tại
[`docs/BACKEND_CONTRACT.md`](docs/BACKEND_CONTRACT.md); yêu cầu riêng của giao diện nằm tại
[`docs/PROJECT_SPEC.md`](docs/PROJECT_SPEC.md).

## Chạy với Backend thật

Khởi động Backend tại `http://localhost:8000`, sau đó:

```bash
npm install
npm run dev
```

Mở `http://localhost:5173`. Vite chuyển tiếp `/api` sang Backend ở cổng `8000`; không cần CORS và
runtime code không ghi cứng Backend URL.

Swagger và schema Backend:

- <http://localhost:8000/docs>
- <http://localhost:8000/openapi.json>

## Chạy độc lập bằng mock

```bash
npm run dev:mock
```

Mock là opt-in và UI luôn hiển thị `Bản demo giả lập`. Không dùng chế độ này để nghiệm thu tích hợp
hoặc production.

## Docker mock preview

Docker trong repo FE chỉ là bản preview độc lập, không phải runtime production:

```bash
docker compose -f docker-compose.preview.yml up --build
```

Mở `http://localhost:8081`. Production Week 1 phải do FastAPI phục vụ UI và API cùng origin trên
cổng `8000`; việc đưa React build vào repo Backend cần một OpenSpec change riêng phía Backend.

## Kiểm tra

```bash
npm run check
npm run test:e2e
```

Khi Backend thật đang chạy ở cổng `8000`:

```bash
npm run test:e2e:integration
```

`test:e2e` dùng mock đúng contract; `test:e2e:integration` không bật mock và gọi Backend qua Vite
proxy.
