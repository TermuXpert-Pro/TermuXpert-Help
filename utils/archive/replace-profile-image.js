#!/usr/bin/env node
/**
 * replace-profile-image.js
 * ============================================================
 * كيبدّل كل مراجع assets/images/profile.png بـ profile.webp
 * فكل صفحات HTML بالموقع (بأي عمق مسار كان).
 *
 * الاستعمال:
 *   node utils/replace-profile-image.js            # معاينة (dry-run)
 *   node utils/replace-profile-image.js --apply    # تطبيق فعلي
 * ============================================================
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const APPLY = process.argv.includes('--apply');
const EXCLUDE_DIRS = new Set(['node_modules', '.git']);

const OLD_NAME = 'profile.png';
const NEW_NAME = 'profile.webp';

function findHtmlFiles(dir, fileList = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (EXCLUDE_DIRS.has(entry.name)) continue;
            findHtmlFiles(fullPath, fileList);
        } else if (entry.isFile() && entry.name.endsWith('.html')) {
            fileList.push(fullPath);
        }
    }
    return fileList;
}

function main() {
    console.log('🔍 كنفتشو على ملفات HTML...\n');

    const newImagePath = path.join(ROOT, 'assets/images', NEW_NAME);
    if (!fs.existsSync(newImagePath)) {
        console.log(`❌ الملف assets/images/${NEW_NAME} ماكاينش. تأكد بلي حولتي الصورة وحطيتيها فمكانها قبل ما تشغل هاد السكريبت.`);
        process.exit(1);
    }

    const htmlFiles = findHtmlFiles(ROOT);
    console.log(`✅ لقيت ${htmlFiles.length} ملف HTML\n`);

    // regex: كيبدل profile.png بـ profile.webp فـ src, href, أو أي مسار فيه
    const regex = new RegExp(OLD_NAME.replace('.', '\\.'), 'g');

    let filesChanged = 0;
    let totalChanges = 0;

    for (const file of htmlFiles) {
        const original = fs.readFileSync(file, 'utf8');
        const matches = original.match(regex);

        if (matches) {
            const updated = original.replace(regex, NEW_NAME);
            const relFile = path.relative(ROOT, file);
            console.log(`📄 ${relFile} → ${matches.length} تبديل`);
            filesChanged++;
            totalChanges += matches.length;
            if (APPLY) {
                fs.writeFileSync(file, updated, 'utf8');
            }
        }
    }

    console.log('\n============================================================');
    console.log(`📊 الملخص: ${filesChanged} ملف، ${totalChanges} تبديل مجموعي`);

    if (!APPLY) {
        console.log('\n⚠️  هادي كانت معاينة فقط. شغّل بـ --apply باش يتبدلو الملفات فعليا:');
        console.log('   node utils/replace-profile-image.js --apply');
    } else {
        console.log('\n✅ التبديل تم فعليا فكل الملفات.');
        console.log('⚠️  تذكر: تقدر تحذف assets/images/profile.png القديمة يدويا بعد ما تتأكد بلي كلشي خدام مزيان.');
    }
    console.log('============================================================');
}

main();
