# 🚀 دليل رفع الملفات إلى InfinityFree

## ⚠️ ملاحظة مهمة عن InfinityFree:
استضافة InfinityFree **لا تدعم** `.htaccess` بشكل كامل، لذلك:
- ✅ CSP يعمل من `<meta>` tag في HTML فقط
- ❌ `.htaccess` لن يطبق CSP (يمكنك رفعه للتخزين المؤقت فقط)

---

## 📋 الملفات التي يجب رفعها:

### ✅ **إلزامي (يجب رفعها):**
1. **`index.html`** - يحتوي على CSP المُحدّث
2. **`manifest.json`** - تم إصلاح خطأ Syntax
3. **`script.js`** - يحتوي على دالة `safeBtoa()`

### 📄 **اختياري:**
4. `.htaccess` - للتخزين المؤقت فقط (لن يطبق CSP)

---

## 🔧 خطوات الرفع إلى InfinityFree:

### **الطريقة 1: File Manager (الأسهل)**

#### **الخطوات:**

1. **سجّل الدخول إلى Control Panel:**
   - اذهب إلى: `https://app.infinityfree.com/`
   - سجّل الدخول بحسابك

2. **افتح File Manager:**
   - من لوحة التحكم، اضغط على **"File Manager"**
   - أو اذهب مباشرة إلى: `https://filemanager.ai/new/#/c/`

3. **انتقل إلى مجلد الموقع:**
   - افتح مجلد: **`htdocs/`**
   - هذا هو المجلد الرئيسي للموقع

4. **احذف الملفات القديمة** (مهم جداً):
   - ✓ احذف `index.html` القديم
   - ✓ احذف `manifest.json` القديم
   - ✓ احذف `script.js` القديم

5. **ارفع الملفات الجديدة:**
   - اضغط على زر **"Upload"** أو **"رفع"**
   - اختر الملفات من:
     ```
     c:\Users\lenovo\Desktop\Wesaad\
     ```
   - ارفع:
     - ✓ `index.html`
     - ✓ `manifest.json`
     - ✓ `script.js`

6. **تحقق من الرفع:**
   - تأكد من ظهور الملفات في القائمة
   - تحقق من تاريخ التعديل (يجب أن يكون اليوم)

---

### **الطريقة 2: FTP (للمتقدمين)**

#### **معلومات الاتصال:**
```
Host: ftpupload.net
Port: 21
Username: [اسم المستخدم من InfinityFree]
Password: [كلمة المرور من InfinityFree]
```

#### **الخطوات:**
1. افتح FileZilla أو WinSCP
2. اتصل بالخادم باستخدام المعلومات أعلاه
3. انتقل إلى مجلد `htdocs/`
4. احذف الملفات القديمة
5. ارفع الملفات الجديدة

---

## ✅ التحقق من نجاح الرفع:

### **الخطوة 1: مسح الكاش**

**مهم جداً!** InfinityFree يستخدم كاش قوي:

1. **كاش المتصفح:**
   ```
   - اضغط: Ctrl + Shift + Delete
   - احذف: Cached images and files
   - أو افتح في Incognito: Ctrl + Shift + N
   ```

2. **كاش Cloudflare** (إذا كنت تستخدمه):
   - اذهب إلى Cloudflare Dashboard
   - Caching → Purge Everything

3. **انتظر 2-5 دقائق:**
   - InfinityFree قد يحتاج وقت لتحديث الملفات

---

### **الخطوة 2: اختبر الموقع**

1. **افتح الموقع:**
   ```
   https://wesad.kesug.com/
   ```

2. **افتح DevTools:**
   ```
   اضغط F12
   ```

3. **تحقق من Console:**
   - ✅ **يجب ألا ترى:**
     - ❌ CSP directive violated
     - ❌ InvalidCharacterError
     - ❌ Manifest syntax error
     - ❌ Bootstrap CSS map blocked

   - ✅ **يجب أن ترى:**
     - ✓ Service Worker registered
     - ✓ Google Analytics loaded
     - ✓ No errors!

4. **اختبر صفحة الاختبار:**
   ```
   https://wesad.kesug.com/test-fixes.html
   ```
   - جميع الاختبارات يجب أن تكون خضراء ✅

---

## 🔍 استكشاف الأخطاء (InfinityFree):

### **المشكلة 1: الأخطاء لا تزال موجودة**

**الحلول:**
1. ✅ **امسح الكاش بالكامل:**
   ```
   Ctrl + Shift + Delete → Clear everything
   ```

2. ✅ **جرّب Incognito Mode:**
   ```
   Ctrl + Shift + N
   ```

3. ✅ **انتظر 5 دقائق:**
   - InfinityFree يحتاج وقت لتحديث الملفات

4. ✅ **تحقق من رفع الملفات:**
   - افتح File Manager
   - تأكد من أن الملفات الجديدة موجودة
   - تحقق من تاريخ التعديل

---

### **المشكلة 2: manifest.json لا يزال به خطأ**

**الحل:**
1. احذف `manifest.json` القديم من الخادم **تماماً**
2. ارفع `manifest.json` الجديد
3. امسح الكاش
4. أعد تحميل الصفحة

---

### **المشكلة 3: CSP لا يزال يحظر Google Analytics**

**الحل:**
1. تأكد من رفع `index.html` الجديد
2. افتح `index.html` على الخادم وتحقق من وجود:
   ```html
   <meta http-equiv="Content-Security-Policy" content="...">
   ```
3. تأكد من أن CSP يحتوي على:
   ```
   https://www.googletagmanager.com
   https://www.google-analytics.com
   ```

---

## 📊 قائمة التحقق النهائية:

قبل أن تعتبر العمل منتهياً، تحقق من:

- [ ] رفعت `index.html` الجديد
- [ ] رفعت `manifest.json` الجديد
- [ ] رفعت `script.js` الجديد
- [ ] حذفت الملفات القديمة
- [ ] مسحت كاش المتصفح
- [ ] انتظرت 2-5 دقائق
- [ ] فتحت الموقع في Incognito
- [ ] لا توجد أخطاء في Console ✅

---

## 🎯 ملخص سريع:

```bash
# الملفات التي يجب رفعها إلى htdocs/:
✓ index.html     (CSP محدّث)
✓ manifest.json  (بدون أخطاء)
✓ script.js      (safeBtoa محدّث)

# بعد الرفع:
1. امسح الكاش (Ctrl + Shift + Delete)
2. انتظر 2-5 دقائق
3. افتح في Incognito (Ctrl + Shift + N)
4. تحقق من Console (F12)
5. يجب ألا ترى أي أخطاء! ✅
```

---

## 📞 ملاحظات مهمة عن InfinityFree:

1. **الكاش قوي جداً:**
   - قد تحتاج الانتظار 5-10 دقائق لرؤية التغييرات
   - استخدم Incognito mode دائماً للاختبار

2. **`.htaccess` محدود:**
   - CSP لن يعمل من `.htaccess`
   - استخدم `<meta>` tag في HTML فقط

3. **الأذونات:**
   - عادةً تكون صحيحة تلقائياً
   - إذا واجهت مشاكل، اجعلها `644`

4. **المجلد الصحيح:**
   - **`htdocs/`** هو المجلد الرئيسي
   - ليس `public_html/` أو `www/`

---

**آخر تحديث:** 2026-02-12
**الاستضافة:** InfinityFree
**الحالة:** جاهز للرفع ✅
