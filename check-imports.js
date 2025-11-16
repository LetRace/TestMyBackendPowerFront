/**
 * Script สำหรับตรวจสอบปัญหา import ในโปรเจค
 * วิธีใช้: node check-imports.js
 */

const fs = require('fs');
const path = require('path');

const issues = [];
const srcDir = path.join(__dirname, 'src');

// ฟังก์ชันหาไฟล์ทั้งหมด
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules' && !file.startsWith('.')) {
        arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
      }
    } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.tsx') || file.endsWith('.ts')) {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

// ฟังก์ชันตรวจสอบ import
function checkImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    // หา import statements
    const importMatch = line.match(/import\s+.*?\s+from\s+['"](.*?)['"]/);
    if (importMatch) {
      const importPath = importMatch[1];
      
      // ข้าม external packages
      if (!importPath.startsWith('.') && !importPath.startsWith('@/')) {
        return;
      }

      let resolvedPath;
      if (importPath.startsWith('@/')) {
        // Alias path
        resolvedPath = path.join(srcDir, importPath.replace('@/', ''));
      } else {
        // Relative path
        const dir = path.dirname(filePath);
        resolvedPath = path.join(dir, importPath);
      }

      // ลองหาไฟล์
      const possibleExtensions = ['', '.js', '.jsx', '.ts', '.tsx', '/index.js', '/index.jsx'];
      let found = false;

      for (const ext of possibleExtensions) {
        const fullPath = resolvedPath + ext;
        if (fs.existsSync(fullPath)) {
          found = true;
          
          // เช็ค case sensitivity
          const actualPath = fs.realpathSync.native(fullPath);
          const expectedPath = path.resolve(fullPath);
          
          if (actualPath !== expectedPath) {
            issues.push({
              type: 'CASE_SENSITIVITY',
              file: filePath,
              line: index + 1,
              import: importPath,
              expected: actualPath,
              message: `ชื่อไฟล์ไม่ตรงกัน (case sensitivity): expected ${path.basename(actualPath)} but got ${path.basename(expectedPath)}`
            });
          }
          break;
        }
      }

      if (!found) {
        issues.push({
          type: 'FILE_NOT_FOUND',
          file: filePath,
          line: index + 1,
          import: importPath,
          message: `ไม่พบไฟล์: ${importPath}`
        });
      }
    }
  });
}

// รันการตรวจสอบ
console.log('🔍 กำลังตรวจสอบไฟล์...\n');

try {
  const allFiles = getAllFiles(srcDir);
  console.log(`พบไฟล์ทั้งหมด: ${allFiles.length} ไฟล์\n`);

  allFiles.forEach(file => {
    checkImports(file);
  });

  if (issues.length === 0) {
    console.log('✅ ไม่พบปัญหา! ทุกอย่างเรียบร้อย');
  } else {
    console.log(`❌ พบปัญหา ${issues.length} รายการ:\n`);
    
    issues.forEach((issue, index) => {
      console.log(`${index + 1}. [${issue.type}]`);
      console.log(`   ไฟล์: ${issue.file}`);
      console.log(`   บรรทัด: ${issue.line}`);
      console.log(`   Import: ${issue.import}`);
      console.log(`   ปัญหา: ${issue.message}`);
      if (issue.expected) {
        console.log(`   แนะนำ: ${issue.expected}`);
      }
      console.log('');
    });

    // สรุปตามประเภท
    const summary = issues.reduce((acc, issue) => {
      acc[issue.type] = (acc[issue.type] || 0) + 1;
      return acc;
    }, {});

    console.log('\n📊 สรุป:');
    Object.entries(summary).forEach(([type, count]) => {
      console.log(`   ${type}: ${count} รายการ`);
    });

    // เขียนผลลัพธ์ลงไฟล์
    fs.writeFileSync(
      'import-issues.json',
      JSON.stringify(issues, null, 2)
    );
    console.log('\n💾 บันทึกรายละเอียดไว้ที่: import-issues.json');
  }
} catch (error) {
  console.error('❌ เกิดข้อผิดพลาด:', error.message);
  process.exit(1);
}
