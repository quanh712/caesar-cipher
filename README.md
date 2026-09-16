# Cipher Workbench

Frontend MVP cho công cụ mã hóa và giải mã Caesar Cipher theo scope Week 1.

Đặc tả chức năng, acceptance criteria, API contract và Definition of Done nằm tại [`docs/PROJECT_SPEC.md`](docs/PROJECT_SPEC.md).

Tài liệu bàn giao contract cho Backend nằm tại [`repo_docs/BACKEND_HANDOFF.md`](repo_docs/BACKEND_HANDOFF.md).

## Khởi chạy

```bash
npm install
npm run dev
```

Sao chép `.env.example` thành `.env` khi cần thay đổi API URL hoặc chuyển giữa mock API và backend thật.

Brand hiển thị là `Cipher Workbench`. Production domain dự kiến là `https://cipherworkbench.com`, hiện
đang chờ đăng ký và cấu hình DNS.

## Cấu trúc

```text
src/
├── app/                         # App shell và style toàn cục
├── features/caesar/             # Toàn bộ nghiệp vụ Caesar Cipher
│   ├── components/              # Các khối giao diện theo scope
│   ├── hooks/                   # State và luồng xử lý màn hình
│   ├── services/                # Kết nối API/mock API
│   ├── types/                   # TypeScript contracts
│   └── utils/                   # Validation và thuật toán hỗ trợ
└── shared/components/           # Component dùng chung giữa nhiều feature
```

## API contract

- `POST /api/caesar/encrypt` với `{ text, key }`
- `POST /api/caesar/decrypt` với `{ text, key }`
- `POST /api/caesar/file` với multipart fields `file`, `key`, `action`

Response mong đợi: `{ success: boolean, result?: string, message?: string }`.

## Docker

```bash
docker compose up --build
```

Ứng dụng chạy tại `http://localhost:8081`, health check tại `http://localhost:8081/health`.

Production dự kiến phục vụ FE và BE cùng origin:

```text
https://cipherworkbench.com
https://cipherworkbench.com/api/...
```

Sử dụng `.env.production.example` làm mẫu build production:

```bash
cp .env.production.example .env.production
docker compose --env-file .env.production up --build -d
```

Nginx hiện chưa proxy `/api` vì Backend chưa cung cấp upstream URL hoặc Docker service name. Lệnh
trên chỉ là cấu hình build FE; chỉ bật API thật sau khi reverse proxy đã được cấu hình.

## Kiểm tra chất lượng

```bash
npm run check
npm run test:e2e
```

`check` chạy format check, ESLint, TypeScript, unit/component tests và production build. `test:e2e` chạy Playwright trên desktop và mobile viewport.
