/* ===== Utilitas ===== */
const $ = (s, r = document) => r.querySelector(s);
const rupiah = n => "Rp " + Number(n).toLocaleString("id-ID");
const angka = s => parseInt(String(s).replace(/\D/g, ""), 10) || 0; // "Rp 180.000" -> 180000
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const simpan = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const ambil = (k, d) => JSON.parse(localStorage.getItem(k) || JSON.stringify(d));
const semuaUser = () => [...dataPengguna, ...ambil("userBaru", [])];
const semuaTracking = () => ({ ...dataTracking, ...ambil("pesananBaru", {}) });
const halaman = document.body.dataset.page;

function bukaModal(html, lebar) {
  $("#modalBody").innerHTML = html;
  $(".modal-box").classList.toggle("lebar", !!lebar);
  $("#modal").hidden = false;
  ($("#modalBody input") || $(".close")).focus(); // fokus ke isian pertama supaya mudah diketik
}
function tutupModal() { $("#modal").hidden = true; }
document.addEventListener("click", e => {
  if (e.target.hasAttribute("data-close") || e.target.id === "modal") tutupModal();
});
document.addEventListener("keydown", e => { if (e.key === "Escape") tutupModal(); });

// Validasi: pesan error ditulis ke <p.pesan-error> milik input tersebut
function cek(input, ok, pesan) {
  const induk = (input.closest(".input-grup") || input).parentElement;
  const p = induk.querySelector(".pesan-error");
  input.classList.toggle("salah", !ok);
  if (p) p.textContent = ok ? "" : pesan;
  return ok;
}
const kosong = v => v.trim() === "";
// Pesan error hilang begitu pengguna mulai memperbaiki isian
function bersihkanError(e) {
  const el = e.target;
  if (!el.classList || !el.classList.contains("salah")) return;
  el.classList.remove("salah");
  const p = (el.closest(".input-grup") || el).parentElement.querySelector(".pesan-error");
  if (p) p.textContent = "";
}
document.addEventListener("input", bersihkanError);
document.addEventListener("change", bersihkanError);

// Sampul yang gagal dimuat diganti kotak "Tanpa sampul" (berlaku untuk semua <img class="sampul">)
document.addEventListener("error", e => {
  const img = e.target;
  if (img.tagName !== "IMG" || !img.classList.contains("sampul")) return;
  const d = document.createElement("div");
  d.className = "sampul kosong"; d.textContent = "Tanpa sampul";
  img.replaceWith(d);
}, true);
// Sampul buku dibungkus <span class="buku"> supaya ada efek lipatan punggung buku
function sampulHTML(src, nama, ukuran = "") {
  const isi = src ? `<img class="sampul" src="${esc(src)}" alt="Sampul buku ${esc(nama)}" loading="lazy">` : `<div class="sampul kosong">Tanpa sampul</div>`;
  return `<span class="buku ${ukuran}">${isi}</span>`;
}

/* ===== Guard login ===== */
const user = JSON.parse(sessionStorage.getItem("user") || "null");
if (halaman !== "login" && !user) location.replace("index.html");
if (halaman !== "login") {
  $("#logout").addEventListener("click", e => {
    e.preventDefault(); sessionStorage.removeItem("user"); location.href = "index.html";
  });
  // Inisial nama di header (mis. "Rina Wulandari" -> "RW")
  $("#avatar").textContent = user.nama.split(" ").slice(0, 2).map(k => k[0]).join("").toUpperCase();
  // Tombol Menu untuk layar kecil
  const tgl = $("#navToggle");
  tgl.addEventListener("click", () => {
    const buka = $("#nav").classList.toggle("buka");
    tgl.setAttribute("aria-expanded", buka);
  });
}

/* ===== LOGIN ===== */
function initLogin() {
  $("#formLogin").addEventListener("submit", e => {
    e.preventDefault();
    const em = $("#email"), pw = $("#password");
    const a = cek(em, !kosong(em.value) && /^\S+@\S+\.\S+$/.test(em.value.trim()), kosong(em.value) ? "Email wajib diisi." : "Format email tidak valid, contoh: nama@email.com.");
    const b = cek(pw, !kosong(pw.value), "Password wajib diisi.");
    if (!a || !b) return;
    const u = semuaUser().find(x => x.email === em.value.trim() && x.password === pw.value);
    if (!u) { alert("Email/password yang anda masukkan salah"); pw.value = ""; pw.focus(); return; }
    sessionStorage.setItem("user", JSON.stringify(u));
    location.href = "dashboard.html";
  });

  // Tombol "Lihat/Sembunyikan" password
  $("#tglPw").addEventListener("click", e => {
    const pw = $("#password"), tampil = pw.type === "password";
    pw.type = tampil ? "text" : "password";
    e.target.textContent = tampil ? "Sembunyikan" : "Lihat";
    e.target.setAttribute("aria-pressed", tampil);
    e.target.setAttribute("aria-label", tampil ? "Sembunyikan password" : "Tampilkan password");
  });
  $("#btnLupa").addEventListener("click", () => {
    bukaModal(`<h2>Lupa Password</h2><p class="redup">Masukkan email yang terdaftar. Tautan reset password akan dikirim ke email tersebut (simulasi).</p><form id="formLupa" novalidate>
      <div class="field"><label for="emailLupa">Email terdaftar</label><input id="emailLupa" type="email"><p class="pesan-error"></p></div>
      <button class="btn btn-penuh" type="submit">Kirim tautan reset</button></form>`);
    $("#formLupa").addEventListener("submit", e => {
      e.preventDefault();
      const i = $("#emailLupa");
      if (!cek(i, semuaUser().some(u => u.email === i.value.trim()), "Email tidak terdaftar.")) return;
      tutupModal(); alert("Tautan reset password telah dikirim ke " + i.value);
    });
  });

  $("#btnDaftar").addEventListener("click", () => {
    bukaModal(`<h2>Daftar Akun</h2><p class="redup">Isi data berikut untuk membuat akun baru.</p><form id="formDaftar" novalidate>
      <div class="field"><label for="dNama">Nama lengkap</label><input id="dNama"><p class="pesan-error"></p></div>
      <div class="field"><label for="dEmail">Email</label><input id="dEmail" type="email"><p class="pesan-error"></p></div>
      <div class="field"><label for="dPass">Password (min. 6 karakter)</label><input id="dPass" type="password"><p class="pesan-error"></p></div>
      <button class="btn btn-penuh" type="submit">Daftar</button></form>`);
    $("#formDaftar").addEventListener("submit", e => {
      e.preventDefault();
      const n = $("#dNama"), em = $("#dEmail"), p = $("#dPass");
      const ok = [
        cek(n, !kosong(n.value), "Nama wajib diisi."),
        cek(em, /^\S+@\S+\.\S+$/.test(em.value) && !semuaUser().some(u => u.email === em.value.trim()), "Email tidak valid atau sudah dipakai."),
        cek(p, p.value.length >= 6, "Password minimal 6 karakter.")
      ].every(Boolean);
      if (!ok) return;
      simpan("userBaru", [...ambil("userBaru", []), { id: Date.now(), nama: n.value.trim(), email: em.value.trim(), password: p.value, role: "User" }]);
      tutupModal(); alert("Pendaftaran berhasil. Silakan login.");
    });
  });
}

/* ===== DASHBOARD ===== */
function initDashboard() {
  const sekarang = new Date();
  const jam = sekarang.getHours();
  const sapaan = jam < 11 ? "pagi" : jam < 15 ? "siang" : jam < 18 ? "sore" : "malam";
  $("#greeting").textContent = `Selamat ${sapaan}, ${user.nama}!`;
  $("#chipPeran").textContent = "Login sebagai " + user.role;
  $("#jam").textContent = sekarang.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    + ", pukul " + sekarang.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + ". Mau pesan buku atau lacak paket hari ini?";

  // Ringkasan angka dihitung dari data
  const semua = Object.values(semuaTracking());
  $("#statJudul").textContent = dataKatalogBuku.length;
  $("#statStok").textContent = dataKatalogBuku.reduce((s, b) => s + b.stok, 0).toLocaleString("id-ID");
  $("#statPesanan").textContent = semua.length;
  $("#statJalan").textContent = semua.filter(d => posisiStatus(d) < 4).length;

  // Katalog pilihan: satu kartu per buku, tombol Pesan membawa kode buku ke halaman pemesanan
  $("#katalogPilihan").innerHTML = dataKatalogBuku.map(b => {
    const st = b.stok === 0 ? ["Habis", "habis"] : b.stok < 200 ? ["Tipis", "tipis"] : ["Tersedia", "tersedia"];
    return `<article class="buku-kartu"><div class="panggung">${sampulHTML(b.cover, b.namaBarang)}</div>
      <div class="isi-kartu"><h3>${esc(b.namaBarang)}</h3><span class="kode">Edisi ${esc(b.edisi)}, kode ${esc(b.kodeBarang)}</span>
      <span class="harga">${esc(b.harga)}</span>
      <div class="baris"><span class="badge ${st[1]}">${st[0]}</span>
      ${b.stok > 0 ? `<a class="btn kecil" href="checkout.html?kode=${encodeURIComponent(b.kodeBarang)}">Pesan</a>` : ""}</div></div></article>`;
  }).join("");

  $("#btnRiwayat").addEventListener("click", () => {
    const semua = Object.values(semuaTracking());
    bukaModal(`<h2>History Transaksi</h2><div class="tabel-wrap"><table><thead><tr><th>No. DO</th><th>Tanggal</th><th>Total</th><th>Status</th></tr></thead><tbody>${
      semua.map(r => `<tr><td>${esc(r.nomorDO)}</td><td>${esc(r.tanggalKirim)}</td><td>${esc(r.total)}</td><td><span class="pill ${posisiStatus(r) === 4 ? "ok" : ""}">${esc(labelStatus(r))}</span></td></tr>`).join("")
    }</tbody></table></div>`, true);
  });
}

/* ===== STOK ===== */
function initStok() {
  const tbody = $("#tbodyStok");
  function sampul(src, nama) {
    const w = document.createElement("span");
    w.className = "buku mini";
    if (src) {
      const img = document.createElement("img");
      img.className = "sampul"; img.alt = "Sampul " + nama; img.src = src;
      w.appendChild(img);
    } else {
      const d = document.createElement("div"); d.className = "sampul kosong"; d.textContent = "Tanpa sampul"; w.appendChild(d);
    }
    return w;
  }
  const statusStok = n => n === 0 ? "habis" : n < 200 ? "tipis" : "tersedia";
  const namaStatus = { tersedia: "Tersedia", tipis: "Tipis", habis: "Habis" };

  function tambahBaris(b) {
    const tr = document.createElement("tr");
    const st = statusStok(b.stok);
    tr.dataset.status = st;
    tr.dataset.teks = `${b.kodeBarang} ${b.namaBarang} ${b.jenisBarang}`.toLowerCase();
    const tdCover = document.createElement("td"); tdCover.appendChild(sampul(b.cover, b.namaBarang)); tr.appendChild(tdCover);
    [["Kode", b.kodeBarang], ["Nama", b.namaBarang], ["Jenis", b.jenisBarang], ["Edisi", b.edisi], ["Harga", b.harga]].forEach(([label, t]) => {
      const td = document.createElement("td"); td.textContent = t; td.dataset.label = label; tr.appendChild(td);
    });
    const tdStok = document.createElement("td"); tdStok.dataset.label = "Stok";
    tdStok.innerHTML = `<span class="angka-stok">${b.stok}</span><span class="badge ${st}">${namaStatus[st]}</span>`;
    const tdAksi = document.createElement("td");
    const btn = document.createElement("button");
    btn.className = "btn kecil hapus"; btn.type = "button"; btn.textContent = "Hapus";
    btn.addEventListener("click", () => { if (confirm(`Hapus "${b.namaBarang}" dari daftar?`)) { tr.remove(); perbarui(); } });
    tdAksi.appendChild(btn); tr.append(tdStok, tdAksi);
    tbody.appendChild(tr);
  }

  // Menyaring baris (pencarian + status) dan memperbarui angka ringkasan
  function perbarui() {
    const q = $("#cari").value.trim().toLowerCase(), st = $("#filterStatus").value;
    const hitung = { tersedia: 0, tipis: 0, habis: 0 };
    let tampil = 0;
    [...tbody.rows].forEach(tr => {
      hitung[tr.dataset.status]++;
      const cocok = (!q || tr.dataset.teks.includes(q)) && (!st || tr.dataset.status === st);
      tr.hidden = !cocok; if (cocok) tampil++;
    });
    $("#nTersedia").textContent = hitung.tersedia; $("#nTipis").textContent = hitung.tipis; $("#nHabis").textContent = hitung.habis;
    $("#infoHasil").textContent = `Menampilkan ${tampil} dari ${tbody.rows.length} judul`;
    $("#kosongStok").hidden = tampil > 0;
  }
  dataKatalogBuku.forEach(tambahBaris);
  perbarui();
  $("#cari").addEventListener("input", perbarui);
  $("#filterStatus").addEventListener("change", perbarui);

  $("#formStok").addEventListener("submit", e => {
    e.preventDefault();
    const f = id => $("#" + id);
    const kodeAda = [...tbody.rows].some(r => r.cells[1].textContent.toUpperCase() === f("kode").value.trim().toUpperCase());
    const ok = [
      cek(f("kode"), !kosong(f("kode").value) && !kodeAda, "Kode wajib diisi dan harus unik."),
      cek(f("nama"), !kosong(f("nama").value), "Nama barang wajib diisi."),
      cek(f("jenis"), f("jenis").value !== "", "Pilih jenis barang."),
      cek(f("edisi"), Number(f("edisi").value) >= 1, "Edisi minimal 1."),
      cek(f("harga"), Number(f("harga").value) > 0, "Harga harus lebih dari 0."),
      cek(f("stok"), f("stok").value !== "" && Number(f("stok").value) >= 0, "Stok tidak boleh kosong/negatif.")
    ].every(Boolean);
    if (!ok) return alert("Data belum valid, periksa kolom yang ditandai merah.");
    tambahBaris({ kodeBarang: f("kode").value.trim(), namaBarang: f("nama").value.trim(), jenisBarang: f("jenis").value,
      edisi: f("edisi").value, stok: +f("stok").value, harga: rupiah(f("harga").value), cover: "" });
    e.target.reset(); perbarui();
  });
}

/* ===== CHECKOUT ===== */
function initCheckout() {
  const cart = [];
  const pilih = $("#pilihBuku");
  dataKatalogBuku.filter(b => b.stok > 0).forEach(b => pilih.add(new Option(`${b.namaBarang} - ${b.harga} (stok ${b.stok})`, b.kodeBarang)));
  $("#nama").value = user.nama;

  // Tautan "Pesan" di dashboard membawa ?kode=... untuk memilih buku otomatis
  const kodeUrl = new URLSearchParams(location.search).get("kode");
  if (kodeUrl && [...pilih.options].some(o => o.value === kodeUrl)) pilih.value = kodeUrl;

  function pratinjau() {
    const b = dataKatalogBuku.find(x => x.kodeBarang === pilih.value);
    $("#pratinjau").innerHTML = b ? `${sampulHTML(b.cover, b.namaBarang, "kecil")}<div><strong>${esc(b.namaBarang)}</strong>
      <span>Edisi ${esc(b.edisi)}, ${esc(b.harga)}</span><br><span>Stok tersedia: ${b.stok}</span></div>` : "";
  }
  pilih.addEventListener("change", pratinjau);
  pratinjau();

  function render() {
    const ul = $("#daftarCart"); ul.innerHTML = "";
    if (!cart.length) {
      const li = document.createElement("li"); li.className = "cart-kosong";
      li.textContent = 'Belum ada buku. Pilih buku lalu klik "Tambah ke pesanan".'; ul.appendChild(li);
    }
    cart.forEach((it, i) => {
      const li = document.createElement("li"); li.className = "cart-item";
      li.innerHTML = `${sampulHTML(it.cover, it.namaBarang, "kecil")}
        <div class="cart-info"><strong>${esc(it.namaBarang)}</strong><span>${rupiah(it.harga)}</span></div>
        <button class="btn kecil hapus" type="button">Hapus</button>
        <div class="baris-qty"><label class="qty-label">Ubah jumlah<input type="number" min="1" max="${it.stok}" value="${it.qty}"></label><span class="subtotal">${rupiah(it.harga * it.qty)}</span></div>`;
      li.querySelector("input").addEventListener("change", e => {
        const v = parseInt(e.target.value);
        if (!v || v < 1 || v > it.stok) { alert(`Jumlah harus 1 - ${it.stok}`); e.target.value = it.qty; return; }
        it.qty = v; render();
      });
      li.querySelector("button").addEventListener("click", () => { cart.splice(i, 1); render(); });
      ul.appendChild(li);
    });
    $("#totalBayar").textContent = rupiah(cart.reduce((s, x) => s + x.harga * x.qty, 0));
    $("#jumlahItem").textContent = cart.reduce((s, x) => s + x.qty, 0) + " item";
  }
  render();

  $("#btnTambah").addEventListener("click", () => {
    const b = dataKatalogBuku.find(x => x.kodeBarang === pilih.value);
    const q = parseInt($("#qty").value);
    if (!b || !q || q < 1) return alert("Pilih buku dan isi jumlah minimal 1.");
    const ada = cart.find(x => x.kodeBarang === b.kodeBarang);
    const baru = (ada ? ada.qty : 0) + q;
    if (baru > b.stok) return alert(`Stok "${b.namaBarang}" hanya ${b.stok}.`);
    if (ada) ada.qty = baru; else cart.push({ kodeBarang: b.kodeBarang, namaBarang: b.namaBarang, harga: angka(b.harga), stok: b.stok, qty: q, cover: b.cover });
    $("#sukses").hidden = true;
    render();
  });

  $("#formOrder").addEventListener("submit", e => {
    e.preventDefault();
    const f = id => $("#" + id);
    const ok = [
      cek(f("nama"), !kosong(f("nama").value), "Nama wajib diisi."),
      cek(f("telp"), /^\d{9,14}$/.test(f("telp").value), "Telepon harus 9-14 digit angka."),
      cek(f("alamat"), f("alamat").value.trim().length >= 10, "Alamat minimal 10 karakter."),
      cek(f("ekspedisi"), f("ekspedisi").value !== "", "Pilih ekspedisi."),
      cek(f("bayar"), f("bayar").value !== "", "Pilih metode pembayaran.")
    ].every(Boolean);
    if (!cart.length) return alert("Pesanan masih kosong. Tambahkan minimal satu buku.");
    if (!ok) return alert("Data pemesan belum lengkap, periksa kolom yang ditandai merah.");
    const semua = semuaTracking();
    let no; do { no = "2026" + (Math.floor(Math.random() * 9000) + 1000); } while (semua[no]);
    const total = cart.reduce((s, x) => s + x.harga * x.qty, 0);
    const sekarang = new Date();
    const pad = n => String(n).padStart(2, "0");
    const tgl = `${sekarang.getFullYear()}-${pad(sekarang.getMonth() + 1)}-${pad(sekarang.getDate())}`;
    const baru = ambil("pesananBaru", {});
    baru[no] = { nomorDO: no, nama: f("nama").value.trim(), status: "Diproses", ekspedisi: f("ekspedisi").value,
      tanggalKirim: tgl, paket: `Paket buku (${cart.reduce((s, x) => s + x.qty, 0)} item)`, total: rupiah(total),
      perjalanan: [{ waktu: `${tgl} ${sekarang.toLocaleTimeString("id-ID")}`, keterangan: "Pesanan dibuat, menunggu diproses" }] };
    simpan("pesananBaru", baru);
    alert(`Pesanan berhasil dibuat!\nNomor Delivery Order: ${no}\nTotal: ${rupiah(total)}`);
    cart.length = 0; render(); e.target.reset(); f("nama").value = user.nama;
    // Kotak konfirmasi dengan tautan langsung ke halaman tracking
    $("#sukses").hidden = false;
    $("#sukses").innerHTML = `<p><strong>Pesanan dibuat.</strong> Nomor DO Anda: <strong>${no}</strong></p><a class="btn kecil" href="tracking.html?do=${no}">Lacak pesanan ini</a>`;
  });
}

/* ===== TRACKING ===== */
const langkahStatus = ["Diproses", "Dikemas", "Dikirim", "Dalam Perjalanan", "Selesai"];
function posisiStatus(d) {
  const last = (d.perjalanan || []).slice(-1)[0];
  if (last && /selesai antar/i.test(last.keterangan)) return 4;
  const i = langkahStatus.indexOf(d.status);
  return i < 0 ? 0 : i;
}
const labelStatus = d => posisiStatus(d) === 4 ? "Selesai" : d.status;

function initTracking() {
  const input = $("#noDO"), hasil = $("#hasil"), kosongState = $("#kosongState");

  function cari() {
    const sembunyi = () => { hasil.hidden = true; kosongState.hidden = false; };
    if (!cek(input, input.value.trim() !== "", "Nomor Delivery Order wajib diisi.")) return sembunyi();
    const d = semuaTracking()[input.value.trim()];
    if (!d) { sembunyi(); return alert("Nomor Delivery Order tidak ditemukan."); }
    const pos = posisiStatus(d);
    kosongState.hidden = true; hasil.hidden = false;
    hasil.innerHTML = `<div class="hasil-kepala"><div><h2>DO ${esc(d.nomorDO)}</h2><p>Atas nama ${esc(d.nama)}</p></div>
      <span class="pill ${pos === 4 ? "ok" : ""}">${esc(labelStatus(d))}</span></div>
      <ol class="progress" aria-label="Status pengiriman">${langkahStatus.map((s, n) =>
        `<li class="${n <= pos ? "selesai" : ""} ${n === pos ? "sekarang" : ""} ${n === pos && pos === 4 ? "akhir" : ""}">${s}</li>`).join("")}</ol>
      <div class="hasil-grid">
        <div><h3>Detail pengiriman</h3><dl class="detail">
          <div><dt>Nama pemesan</dt><dd>${esc(d.nama)}</dd></div><div><dt>Ekspedisi</dt><dd>${esc(d.ekspedisi)}</dd></div>
          <div><dt>Tanggal kirim</dt><dd>${esc(d.tanggalKirim)}</dd></div><div><dt>Jenis paket</dt><dd>${esc(d.paket)}</dd></div>
          <div><dt>Total pembayaran</dt><dd>${esc(d.total)}</dd></div></dl></div>
        <div><h3>Perjalanan paket</h3><ol class="riwayat">${[...d.perjalanan].reverse().map(p =>
          `<li><time>${esc(p.waktu)}</time>${esc(p.keterangan)}</li>`).join("")}</ol></div>
      </div>`;
  }
  $("#formCari").addEventListener("submit", e => { e.preventDefault(); cari(); });

  // Tombol nomor contoh + nomor dari pesanan yang baru dibuat di browser ini
  const chips = $("#chipDO");
  const nomor = [...Object.keys(dataTracking).map(n => [n, false]), ...Object.keys(ambil("pesananBaru", {})).slice(-3).map(n => [n, true])];
  nomor.forEach(([n, baru]) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "chip" + (baru ? " baru" : ""); b.textContent = n;
    if (baru) b.title = "Pesanan yang baru Anda buat";
    b.addEventListener("click", () => { input.value = n; cari(); });
    chips.appendChild(b);
  });

  // Dibuka dari tombol "Lacak pesanan ini" di halaman pemesanan (?do=...)
  const awal = new URLSearchParams(location.search).get("do");
  if (awal) { input.value = awal; cari(); }
}

({ login: initLogin, dashboard: initDashboard, stok: initStok, checkout: initCheckout, tracking: initTracking })[halaman]();
