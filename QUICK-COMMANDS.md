# Quick Commands - แก้ปัญหา Import เร็วๆ

## 🚀 เริ่มด่วน

### 1. ตรวจสอบปัญหา
```powershell
node check-imports.js
```

### 2. แก้ปัญหาด้วย Claude Code
```powershell
claude-code
# แล้วพิมพ์: อ่าน fix-imports-instruction.md และทำตามทุกขั้นตอน
```

### 3. ทดสอบ Build
```powershell
npm run build
```

### 4. Push ขึ้น Git
```powershell
git rm -r --cached .
git add .
git commit -m "Fix import issues"
git push
```

---

## 🔥 แก้ด่วน - ปัญหาเฉพาะไฟล์

### Navbar.jsx
```powershell
# เช็คชื่อ folder จริง
Get-ChildItem src/components -Directory

# แก้ใน Navbar.jsx:
# เปลี่ยน "./navbar/..." เป็น "./Navbar/..."
```

### Sidebar.jsx
```powershell
# เช็คชื่อไฟล์จริง
Get-ChildItem src/components/Admin_components/ui

# แก้ import ให้ตรงกับชื่อไฟล์จริง (ระวัง S ใหญ่/เล็ก)
```

---

## 📋 Checklist

- [ ] รัน `node check-imports.js`
- [ ] แก้ไขปัญหาทั้งหมด
- [ ] `npm run build` ผ่าน
- [ ] `git rm -r --cached .`
- [ ] `git add .`
- [ ] `git commit`
- [ ] `git push`
- [ ] เช็ค Vercel deployment

---

## 🔍 หาปัญหาเฉพาะจุด

### หา import ทั้งหมดในไฟล์
```powershell
Select-String -Path "src/**/*.jsx" -Pattern "import.*from" -CaseSensitive
```

### หา import ที่มีปัญหา case
```powershell
Select-String -Path "src/**/*.jsx" -Pattern "import.*from ['\"]\..*['\"]" | Select-String -Pattern "[a-z]"
```

### เช็คโครงสร้าง folder
```powershell
tree /F src
```

---

## ⚡ One-Liner Commands

### แก้ปัญหาทั้งหมดในครั้งเดียว
```powershell
node check-imports.js; npm run build; git rm -r --cached .; git add .; git status
```

### เช็คไฟล์ที่จะ commit
```powershell
git status --short
```

### Force push (ระวัง!)
```powershell
git push --force-with-lease
```

---

## 🎯 Target Files - ไฟล์ที่ต้องเช็ค

```
src/components/Navbar.jsx                          → ปัญหา: ./navbar/...
src/components/Admin_components/Layout/Layout.jsx → ปัญหา: Sidebar import
src/components/Admin_components/ui/               → เช็คทั้ง folder
```

---

## 💡 Tips

### เช็คว่า Git track ถูกต้อง
```powershell
git ls-files | Select-String "Sidebar"
git ls-files | Select-String "Navbar"
```

### ดูความแตกต่างก่อน commit
```powershell
git diff --cached --name-only
```

### Rollback ถ้าผิดพลาด
```powershell
git reset --soft HEAD^
```
