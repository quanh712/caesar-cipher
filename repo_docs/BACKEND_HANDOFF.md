# Cipher Workbench — Backend Handoff

## API contract

Tài liệu contract do FE tự đề xuất trước đây đã được ngừng sử dụng vì không còn khớp
Backend contract cho Caesar, Vigenère và Playfair đã accepted.

Nguồn tích hợp hiện tại:

- Tóm tắt và phiên bản ghim phía FE: [`../docs/BACKEND_CONTRACT.md`](../docs/BACKEND_CONTRACT.md)
- Handoff Backend tại guide commit `82c09f4`:
  <https://github.com/kiendt2312/caesar-cipher-be/blob/82c09f45c9c9c860850556de94c822554062dfc9/repo_docs/frontend-integration.md>
- OpenSpec trong repo Backend là nguồn có thẩm quyền cao nhất.

Không bổ sung API contract mới vào file này. Mọi behavior/API change phải được accepted ở
OpenSpec Backend trước, sau đó mới cập nhật reference phía FE.

## Runtime/deployment handoff

Cập nhật ngày `2026-09-18`: Docker Compose production do repo FE quản lý và chạy cả
hai service trong cùng Docker network:

```text
Máy trong LAN
  │ http://<server-lan-ip>:8080
  ▼
frontend (Nginx) 0.0.0.0:8080
  ├── /, /assets/*, SPA fallback → React dist
  └── /api/*, /docs, /openapi.json
                         │ proxy nội bộ
                         ▼
                    backend:8000
```

Các boundary BE cần giữ:

- Backend chỉ expose cổng `8000` trong Docker network, không publish cổng này ra host/LAN.
- Frontend gọi API bằng đường dẫn same-origin tương đối `/api/...`; không cần bật CORS.
- Nginx container chuyển tiếp `/api/*`, `/docs` và `/openapi.json` tới
  `http://backend:8000`.
- Health check của Compose hiện gọi `http://127.0.0.1:8000/openapi.json` bên trong
  container BE. Chỉ đổi sang `/health` sau khi endpoint đó được accepted trong contract.
- BE phải tiếp tục lắng nghe `0.0.0.0:8000` **bên trong container** để Nginx FE truy cập
  được. Đây không phải là publish cổng `8000` ra máy host.

### Cấu hình LAN hiện tại

File `.env.deploy` của repo FE đang dùng:

```env
APP_BIND_ADDRESS=0.0.0.0
APP_HTTP_PORT=8080
BACKEND_CONTEXT=../caesar-cipher-be
```

Khởi động hoặc dựng lại toàn bộ stack từ repo FE:

```bash
docker compose down
docker compose --env-file .env.deploy up -d --build
docker compose --env-file .env.deploy ps
```

Trạng thái đã xác minh trên máy triển khai:

- URL LAN: `http://192.168.100.229:8080`
- Frontend: healthy, publish `0.0.0.0:8080->8080/tcp`
- Backend: healthy, chỉ có `8000/tcp` nội bộ
- Smoke test UI, OpenAPI, text API và file API: thành công

IP `192.168.100.229` do DHCP cấp nên có thể thay đổi. Thiết bị truy cập phải cùng
LAN/Wi-Fi; firewall nếu bật chỉ nên cho phép subnet hiện tại:

```bash
sudo ufw allow from 192.168.100.0/24 to any port 8080 proto tcp
```

Không dùng cấu hình LAN này để public trực tiếp lên Internet. Khi triển khai Internet,
đổi lại `APP_BIND_ADDRESS=127.0.0.1` và đặt Nginx/Caddy HTTPS trên host ở phía trước;
chỉ mở cổng `80` và `443`.

Với topology trên, phía BE không cần thay đổi API, CORS hoặc publish port. Nếu BE đổi
cổng, health endpoint, prefix `/api`, giới hạn upload hay response contract thì phải báo
và cập nhật Compose/Nginx cùng tài liệu contract trước khi merge.
