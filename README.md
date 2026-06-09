# RuangRasa

**RuangRasa** adalah aplikasi **mental health journal & mood tracker** berbasis web yang membantu pengguna mencatat perasaan harian, menulis jurnal pribadi, melihat pola mood bulanan, dan memahami kondisi emosional secara lebih reflektif.

Aplikasi ini dibuat sebagai project portfolio full-stack menggunakan **Next.js**, **Supabase Auth**, dan **Supabase PostgreSQL**.

> RuangRasa bukan aplikasi diagnosis mental health dan bukan pengganti psikolog, psikiater, atau bantuan medis profesional. Aplikasi ini hanya membantu pengguna mencatat dan memahami pola perasaan pribadi.

---

## ✨ Fitur Utama

* Landing page modern dan responsive
* Register dan login menggunakan Supabase Auth
* Protected routes untuk halaman user
* Auto logout setelah 15 menit tidak aktif
* Dashboard personal
* Tambah jurnal harian
* List jurnal
* Detail jurnal
* Edit jurnal
* Delete jurnal
* Mood tracker bulanan
* Mood calendar
* Insight sederhana berbasis data jurnal
* Profile page
* Mobile responsive
* Soft muted theme
* Animasi UI halus
* Data user aman dengan Supabase RLS

---

## 🧠 Tentang Aplikasi

RuangRasa membantu user mencatat:

* Mood harian
* Intensitas emosi
* Catatan/jurnal
* Faktor yang memengaruhi perasaan
* Aktivitas yang dilakukan
* Tag personal

Contoh mood yang digunakan:

* Senang
* Tenang
* Biasa
* Sedih
* Cemas
* Marah
* Lelah
* Kosong

---

## 🛠️ Tech Stack

| Bagian     | Teknologi                          |
| ---------- | ---------------------------------- |
| Frontend   | Next.js App Router                 |
| Bahasa     | TypeScript                         |
| Styling    | Tailwind CSS                       |
| Auth       | Supabase Auth                      |
| Database   | Supabase PostgreSQL                |
| Backend    | Next.js Server Actions / API Logic |
| Session    | Supabase SSR                       |
| Deployment | Vercel                             |

---

## 📁 Struktur Project

```txt
ruangrasa/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   ├── journals/
│   │   ├── mood-tracker/
│   │   └── profile/
│   ├── components/
│   │   ├── AuthenticatedNav.tsx
│   │   ├── BackButton.tsx
│   │   ├── DeleteJournalForm.tsx
│   │   ├── IdleLogoutProvider.tsx
│   │   ├── JournalForm.tsx
│   │   └── LogoutButton.tsx
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── date.ts
│   │   ├── journal-actions.ts
│   │   ├── mood.ts
│   │   ├── supabase-browser.ts
│   │   ├── supabase-server.ts
│   │   └── supabase.ts
│   ├── types/
│   │   └── database.ts
│   └── proxy.ts
├── public/
├── .env.local
├── package.json
└── README.md
```

---

## 🔐 Environment Variables

Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Ambil value dari:

```txt
Supabase Dashboard
→ Project Settings
→ API
```

Jangan masukkan `service_role` key ke frontend.

---

## 🗄️ Database

Project ini menggunakan Supabase PostgreSQL dengan tabel:

```txt
profiles
journals
journal_factors
journal_tags
journal_activities
```

### profiles

Menyimpan data tambahan user dari Supabase Auth.

| Kolom      | Tipe        |
| ---------- | ----------- |
| id         | uuid        |
| full_name  | varchar     |
| username   | varchar     |
| avatar_url | text        |
| created_at | timestamptz |
| updated_at | timestamptz |

### journals

Menyimpan jurnal harian user.

| Kolom        | Tipe        |
| ------------ | ----------- |
| id           | uuid        |
| user_id      | uuid        |
| mood         | varchar     |
| intensity    | int         |
| note         | text        |
| journal_date | date        |
| created_at   | timestamptz |
| updated_at   | timestamptz |

### journal_factors

Menyimpan faktor yang memengaruhi mood user.

Contoh:

```txt
work
education
family
relationship
money
health
future
loneliness
self-esteem
```

### journal_activities

Menyimpan aktivitas user.

Contoh:

```txt
sleep
exercise
hobby
learning
socializing
praying
music
walking
rest
```

### journal_tags

Menyimpan tag bebas dari jurnal user.

---

## 🔒 Security

RuangRasa menggunakan **Row Level Security / RLS** dari Supabase.

Setiap user hanya bisa mengakses data miliknya sendiri.

Protected data:

* Profile pribadi
* Jurnal pribadi
* Factors
* Tags
* Activities

Aplikasi tidak menggunakan `service_role` key di client.

---

## 🚀 Cara Menjalankan Project

Clone repository:

```bash
git clone https://github.com/username/ruangrasa.git
```

Masuk ke folder project:

```bash
cd ruangrasa
```

Install dependencies:

```bash
npm install
```

Buat file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Jalankan development server:

```bash
npm run dev
```

Buka di browser:

```txt
http://localhost:3000
```

---

## 🧪 Testing Manual

### Auth

* Buka `/register`
* Buat akun baru
* Login dari `/login`
* Pastikan user masuk ke `/dashboard`
* Logout
* Pastikan tidak bisa akses `/dashboard` setelah logout

### Dashboard

* Pastikan greeting muncul
* Email user tidak ditampilkan di dashboard
* Statistik jurnal bulan ini muncul
* Tombol tambah jurnal bekerja

### Journals

* Buat jurnal baru dari `/journals/new`
* Lihat list jurnal di `/journals`
* Buka detail jurnal
* Edit jurnal
* Delete jurnal

### Mood Tracker

* Buka `/mood-tracker`
* Pastikan calendar mood muncul
* Pastikan data mood bulan ini tampil
* Pastikan insight tidak bersifat diagnosis

### Mobile

Test di ukuran:

```txt
360px
390px
430px
```

Pastikan:

* Tidak ada horizontal overflow
* Calendar tetap rapi
* Form nyaman digunakan
* Navbar tidak berantakan

---

## 🧭 Routes

| Route                 | Fungsi               |
| --------------------- | -------------------- |
| `/`                   | Landing page         |
| `/login`              | Login user           |
| `/register`           | Register user        |
| `/dashboard`          | Dashboard user       |
| `/journals`           | List jurnal          |
| `/journals/new`       | Tambah jurnal        |
| `/journals/[id]`      | Detail jurnal        |
| `/journals/[id]/edit` | Edit jurnal          |
| `/mood-tracker`       | Mood tracker bulanan |
| `/profile`            | Profile user         |

---

## 🔁 Auth Behavior

Jika user belum login:

```txt
/             → bisa dibuka
/login        → bisa dibuka
/register     → bisa dibuka
/dashboard    → redirect ke /login
/journals     → redirect ke /login
/mood-tracker → redirect ke /login
/profile      → redirect ke /login
```

Jika user sudah login:

```txt
/             → redirect ke /dashboard
/login        → redirect ke /dashboard
/register     → redirect ke /dashboard
/dashboard    → bisa dibuka
/journals     → bisa dibuka
/mood-tracker → bisa dibuka
/profile      → bisa dibuka
```

---

## ⏳ Idle Logout

RuangRasa memiliki fitur auto logout setelah user tidak aktif selama 15 menit.

Aktivitas yang dihitung:

* Mouse movement
* Click
* Keydown
* Scroll
* Touch event

Jika user menutup browser lalu kembali setelah lebih dari 15 menit, aplikasi akan otomatis logout saat dibuka kembali.

---

## 🎨 Tema UI

Tema RuangRasa menggunakan nuansa:

* Sage green
* Warm cream
* Soft clay
* Muted teal
* Slate text

Tujuan visual:

* Calm
* Natural
* Soft
* Cozy
* Tidak terlalu terang
* Tidak terlalu gelap

---

## 📌 Mood Values

Value mood yang digunakan di database:

```ts
type Mood =
  | "happy"
  | "calm"
  | "neutral"
  | "sad"
  | "anxious"
  | "angry"
  | "tired"
  | "empty";
```

Label tampilan:

```txt
happy    → Senang
calm     → Tenang
neutral  → Biasa
sad      → Sedih
anxious  → Cemas
angry    → Marah
tired    → Lelah
empty    → Kosong
```

---

## ⚠️ Disclaimer

RuangRasa bukan pengganti psikolog, psikiater, konselor, atau bantuan medis profesional.

Insight yang ditampilkan hanya berdasarkan data jurnal yang user tulis dan tidak boleh dianggap sebagai diagnosis.

Jika user merasa dalam kondisi darurat atau ingin menyakiti diri sendiri, segera hubungi orang terdekat atau layanan darurat setempat.

---

## 📦 Build

Cek lint:

```bash
npm run lint
```

Build project:

```bash
npm run build
```

Jalankan production preview:

```bash
npm start
```

---

## 🌐 Deployment

Project ini cocok dideploy ke Vercel.

Langkah umum:

1. Push project ke GitHub
2. Import repository ke Vercel
3. Tambahkan environment variables:

   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

Pastikan Supabase Auth URL configuration sudah disesuaikan dengan domain production.

---

## 👤 Author

Created by **Fachry Much Nurul Akbar**

Project portfolio untuk full-stack web development dengan Next.js dan Supabase.
