/* =========================================================
   FZI STORE — KONFIGURASI UTAMA
   ---------------------------------------------------------
   Ganti nilai di bawah ini sesuai akun Pakasir & toko kamu.
   Cukup edit file ini saja, tidak perlu sentuh file lain.
   ========================================================= */

window.FZI_CONFIG = {
  // Nama & identitas toko
  storeName: "FZI STORE",
  tagline: "Installer RDP & VPS Otomatis — Full via Website",
  domain: "fzistore.my.id",
  supportEmail: "support@fzistore.my.id",

  // ---- PENGATURAN PAKASIR (WAJIB DIGANTI SAAT PRODUKSI) ----
  // slug = nama project di dashboard Pakasir kamu.
  pakasir: {
    slug: "fzistore",                 // <-- GANTI dengan slug Pakasir kamu
    minAmount: 10000,                 // deposit minimum (Rupiah)
    maxAmount: 5000000,               // deposit maksimum (Rupiah)
    qrisOnly: false,                  // true = hanya tampilkan QRIS di halaman bayar
    // URL yang dituju SETELAH pembayaran selesai (opsional).
    // Biarkan null untuk memakai halaman default Pakasir.
    redirectAfterPay: "https://fzistore.my.id/?paid=1"
  },

  // Nominal cepat yang tampil sebagai tombol (Rupiah)
  quickAmounts: [10000, 25000, 50000, 100000, 250000, 500000],

  // Saldo tampilan (mock — hanya hiasan tampilan)
  displayBalance: 0
};
