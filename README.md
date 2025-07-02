# Al-Qur'an Digital – WordPress (ACF Integration)

**Al-Qur'an Digital** adalah platform aplikasi berbasis WordPress yang memanfaatkan Advanced Custom Fields (ACF) untuk pengelolaan data, ayat, surah, audio, dan berbagai fitur Quran digital secara dinamis dan terstruktur. Dengan integrasi ACF, pengelolaan konten dan pengembangan fitur menjadi lebih fleksibel dan powerful bagi admin maupun developer.

Plugin **wp-equran** kini tersedia untuk instalasi cepat. Salin folder `wp-equran` ke `wp-content/plugins`, aktifkan lewat dashboard, lalu gunakan shortcode `[equran]` pada halaman atau postingan.
Plugin ini telah diuji berjalan baik dengan tema **Blocksy**.
Dataset surah, ayat, dan tafsir diambil dari API publik [equran.id](https://equran.id/api/v2).
Demo: https://equran.my.id


---

## Fitur Utama

* **Mushaf Digital Modern**

  * Navigasi Surah dan Ayat interaktif
  * Tampilan responsif dan mode terang/gelap
* **Integrasi Audio Murottal**

  * Field custom audio per ayat/surah dengan ACF
* **Terjemahan dan Tafsir**

  * Field custom terjemahan/tafsir multi-bahasa via ACF Repeater/Field Group
* **Pencarian Cepat**

  * Search by surah, ayat, keyword, terjemahan
* **Asmaul Husna & Doa Harian**

  * Post type dan field ACF khusus untuk 99 Asmaul Husna dan doa pilihan
* **Bookmark & Hafalan**

  * Save bacaan terakhir dan ayat favorit (jika ingin dengan plugin tambahan)

---

## Struktur Data (ACF)

* **Post Type:**

  * `surat` — untuk data surah, field: nama latin, arab, arti, jumlah ayat, urutan, dll.
  * `ayat` — untuk data ayat, field: nomor, teks arab, latin, terjemahan, audio, surah parent
  * `husna` — untuk Asmaul Husna
  * `doa` — untuk doa-doa harian
  * `iqro` — (opsional) untuk materi belajar Iqro

* **Field Utama (ACF):**

  * Teks arab, latin, terjemahan, nomor surah/ayat, audio (URL/file), tafsir, image
  * Support Repeater Field untuk multi terjemahan atau multi tafsir

---

## Cara Instalasi

Berikut langkah cepat untuk mencoba plugin:

1. **Salin Plugin**
   
   Copy folder `wp-equran` ke direktori `wp-content/plugins` pada instalasi WordPress Anda.

2. **Aktifkan**

   Masuk ke Dashboard → Plugins lalu aktifkan *WP eQuran*.

3. **Gunakan Shortcode**

   Tambahkan shortcode `[equran]` ke halaman atau postingan. Plugin akan menampilkan daftar surah dan ayat menggunakan dataset bawaan.

---

## Teknologi

* **WordPress** (Theme/Child Theme atau plugin custom)
* **Advanced Custom Fields**
* **Custom Post Types & Taxonomies**
* **Custom Templates/Blocks** (bisa support Gutenberg)
* **Plugin pelengkap:**

  * [Elementor PRO](https://be.elementor.com/visit/?bta=12143&brand=elementor), Rank Math SEO, WP Rocket, dsb.

---

## Kontribusi

Kontribusi terbuka untuk developer WordPress, pengembang plugin ACF, penerjemah, serta pengelola konten.

---

## Lisensi

Dirilis di bawah MIT License. Lihat berkas `LICENSE` untuk detailnya. Data ayat dan tafsir bersumber dari API https://equran.id/api/v2 sesuai ketentuan penyedia.

---

## Disclaimer

Pastikan pengecekan ulang validasi ayat, teks, dan terjemahan sebelum digunakan publik. Integrasi ACF bersifat teknis dan butuh pengalaman WordPress dev.

---

*Semoga bermanfaat dan menjadi amal jariyah.*

---
Plugin demo: https://equran.my.id

