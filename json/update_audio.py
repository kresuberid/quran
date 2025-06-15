import os
import json

# Mapping Qori dan slug
qori_map = {
    "01": "Abdullah-Al-Juhany",
    "02": "Abdul-Muhsin-Al-Qasim",
    "03": "Abdurrahman-as-Sudais",
    "04": "Ibrahim-Al-Dossari",
    "05": "Misyari-Rasyid-Al-Afasi"
}

def pad(num, n=3):
    return str(num).zfill(n)

folder = './'  # Ganti ke path folder json jika perlu

for filename in os.listdir(folder):
    if filename.endswith('.json'):
        filepath = os.path.join(folder, filename)
        with open(filepath, encoding='utf-8') as f:
            data = json.load(f)

        nomor_surat = pad(data['nomor'])

        # Tambah audioFull di level surat
        data['audioFull'] = {
            qori: f"https://equran.nos.wjv-1.neo.id/audio-full/{slug}/{nomor_surat}.mp3"
            for qori, slug in qori_map.items()
        }

        # Tambah audio di setiap ayat
        for ayat in data['ayat']:
            nomor_ayat = pad(ayat['nomor'])
            ayat['audio'] = {
                qori: f"https://equran.nos.wjv-1.neo.id/audio-partial/{slug}/{nomor_surat}{nomor_ayat}.mp3"
                for qori, slug in qori_map.items()
            }

        # Tulis ulang file
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

print("✅ Semua file json sudah diupdate.")
