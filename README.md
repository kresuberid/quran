# Al-Qur'an Digital – WordPress (ACF Integration)

**Al-Qur'an Digital** adalah platform aplikasi berbasis WordPress yang memanfaatkan Advanced Custom Fields (ACF) untuk pengelolaan data, ayat, surah, audio, dan berbagai fitur Quran digital secara dinamis dan terstruktur. Dengan integrasi ACF, pengelolaan konten dan pengembangan fitur menjadi lebih fleksibel dan powerful bagi admin maupun developer.

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

1. **Install WordPress + ACF*

   * Upload plugin [Advanced Custom Fields PRO](https://www.advancedcustomfields.com/) dan aktifkan.

2. **Import Field Groups**

   * Gunakan menu Tools → Import Field Group (JSON) sesuai struktur yang dibutuhkan (`field_surat.json`, `field_ayat.json`, dll).

3. **Buat Custom Post Type**

   * Bisa dengan plugin (CPT UI) atau manual di functions.php, contoh:

     ```php
     register_post_type('surat', [...]);
     register_post_type('ayat', [...]);
     ```

4. **Isi Data Al-Qur'an**

   * Import otomatis via script/API atau manual lewat dashboard.

5. **Integrasi Frontend**

   * Template theme: gunakan `get_field()` untuk menampilkan data (teks arab, terjemahan, audio, dst)

     ```php
     $teks_arab = get_field('teks_arab');
     $audio = get_field('audio_url');
     $tafsir = get_field('tafsir');
     ```

6. **Optimasi SEO & Performa**

   * Gunakan Rank Math/Yoast SEO + caching plugin.

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

MIT License. Sumber data Al-Qur’an mengikuti lisensi dan ketentuan API/data penyedia.

---

## Disclaimer

Pastikan pengecekan ulang validasi ayat, teks, dan terjemahan sebelum digunakan publik. Integrasi ACF bersifat teknis dan butuh pengalaman WordPress dev.

---

*Semoga bermanfaat dan menjadi amal jariyah.*
