# คำสั่งสำหรับ Claude Code: แก้ไขปัญหา Import ทั้งหมด

## งานที่ต้องทำ

ตรวจสอบและแก้ไขปัญหา import ทั้งหมดในโปรเจค React + Vite นี้ โดยเฉพาะปัญหา:
1. Case sensitivity ของชื่อไฟล์ (เช่น `navbar` vs `Navbar`)
2. Path ที่ไม่ถูกต้อง
3. ไฟล์ที่หายหรือชื่อไม่ตรงกัน

## ขั้นตอนการทำงาน

### 1. สแกนหาไฟล์ทั้งหมดที่มีการ import
```bash
# ค้นหาไฟล์ .jsx และ .js ทั้งหมด
find src -type f \( -name "*.jsx" -o -name "*.js" \) -exec echo "=== {} ===" \; -exec cat {} \;
```

### 2. สำหรับแต่ละไฟล์ที่พบ ให้:

#### a) ตรวจสอบทุก import statement
- ดูว่า import path ถูกต้องหรือไม่
- ตรวจสอบว่าใช้ relative path (`./`, `../`) หรือ alias path (`@/`)

#### b) ตรวจสอบว่าไฟล์ที่ถูก import มีอยู่จริง
- เช็คชื่อไฟล์ว่าตรงกับที่ระบุใน import หรือไม่
- ระวัง case sensitivity (ตัวพิมพ์เล็ก-ใหญ่)

#### c) แก้ไขปัญหาที่พบ
- แก้ชื่อไฟล์ให้ตรงกัน
- แก้ path ให้ถูกต้อง
- เพิ่มนามสกุล `.jsx` หรือ `.js` ถ้าจำเป็น

### 3. ตัวอย่างปัญหาที่พบบ่อย

#### ❌ ผิด:
```javascript
import NavbarLogo from "./navbar/NavbarLogo"  // ไฟล์จริงอาจเป็น Navbar/NavbarLogo
```

#### ✅ ถูก:
```javascript
import NavbarLogo from "./Navbar/NavbarLogo"  // ตัว N ใหญ่
// หรือ
import NavbarLogo from "./Navbar/NavbarLogo.jsx"  // ระบุนามสกุล
```

### 4. ไฟล์ที่ต้องเช็คเป็นพิเศษ

ตรวจสอบไฟล์เหล่านี้อย่างละเอียด:
- `src/components/Navbar.jsx` - ปัญหา: `./navbar/NavbarLogo`
- `src/components/Admin_components/ui/` - ทุกไฟล์
- `src/components/Admin_components/Layout/Layout.jsx`
- ไฟล์อื่นๆ ที่มี import statement

### 5. หลังแก้ไขเสร็จ

#### ลบและเพิ่ม Git tracking ใหม่:
```bash
git rm -r --cached .
git add .
git status  # ตรวจสอบไฟล์ที่จะ commit
git commit -m "Fix all import paths and case sensitivity issues"
```

### 6. รายงานผล

สร้างรายงานสรุป:
- จำนวนไฟล์ที่แก้ไข
- รายการปัญหาที่พบและวิธีแก้
- ไฟล์ที่ยังมีปัญหา (ถ้ามี)

## กฎสำคัญ

1. **เช็คชื่อไฟล์จริงก่อนแก้** - ใช้ `ls` หรือ `dir` เช็คชื่อไฟล์จริง
2. **Case sensitivity สำคัญมาก** - `Navbar` ≠ `navbar` บน Linux/Vercel
3. **ตรวจสอบทุก import** - ไม่มีข้อยกเว้น
4. **ทดสอบ build local** - รัน `npm run build` หลังแก้เสร็จ

## ตัวอย่างการแก้ไข

### ไฟล์: src/components/Navbar.jsx
```javascript
// ก่อนแก้
import NavbarLogo from "./navbar/NavbarLogo"

// หลังแก้ (ต้องเช็คชื่อ folder จริงก่อน)
import NavbarLogo from "./Navbar/NavbarLogo"
// หรือ ถ้าเป็น alias
import NavbarLogo from "@/components/Navbar/NavbarLogo"
```

## เริ่มทำงาน

เริ่มจากไฟล์ที่มีปัญหา:
1. `src/components/Navbar.jsx` → แก้ `./navbar/NavbarLogo`
2. สแกนหาปัญหาอื่นๆ ในโฟลเดอร์ `src/`
3. แก้ไขทีละไฟล์อย่างละเอียด
4. ทดสอบ build

**เริ่มทำงานเลย! ตรวจทุกไฟล์ทุก path ให้หมด**
