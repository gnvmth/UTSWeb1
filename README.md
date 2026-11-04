# Toko Buku Libréa
### Aplikasi Web Pemesanan Buku (Front-End) - Tugas UTS Pemrograman Web 1

## Identitas

| | |
|---|---|
| **Nama** | Gina Mutmainah |
| **NIM** | 312510490 |
| **Kelas** | I252A |
| **Program Studi / Universitas** | Teknik Informatika / Universitas Pelita Bangsa |
| **Mata Kuliah** | Pemrograman Web |
| **Dosen Pengampu** | Agung Nugroho, S.Kom., M.Kom. |
| **Tugas** | Ujian Tengah Semester (UTS) |
| **Link Video Penjelasan (YouTube)** | [ISI: tempel link YouTube] |

## Deskripsi Proyek

Toko Buku Libréa adalah aplikasi web sederhana untuk pemesanan buku pada toko online. Proyek ini berfokus pada sisi front-end, sehingga tidak memakai server maupun database. Seluruh data (pengguna, katalog buku, dan data pengiriman) berasal dari variabel JavaScript pada file `js/data.js` yang disediakan dosen. Data baru yang dibuat pengguna (akun, pesanan) disimpan di `localStorage` browser.

### Indikator yang dicapai
1. Merancang struktur HTML yang semantik dan valid.
2. Mengelola gaya antarmuka menggunakan CSS.
3. Menggunakan JavaScript untuk manipulasi DOM, validasi form, manipulasi data tabel, dan interaksi UI (pop-up, modal box, alert box).

### Teknologi
HTML5, CSS3 (external stylesheet `css/style.css`, satu contoh CSS internal pada `dashboard.html`, dan CSS inline pada punggung buku di rak), JavaScript (vanilla, tanpa framework).

### Desain dan palet warna
Tema visual mengikuti palet kopi-susu berikut. Motif utamanya adalah **punggung buku di rak**: lima warna palet menjadi lima punggung buku pada halaman login dan hero dashboard, dan "papan rak" berwarna karamel muncul lagi di atas footer.

| Warna | Kode | Dipakai untuk |
|---|---|---|
| Krim | `#F7F0E7` | Latar halaman |
| Pasir | `#E7D8C9` | Judul halaman, header tabel, panel sampul buku |
| Latte | `#CFB59C` | Garis, border input, badge stok Tipis |
| Karamel | `#A38368` | Papan rak, aksen, ikon |
| Mocha | `#5B3F2E` | Teks, tombol utama, panel gelap (hero, footer) |

Font: **Fraunces** (judul dan nama toko) dan **Figtree** (isi), dimuat dari Google Fonts. Warna status (merah bata untuk error/Habis, hijau zaitun untuk Tersedia/Selesai) diturunkan agar serasi dengan palet.

## Fitur per Halaman

| Halaman | File | Fitur utama |
|---|---|---|
| Login | `index.html` | Isian email dan password, tombol **Login**, validasi per kolom, alert "Email/password yang anda masukkan salah", tombol **Lupa Password** dan **Daftar** yang membuka modal box, tombol Lihat password |
| Dashboard | `dashboard.html` | Greeting sesuai jam lokal, ringkasan angka (judul, eksemplar, pesanan), empat menu utama (Informasi Stok/Katalog, Tracking Pengiriman, Laporan Pemesanan, History Transaksi), katalog pilihan dengan tombol Pesan, panduan cara belanja, FAQ, tombol Logout |
| Stok / Katalog | `stok.html` | Tabel dinamis dari `dataKatalogBuku`, tambah dan hapus baris lewat DOM, pencarian dan filter status, ringkasan jumlah Tersedia/Tipis/Habis |
| Pemesanan | `checkout.html` | Pratinjau buku, tambah/ubah/hapus item, ringkasan pesanan dan total otomatis, form pemesan dan pembayaran, nomor DO otomatis, tautan langsung ke tracking |
| Tracking | `tracking.html` | Input nomor DO dan tombol **Cari** (atau pilih nomor contoh), status dengan progress bar, detail ekspedisi, riwayat perjalanan paket |

## Akun untuk Pengujian (dari `dataPengguna`)

Akun ini **tidak ditampilkan** di halaman login (kotak akun demo sudah disembunyikan). Data berasal dari `js/data.js`, jadi penguji dapat memakai tabel berikut untuk login atau membuat akun sendiri lewat tombol **Daftar**.

| Email | Password | Role |
|---|---|---|
| rina@gmail.com | rina123 | User |
| agus@gmail.com | agus123 | User |
| siti@gmail.com | siti123 | Admin |

Nomor Delivery Order untuk uji tracking: `20230012` (Dalam Perjalanan) dan `20230013` (Selesai), atau nomor baru dari halaman pemesanan.

## Kesesuaian dengan Soal Dosen

| Ketentuan soal | Implementasi |
|---|---|
| Minimal lima halaman | Login (`index.html`), Dashboard, Stok, Pemesanan (`checkout.html`), Tracking |
| Data dari variabel JavaScript di file `.js` terpisah (Array JSON) | `js/data.js`: `dataPengguna`, `dataKatalogBuku`, `dataTracking` |
| Login: input email dan password, tombol \"Login\" | Ada, dengan validasi tiap kolom |
| Login salah: pop-up \"email/password yang anda masukkan salah\" | `alert()` pada `js/script.js` |
| Tombol \"Lupa Password\" dan \"Daftar\" berbentuk modal box | Dua tombol di bawah tombol Login, masing-masing membuka modal |
| Dashboard: empat tombol navigasi | Informasi Stok/Katalog, Tracking Pengiriman, Laporan Pemesanan, History Transaksi |
| Dashboard: greeting berdasarkan waktu lokal | `new Date().getHours()` menentukan pagi, siang, sore (dan malam) |
| Stok: tampil dinamis dari `dataKatalogBuku` | Tabel dibuat lewat `createElement` |
| Stok: tambah baris stok baru lewat DOM | Form Tambah stok baru, tombol Tambah ke tabel |
| Pemesanan: data yang dapat ditambah/ubah, isian pemesan dan pembayaran | Tambah, ubah jumlah, dan hapus item; form pemesan, ekspedisi, metode pembayaran |
| Tracking: input Nomor Delivery Order, tombol \"Cari\" | Ada, hasil tampil di bawah form |
| Tracking: nama pemesan, status, ekspedisi, tanggal kirim, jenis paket, total | Progress bar lima tahap, tabel detail, dan riwayat perjalanan |
| Struktur folder `css/`, `js/`, `assets/`, `img/` | Sesuai (lihat bagian berikut) |
| Video penjelasan maksimal 15 menit | Tautan diisi pada bagian Identitas |

## Pembaruan Terbaru

- Halaman login disederhanakan: judul **Login**, tombol **Login**, tanpa kalimat sambutan, dan kotak akun demo disembunyikan.
- Tombol **Lupa Password** dan **Daftar** kini tampil sebagai tombol yang jelas, bukan tautan teks.
- Istilah diseragamkan: Login dan Logout (sebelumnya Masuk dan Keluar), tombol pencarian tracking menjadi **Cari**.
- Pesan error email dibedakan (kosong atau format salah), dan isian password dikosongkan setelah login gagal.
- Menu dashboard diberi deskripsi yang lebih jelas, menu navigasi memakai nama **Stok/Katalog**.
- Setiap halaman diberi petunjuk singkat (stok, pemesanan, tracking), tombol pintas **Tambah stok baru**, dan label **Ubah jumlah** pada ringkasan pesanan.
- Seluruh tangkapan layar pada README dibuat ulang sesuai tampilan terbaru.

## Struktur Folder

```
tugas-uts-web1/
|-- index.html (halaman login)
|-- dashboard.html
|-- stok.html
|-- tracking.html
|-- checkout.html
|-- css/
|   |-- style.css
|-- js/
|   |-- script.js
|   |-- data.js
|-- assets/
|   |-- logo.png (opsional, belum dipakai)
|-- img/
|   |-- pengantar_komunikasi.jpg
|   |-- manajemen_keuangan.jpg
|   |-- kepemimpinan.jpg
|   |-- mikrobiologi.jpg
|   |-- paud_perkembangan.jpg
|-- README.md
|-- docs/
|   |-- screenshots/ (tangkapan layar untuk README)
```

Catatan:
- Soal menyebut `login.html` dan `chackout.html`, sedangkan struktur folder memakai `index.html` dan `checkout.html`. Proyek ini mengikuti struktur folder, dan ejaan `checkout.html` dipakai agar semua link menu konsisten.
- Pada `data.js`, path sampul buku PAUD semula `.jpeg` padahal file aslinya `.jpg`, sehingga diubah menjadi `.jpg`.
- Pada `data.js` (nomor DO `20230012`), penulisan tanggal `2025-08 25` dibetulkan menjadi `2025-08-25` dan satu jam yang tidak berurutan diperbaiki agar riwayat perjalanan runtut.

## Cara Menjalankan

1. Unduh atau clone repository ini.
2. Buka `index.html` di browser (Chrome disarankan), atau gunakan ekstensi Live Server di VS Code.
3. Login dengan salah satu akun pada bagian Akun untuk Pengujian, atau daftar akun baru lewat tombol **Daftar**.

## Penjelasan Proyek dan Tangkapan Layar per Proses

### 1. Login (`index.html`)
Pengguna mengisi email dan password lalu menekan **Login**. Isian divalidasi (kosong atau format email salah) dan dicocokkan dengan `dataPengguna`. Jika tidak sesuai, muncul `alert("Email/password yang anda masukkan salah")`. Tombol **Lupa Password** dan **Daftar** membuka modal box; akun baru disimpan di `localStorage`.

| Halaman login | Modal Daftar |
|---|---|
| ![Halaman login](docs/screenshots/01-login.png) | ![Modal Daftar](docs/screenshots/02-modal-daftar.png) |

| Modal Lupa Password (email tidak terdaftar) | Validasi form login |
|---|---|
| ![Modal Lupa Password](docs/screenshots/03-modal-lupa-error.png) | ![Validasi login](docs/screenshots/04-validasi-login.png) |

### 2. Dashboard (`dashboard.html`)
Greeting dibuat dari `new Date().getHours()`: pagi (sebelum 11.00), siang (sebelum 15.00), sore (sebelum 18.00), selain itu malam. Terdapat empat menu utama: Informasi Stok/Katalog, Tracking Pengiriman, Laporan Pemesanan (menuju halaman pemesanan), dan History Transaksi (modal berisi data dari `dataTracking` ditambah pesanan baru).

| Dashboard | History Transaksi |
|---|---|
| ![Dashboard](docs/screenshots/05-dashboard.png) | ![History Transaksi](docs/screenshots/06-history-modal.png) |

### 3. Informasi Stok / Katalog (`stok.html`)
Tabel dirender dinamis dari `dataKatalogBuku` (sampul, kode, nama, jenis, edisi, harga, stok) menggunakan `createElement` dan `appendChild`. Form tambah stok menambahkan baris baru melalui DOM dengan validasi: kode unik, jenis wajib dipilih, harga lebih dari 0, stok tidak negatif. Setiap baris bisa dihapus dengan konfirmasi.

![Katalog stok](docs/screenshots/07-stok.png)
![Validasi form stok](docs/screenshots/08-stok-error.png)
![Baris stok baru](docs/screenshots/09-stok-tambah.png)

### 4. Pemesanan (`checkout.html`)
Pengguna memilih buku dan jumlah, mengubah jumlah langsung di tabel, atau menghapus item. Total dihitung otomatis dari harga katalog dan jumlah tidak boleh melebihi stok. Data pemesan dan pembayaran divalidasi (telepon 9-14 digit, alamat minimal 10 karakter, ekspedisi dan metode pembayaran wajib dipilih). Saat pesanan berhasil dibuat, sistem memberi nomor Delivery Order yang bisa dilacak di halaman tracking.

![Validasi checkout](docs/screenshots/10-checkout-error.png)
![Form checkout terisi](docs/screenshots/11-checkout-isi.png)

### 5. Informasi Pengiriman (`tracking.html`)
Pengguna memasukkan nomor Delivery Order lalu menekan **Cari**. Hasilnya berisi nama pemesan, status pengiriman (progress bar lima tahap), ekspedisi, tanggal kirim, jenis paket, total pembayaran, dan riwayat perjalanan paket. Nomor yang tidak ditemukan memunculkan alert "Nomor Delivery Order tidak ditemukan."

![Nomor tidak ditemukan](docs/screenshots/12-tracking-error.png)
![Status dalam perjalanan](docs/screenshots/13-tracking.png)
![Status selesai](docs/screenshots/14-tracking-selesai.png)
![Pesanan baru](docs/screenshots/15-tracking-pesanan-baru.png)

## Alur Data

| Data | Sumber | Dipakai di |
|---|---|---|
| `dataPengguna` | `js/data.js` | Login |
| `dataKatalogBuku` | `js/data.js` | Stok, Checkout |
| `dataTracking` | `js/data.js` | Tracking, History Transaksi |
| Akun baru (`userBaru`) | `localStorage` | Login |
| Pesanan baru (`pesananBaru`) | `localStorage` | Tracking, History Transaksi |
| Sesi login (`user`) | `sessionStorage` | Seluruh halaman (guard login) |

## Pemetaan Kriteria Penilaian

| Kriteria | Implementasi |
|---|---|
| Struktur HTML semantik, valid, lengkap | `header`, `nav`, `main`, `section`, `form`, `label`, `footer`, atribut `lang="id"` |
| Desain CSS | External `css/style.css` (variabel palet di `:root`, grid/flex, responsif sampai layar HP), contoh internal (`<style>` di `dashboard.html`) dan inline (atribut `style` pada punggung buku) |
| JavaScript DOM | Render tabel, tambah/hapus baris, modal, progress bar, timeline perjalanan |
| Validasi form dan alert | Pesan error per kolom, `alert`, `confirm` |
| Modularitas file dan struktur file | HTML, CSS, JS, dan data dipisah sesuai struktur dosen |
| Kreativitas tambahan | Identitas merek Libréa dengan palet kopi-susu dan motif rak buku, badge stok, sampul buku, pencarian dan filter stok, nomor DO otomatis yang tersambung ke tracking, pendaftaran akun, timeline tracking, menu responsif |
| Penjelasan video | Lihat link YouTube pada bagian Identitas |

## Penutup

Proyek ini dibuat untuk memenuhi tugas UTS mata kuliah Pemrograman Web 1. Terima kasih kepada dosen pengampu atas arahan dan materi yang diberikan.
