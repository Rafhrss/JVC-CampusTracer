# 🎓 CampusTracer - Sistem Cerdas Lost & Found Kampus

![CampusTracer Banner](https://img.shields.io/badge/CampusTracer-Lost_%26_Found-14b8a6?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![Cloud Run](https://img.shields.io/badge/Deployed_on-Google_Cloud_Run-4285F4?style=for-the-badge&logo=googlecloud)

**CampusTracer** adalah platform pelacakan barang hilang dan ditemukan (*Lost & Found*) revolusioner yang dirancang khusus untuk lingkungan kampus. Menggunakan kekuatan Kecerdasan Buatan (AI) dari Google Gemini, platform ini mampu mencocokkan deskripsi barang yang hilang dengan barang yang ditemukan secara semantik dan cerdas, mematahkan keterbatasan pencarian teks biasa.

🔗 **Akses Website Live:** [https://jvc-campustracer-309091388704.asia-southeast1.run.app/](https://jvc-campustracer-309091388704.asia-southeast1.run.app/)

---

## 🌟 Fungsi & Fitur Utama

1. **Pencarian AI Semantik Cerdas (AI Search Bar)**
   Tidak sekadar mencocokkan kata kunci, pencarian didukung oleh **Google Gemini 2.5 Flash** yang menganalisis konteks dan deskripsi rumit untuk menemukan tingkat kecocokan (Match Percentage) barang secara akurat.
2. **Lapor Cepat (Smart Reporting)**
   Fitur lapor barang hilang atau ditemukan yang ringkas dan dilengkapi dengan unggah foto bukti.
3. **Papan Peringkat "Pahlawan Kampus" (Gamifikasi)**
   Untuk mendorong kejujuran, setiap pengguna yang berhasil mengembalikan barang akan mendapatkan poin apresiasi dan tercatat dalam sistem *Leaderboard* pahlawan bulanan layaknya sistem *Guild Game*.
4. **Keamanan Ekstra & Verifikasi**
   Modul konfirmasi bertingkat untuk memastikan bahwa barang yang diserahkan benar-benar diberikan kepada pemilik asli, guna mencegah manipulasi poin.
5. **Autentikasi Instan**
   Masuk dengan aman menggunakan sistem *Google Sign-In* (ditenagai oleh Supabase).

---

## 💡 Manfaat (Benefits)

* **Bagi Mahasiswa/Kehilangan:** Memberikan ketenangan pikiran dan peluang terbesar untuk menemukan barang berharga mereka kembali dengan cepat tanpa harus berkeliling kampus mencari pos satpam.
* **Bagi Penemu Barang:** Memberikan wadah yang aman dan terstruktur untuk melaporkan temuan, sekaligus mendapatkan apresiasi publik atas kejujuran mereka melalui sistem *Pahlawan Kampus*.
* **Bagi Pihak Kampus:** Membantu mendigitalisasi layanan *Lost & Found* yang biasanya manual dan berantakan menjadi sistem yang rapi, transparan, dan sangat efisien.

---

## 🛠️ Teknologi yang Digunakan (Tech Stack)

Proyek ini dibangun menggunakan teknologi web modern dan infrastruktur *cloud* skala produksi:

* **Frontend:** React 19, TypeScript, Vite
* **Styling & UI:** Tailwind CSS, Lucide Icons, OGL (untuk animasi 3D)
* **Kecerdasan Buatan (AI):** `@google/generative-ai` (Gemini API untuk Embedding & Analisis Teks)
* **Backend, Database, & Auth:** Supabase (PostgreSQL, OAuth)
* **Deployment & Infrastruktur:** Google Cloud Run (Serverless via Buildpacks), Express.js (Runtime Config Injector)

---

## 🚀 Instalasi Lokal (Bagi Pengembang)

Jika Anda ingin menjalankan proyek ini di mesin lokal Anda:

1. Lakukan *clone* repositori ini:
   \`\`\`bash
   git clone https://github.com/Rafhrss/JVC-CampusTracer.git
   \`\`\`
2. Masuk ke direktori proyek dan instal dependensi:
   \`\`\`bash
   cd JVC-CampusTracer
   npm install
   \`\`\`
3. Buat file \`.env\` di direktori *root* dan masukkan kredensial berikut:
   \`\`\`env
   VITE_SUPABASE_URL=URL_SUPABASE_ANDA
   VITE_SUPABASE_ANON_KEY=ANON_KEY_SUPABASE_ANDA
   VITE_GEMINI_API_KEY=API_KEY_GEMINI_ANDA
   \`\`\`
4. Jalankan server pengembangan:
   \`\`\`bash
   npm run dev
   \`\`\`

---
*Dibuat untuk submisi **JuaraVibeCoding (JVC) / JuaraGCP**.*
