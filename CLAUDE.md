# MİT Holo — Claude için kurallar

- Kullanıcı Türkçe konuşur, yalnızca telefon kullanır. Yanıtlar Türkçe, kısa, maddeli.
- Kaynak dosya `src/index.html`. `www/index.html` derleme çıktısıdır; elle düzenleme, `npm run build` ile üret ve commit et.
- Değişiklikten sonra: `npm run build && npm run check`. Hata varsa push etme.
- Veri: IndexedDB (Store adaptörü). `localStorage`'a iş verisi yazma. Hiçbir işlem tüm veriyi silemez; içe aktarma birleştirir.
- Şema değişirse `SCHEMA_VERSION` artır ve `runMigrations()` içine göç yaz. `APP_VERSION`'ı güncelle.
- Arayüz kuralları: palet `:root` değişkenleri dışında renk yok; `backdrop-filter` yok; dokunma hedefi ≥ 48 px;
  olaylar yetki devirli `data-act` / `data-in` / `data-ch` / `data-key` / `data-blur` ile.
- Dış istek yok (CDN, harici font/görsel). Yeni kütüphane gerekiyorsa `tools/build.mjs` ile göm.
- `keystore/debug.keystore` değiştirilmez (değişirse güncellemeler kurulamaz, veri kaybı olur).
- Dil: Türkçe (varsayılan) + English + Mısır Arapçası (RTL). Dil balonları yalnızca küre ekranında (`#lang-bar`, `LangOrbs`), Ayarlar'da dil seçeneği yok. Çeviri çalışma anında `I18n` ile yapılır; **yeni her arayüz metni için `src/i18n-ar.js` ve `src/i18n-en.js` içine karşılık ekle** (DICT birebir, RULES kalıp). Kullanıcı verisi çevrilmez; çevrilmemesi gereken yere `data-nt` koy.
