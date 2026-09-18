# Cipher Workbench Backend Handoff — Retired Draft

Tài liệu contract do FE tự đề xuất trước đây đã được ngừng sử dụng vì không còn khớp
Backend contract cho Caesar, Vigenère và Playfair đã accepted.

Nguồn tích hợp hiện tại:

- Tóm tắt và phiên bản ghim phía FE: [`../docs/BACKEND_CONTRACT.md`](../docs/BACKEND_CONTRACT.md)
- Handoff Backend tại guide commit `82c09f4`:
  <https://github.com/kiendt2312/caesar-cipher-be/blob/82c09f45c9c9c860850556de94c822554062dfc9/repo_docs/frontend-integration.md>
- OpenSpec trong repo Backend là nguồn có thẩm quyền cao nhất.

Không bổ sung API contract mới vào file này. Mọi behavior/API change phải được accepted ở
OpenSpec Backend trước, sau đó mới cập nhật reference phía FE.
