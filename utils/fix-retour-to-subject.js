#!/usr/bin/env node
/* ============================================================
   utils/fix-retour-to-subject.js
   -----------------------------------------------------------
   الهدف:
   زر "Retour" (class="back-btn") اللي كاين فوق كل صفحة دروس/تمارين/
   سلاسل (بحال ماكانت صفحة محتوى partN/exerciceN/serieN، ولا صفحة
   الـmodel index.html) كان كيوجّه لصفحة وسطية (index.html ديال
   الـmodel، أو ../index.html ديال الموضوع)، يعني خاصك تدوس عليه
   بزوج ولا تلاتة مرات باش توصل للمادة (subject.html).

   هاد السكريبت كيبدل هاد الزر باش يوجّه **مباشرة** لصفحة المادة
   (subject.html?subject=math/physique/chimie فالجذر ديال الموقع)،
   بضغطة واحدة، من أي صفحة كانت (content أو index ديال الـmodel).

   ⚠️ ما كيمسش:
     - أزرار prev-btn/next-btn ديال التنقل بين الأجزاء (part1↔part2،
       exercice1↔exercice2، serie1↔serie2...) -- هادو class مختلف
       (prev-btn/next-btn) وخدامين مزيان بحالهم، التنقل التسلسلي
       خاصو يبقى كيفما هو.
     - صفحات devoirs و base (ماشي داخلين فالطلب).

   الاستعمال:
     node utils/fix-retour-to-subject.js            -> Dry-run
     node utils/fix-retour-to-subject.js --apply     -> يطبق فعلياً
     node utils/fix-retour-to-subject.js --apply --verbose
   ============================================================ */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const APPLY = process.argv.includes('--apply');
const VERBOSE = process.argv.includes('--verbose');

// غير هاد التلاتة فولدرات (بحال ما طلب المستخدم بالضبط)
const SCOPE_CATEGORIES = ['lessons', 'exercises', 'series'];

const BACK_BTN_RE = /<a href="([^"]*)" class="back-btn"><i class="fas fa-arrow-right"><\/i> ([^<]*)<\/a>/g;

/* ---------------------------------------------------------
   1) البحث على الملفات المعنية فقط (lessons/exercises/series)
--------------------------------------------------------- */
function walk(dir, out) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(full, out);
        } else if (entry.isFile() && entry.name.endsWith('.html')) {
            out.push(full);
        }
    }
    return out;
}

function collectTargetFiles() {
    const files = [];
    if (!fs.existsSync(CONTENT_DIR)) return files;
    for (const subject of fs.readdirSync(CONTENT_DIR, { withFileTypes: true })) {
        if (!subject.isDirectory()) continue;
        for (const category of SCOPE_CATEGORIES) {
            const dir = path.join(CONTENT_DIR, subject.name, category);
            if (fs.existsSync(dir)) walk(dir, files);
        }
    }
    return files;
}

/* ---------------------------------------------------------
   2) حساب الرابط الصحيح لـ subject.html من أي ملف
--------------------------------------------------------- */
function computeSubjectHref(file) {
    const relFromContent = path.relative(CONTENT_DIR, file); // مثال: math/exercises/barycentre/model1/exercice1.html
    const subject = relFromContent.split(path.sep)[0];
    const relDepth = path.relative(path.dirname(file), ROOT).split(path.sep).join('/');
    return `${relDepth}/subject.html?subject=${subject}`;
}

/* ---------------------------------------------------------
   3) معالجة ملف واحد
--------------------------------------------------------- */
function processFile(file, stats) {
    const original = fs.readFileSync(file, 'utf8');
    if (!original.includes('class="back-btn"')) {
        stats.skippedNoButton++;
        return;
    }

    const correctHref = computeSubjectHref(file);
    let fileChanged = false;

    const updated = original.replace(BACK_BTN_RE, (match, currentHref, currentText) => {
        if (currentHref === correctHref) return match; // خدام مزيان من قبل
        fileChanged = true;
        return `<a href="${correctHref}" class="back-btn"><i class="fas fa-arrow-right"></i> Retour</a>`;
    });

    if (!fileChanged) {
        stats.alreadyOk++;
        return;
    }

    if (APPLY) {
        fs.writeFileSync(file, updated, 'utf8');
    }
    stats.fixed++;
    if (VERBOSE) {
        console.log('  ' + (APPLY ? '✔ تم التصحيح' : '→ سيتم التصحيح') + ':', path.relative(ROOT, file), '->', correctHref);
    }
}

/* ---------------------------------------------------------
   4) main
--------------------------------------------------------- */
function main() {
    const files = collectTargetFiles();
    const stats = { fixed: 0, alreadyOk: 0, skippedNoButton: 0 };

    console.log('========================================');
    console.log(APPLY ? '🔧 تطبيق تصحيح زر Retour نحو subject.html' : '🔍 Dry-run: فحص زر Retour نحو subject.html');
    console.log('========================================');
    console.log('عدد ملفات .html تحت lessons/exercises/series:', files.length);
    console.log('');

    for (const file of files) {
        processFile(file, stats);
    }

    console.log('');
    console.log('----------------------------------------');
    console.log('✅ ملفات ' + (APPLY ? 'تم تصحيحها' : 'غادي يتصححو') + ':', stats.fixed);
    console.log('✔️  ملفات كانت صحيحة من قبل:', stats.alreadyOk);
    console.log('⏭️  ملفات بلا زر Retour (تجوهات):', stats.skippedNoButton);
    console.log('----------------------------------------');
    if (!APPLY) {
        console.log('ملاحظة: هادي Dry-run فقط، ما تبدل حتى ملف.');
        console.log('باش تطبق فعلياً: node utils/fix-retour-to-subject.js --apply');
    }
}

main();
