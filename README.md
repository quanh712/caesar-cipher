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

## Docker production

Production chạy FE/Nginx và FastAPI trong hai container, cùng origin qua Nginx:

```bash
cp .env.deploy.example .env.deploy
docker compose --env-file .env.deploy up -d --build
```

Mặc định ứng dụng chỉ bind tại `http://127.0.0.1:8080`; Backend không công khai
cổng `8000`. Hướng dẫn VPS, HTTPS, rate limit, kiểm tra và rollback nằm tại
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## Docker mock preview

Docker trong repo FE chỉ là bản preview độc lập, không phải runtime production:

```bash
docker compose -f docker-compose.preview.yml up --build
```

Mở `http://localhost:8081`. Preview luôn dùng mock và không được dùng để nghiệm
thu tích hợp hoặc triển khai production.

## Kiểm tra

```bash
npm run check
npm run test:e2e
```

Khi Backend thật đang chạy ở cổng `8000`:

```bash
npm run test:e2e:integration
```

Khi production Compose stack đang chạy tại `127.0.0.1:8080`:

```bash
npm run test:e2e:production
```

`test:e2e` dùng mock đúng contract; `test:e2e:integration` không bật mock và gọi Backend qua Vite
proxy.
