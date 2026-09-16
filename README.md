# Caesar Cipher Frontend

Frontend MVP cho công cụ mã hóa và giải mã Caesar Cipher theo scope Week 1.

Đặc tả chức năng, acceptance criteria, API contract và Definition of Done nằm tại [`docs/PROJECT_SPEC.md`](docs/PROJECT_SPEC.md).

## Khởi chạy

```bash
npm install
npm run dev
```

Sao chép `.env.example` thành `.env` khi cần thay đổi API URL hoặc chuyển giữa mock API và backend thật.

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
