# DXF Toolkit — Xem & đo bản vẽ CAD trên trình duyệt

Webtool xem bản vẽ DXF, đo khoảng cách/diện tích, vẽ polygon, tô hatch, đọc tọa độ.
Chạy 100% phía client — bản vẽ không rời khỏi máy.

## Chạy dự án
```bash
npm install
npm run dev      # mở http://localhost:5173
npm run build    # kiểm tra type + build production
```

## Bản vẽ DWG?
Có 2 cách:
1. **Đọc trực tiếp (thử nghiệm)** — kéo thả thẳng file .dwg vào tool. Dùng LibreDWG
   (WASM, mã nguồn mở) tải qua CDN khi mở lần đầu (cần Internet lúc đó), convert
   DWG → DXF ngay trong bộ nhớ trình duyệt rồi hiển thị. Bản vẽ không gửi đi đâu,
   chỉ có mã nguồn công cụ đọc được tải về. **Độ tin cậy: beta** — một số đối
   tượng CAD đặc biệt (custom/proxy object của Civil 3D...) có thể không đọc
   được; nếu dùng để đo đạc/lập hồ sơ chính thức hãy đối chiếu bằng cách 2.
2. **Convert trước (đáng tin cậy nhất)** — dùng **ODA File Converter** (miễn phí)
   convert DWG → **DXF 2018 ASCII**, rồi mở file DXF trong tool.

## Trạng thái: GIAI ĐOẠN 0–5 HOÀN THÀNH ✅
Tính năng: mở DXF (kéo thả), render đầy đủ entity (line/polyline+bulge/arc/circle/
ellipse/spline/text/mtext/block lồng nhau), bật tắt layer, pan/zoom, snap đỉnh &
trung điểm, ghim tọa độ + copy, đo khoảng cách, đo diện tích (m²/ha), vẽ polygon,
tô hatch 4 kiểu, cung tròn 3 điểm (R), đường cong spline qua điểm (S), ghi kích
thước kiểu AutoCAD với đường gióng + mũi tên + chữ xoay theo phương đo (K),
xuất CSV (Excel VN) + JSON + KML, nhập lại JSON, phím tắt V/H/C/D/A/P/R/S/K/B.

KML/KMZ (Google Earth): mở chồng lên bản vẽ với phép chiếu VN2000 (chọn kinh tuyến
trục theo tỉnh, múi 3° k=0.9999, 7 tham số EPSG) hoặc UTM 48N/49N; xuất kết quả
đo vẽ ngược ra file .kml để mở trong Google Earth. Mã nguồn: src/core/crs.ts,
src/core/kml-loader.ts, src/ui/CrsModal.tsx.

Bản dùng ngay không cần cài đặt: chạy `npm run build:single` -> `dist-single/index.html`
(một file duy nhất, nháy đúp mở bằng Chrome/Edge).

Đã cài sẵn nền tảng cho các giai đoạn sau:
- `src/core/types.ts` — **interface chuẩn, không sửa** (hợp đồng giữa các giai đoạn)
- `src/core/viewport.ts` — chuyển đổi world/screen (đã xử lý đảo trục Y) ✅
- `src/core/geometry.ts` — Shoelace, chu vi, trọng tâm, tessellate arc, **bulge**, point-in-polygon ✅
- `dxf-parser` đã có trong package.json

## Việc tiếp theo (xem docs/KE-HOACH.md để lấy prompt mẫu cho từng giai đoạn)
| GĐ | Việc | File cần viết |
|----|------|---------------|
| 1 | Parse + render DXF, layer | `core/dxf-loader.ts`, `render/renderer.ts` |
| 2 | Snap đỉnh/trung điểm, ghim tọa độ | `core/snap.ts`, tool `coordinate` |
| 3 | Đo khoảng cách, diện tích | `tools/measure-*.ts`, `render/overlay.ts` |
| 4 | Vẽ polygon, hatch | `tools/draw-polygon.ts`, `tools/hatch.ts` |
| 5 | Xuất JSON/CSV/DXF | mới |
| 6 | Hiệu năng file lớn, phím tắt, deploy | tối ưu |

## Quy ước quan trọng khi giao việc cho AI
1. Luôn đính kèm `src/core/types.ts` + phần Quy ước chung trong docs/KE-HOACH.md.
2. Mọi chuyển đổi tọa độ đi qua `ViewportImpl` — không tự nhân ma trận nơi khác.
3. Mọi phép đo tính trên tọa độ **world**, không tính trên pixel màn hình.
