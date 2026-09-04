# FZI STORE — Website Installer RDP & VPS

Website statis (HTML/CSS/JS) untuk toko installer RDP & VPS, **full via website**
(tanpa Telegram/WhatsApp). Tombol deposit mengarah ke checkout **Pakasir**.
Siap deploy di **Vercel** untuk domain **fzistore.my.id**.

## Struktur folder

```
fzistore/
├── index.html            # Halaman utama (semua tampilan)
├── vercel.json           # Konfigurasi Vercel (static)
├── README.md             # Panduan ini
└── assets/
    ├── config.js         # ⚙️ Ganti slug Pakasir & pengaturan di sini
    ├── style.css         # Tema dark modern neon
    └── app.js            # Logika deposit + checkout Pakasir
```

## 1) Yang WAJIB kamu ganti sebelum produksi

Buka **`assets/config.js`** dan ubah:

```js
pakasir: {
  slug: "fzistore",   // <-- GANTI dengan slug project Pakasir kamu
  minAmount: 10000,
  maxAmount: 5000000,
  qrisOnly: false,
  redirectAfterPay: "https://fzistore.my.id/?paid=1"
}
```

- **slug**: nama project di dashboard Pakasir kamu. Ini yang membentuk link bayar:
  `https://app.pakasir.com/pay/{slug}/{nominal}?order_id={order_id}`
- **qrisOnly**: `true` kalau ingin halaman bayar hanya menampilkan QRIS.
- **redirectAfterPay**: URL tujuan setelah pembayaran selesai (opsional).

Kamu juga bisa mengubah `quickAmounts`, nama toko, dan email support di file yang sama.

> Harga paket di katalog ada di dalam `index.html` (cari bagian `id="katalog"`),
> tinggal edit angkanya.

## 2) Cara kerja tombol deposit

1. User pilih nominal cepat atau ketik manual.
2. Sistem membuat **Order ID unik** otomatis (contoh: `FZI2609041530AB12`).
3. Klik "Lanjut ke Pembayaran" → muncul konfirmasi → diarahkan ke:
   `https://app.pakasir.com/pay/<slug>/<nominal>?order_id=<orderid>`

Ini murni tampilan/redirect (frontend saja). Untuk **menambah saldo user secara
otomatis** setelah bayar, kamu perlu backend + webhook Pakasir
(`/api/pakasir/notification`) — lihat bagian "Langkah lanjut" di bawah.

## 3) Deploy ke Vercel

### Opsi A — via dashboard (paling mudah)
1. Buat repo Git (GitHub/GitLab) berisi folder ini, atau upload manual.
2. Buka [vercel.com](https://vercel.com) → **Add New → Project** → import repo.
3. Framework Preset: **Other** (tidak perlu build command).
4. Klik **Deploy**.

### Opsi B — via Vercel CLI
```bash
npm i -g vercel
cd fzistore
vercel            # deploy preview
vercel --prod     # deploy produksi
```

### Menyambungkan domain fzistore.my.id
Karena domainmu sudah terhubung di Vercel:
1. Buka **Project → Settings → Domains**.
2. Tambahkan `fzistore.my.id` (dan `www.fzistore.my.id` bila mau).
3. Ikuti instruksi DNS bila diminta (biasanya sudah otomatis kalau domain
   sudah di Vercel). Tunggu status **Valid Configuration**.

## 4) Langkah lanjut (opsional, kalau mau saldo otomatis)

Situs ini sengaja dibuat frontend-only sesuai permintaan. Bila nanti butuh:
- Saldo user tersimpan & bertambah otomatis → butuh database + login user.
- Verifikasi pembayaran otomatis → buat endpoint webhook `POST /api/pakasir/notification`
  (bisa pakai Vercel Serverless Functions di folder `/api`).
- Cek status manual → `GET https://app.pakasir.com/api/transactiondetail?project=<slug>&amount=<amt>&order_id=<oid>&api_key=<key>`

Kabari saja kalau mau saya lanjutkan ke versi dengan backend.
