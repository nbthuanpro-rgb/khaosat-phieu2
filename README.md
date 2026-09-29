# Phiếu khảo sát số 01 – An toàn thực phẩm

**UBND phường Thành Nhất – Tỉnh Đắk Lắk**  
Dành cho cán bộ, công chức, viên chức trên địa bàn phường.

## Nội dung
Form khảo sát đúng theo file Word "Phieu_khao_sat so 1 CBCC.docx":
- Phần A: Thông tin chung (4 câu)
- Phần B: 15 câu hỏi khảo sát

## Chạy local
```bash
npm install
npm run dev
```
Mở http://localhost:5173

## Cấu hình lưu dữ liệu (Supabase)
1. Tạo project tại https://supabase.com
2. Tạo table `khao_sat_phieu1`
3. Sửa 2 dòng trong `src/App.jsx`:
```js
const SUPABASE_URL = 'https://xxxx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJ...'
```

## Deploy Vercel
Push lên GitHub → Import vào vercel.com → có link riêng.
