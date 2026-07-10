# bms-fe — BMS Admin Frontend (Angular 18)

หน้าบ้านระบบ admin ของ B.M. Service — คู่กับ backend ที่ https://github.com/mkongthong-work/bms-be

```bash
npm install
npm start        # ng serve + proxy /api -> localhost:8080 (รัน bms-be ก่อน)
npm run build
```

โครงสร้าง: standalone components + signals ทั้งหมด
- `core/auth` — JWT interceptor, guard, service (token ใน sessionStorage)
- `features/login` `features/products` `features/quotations` — โมดูลเริ่มต้น
- `src/styles.css` — design tokens โทนแบรนด์ (ครีม #f7f5f2 / น้ำเงิน #2b4d99 / แดง accent)
- ทุก input/ปุ่มมี `data-testid` สำหรับ automated test
