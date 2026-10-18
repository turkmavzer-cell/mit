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
- QR ile iş paylaşımı (`QrShare`, `Forms.qrSend/qrScan/qrConfirm`): kod biçimi `MIT1.<oturum>.<i>.<n>.<veri>`; veri = bayrak + base64url(deflate(JSON)) + CRC32. Biçimi değiştirirsen sürüm önekini (`MIT1`) artır. Fotoğraf QR'a konmaz. İçe aktarma yalnızca kullanıcı onayıyla ekler/günceller.
- Müşterisiz işler: `Data.UNA` ('__unassigned__') sistem müşterisi altında durur (`Data.isUna`, `Data.real()`, `Data.moveJob`). Müşteri sayısı/listesi gösteren yeni kodda `Data.customers` yerine `Data.real()` kullan.

## Her değişiklikte (zorunlu)
1. `APP_VERSION`'ı artır (yeni özellik → ikinci hane, düzeltme → üçüncü hane). Şema değiştiyse `SCHEMA_VERSION` + göç.
2. `CHANGELOG.md`'nin en üstüne yeni sürüm: **Eklendi / Değişti / Düzeltildi / Kaldırıldı**, tarihli.
3. Kullanıcının verdiği yeni karar veya kaldırttığı özellik varsa bu dosyadaki **Kesinleşmiş kararlar** / **Kaldırılanlar** listesine ekle.
4. Kullanıcıya görünen özellik değiştiyse `README.md`'yi güncelle.
5. `npm run build && npm run check`, sonra commit ve push. Commit mesajı Türkçe ve ne değiştiğini söyler.
- Geliştirme dalı: `ccr-ae266e58-ytuhvz` (APK bu daldan derlenir, Releases'e düşer). `main` eski 1.x; kullanıcı istemeden birleştirme.

## İş bağlamı
- Kullanıcının firması kumaş üzerine taş desen (kalıp) basar. Müşteri kumaşı top top gönderir.
- İş = müşteri + kalıp grupları; her kalıbın topları metre/kilo olarak girilir (kilo, gramajla metreye çevrilir).
- Aşamalar: İmalatta (Baskı Bekliyor → Baskı Yapıldı) → Teslim Edildi.

## Kesinleşmiş kararlar
- Menü (küre düğümleri): İşler · Müşteriler · Kalıplar · Rapor · Yedekleme · Ayarlar.
- Hiçbir işlem tüm veriyi silemez; içe aktarma ve QR yalnızca ekler/günceller.
- Teslim öncesi fatura hatırlatması (iki dokunuş) kalır.
- **İrsaliye (2.22.0):** İmalattaki iş irsaliye oluşturulmadan teslim edilemez (`waybillValid`). İrsaliye için Ayarlar'da firma adı, her kalıpta metre ve metre fiyatı zorunlu; atanmamış top olmamalı. İrsaliyeden sonra metre/fiyat değişirse yeniden oluşturulur (numara aynı kalır). İş formunda solda "İrsaliye Oluştur", sağda "Teslim Edildi" yan yana.
- İrsaliye görseli: üstte müşteri, altında işi yapan firma, kalıp · metre · birim fiyat · tutar, toplam. Beyaz kâğıt görünümü. Ekranda gösterilir, `Belgeler/MIT-Holo/Irsaliyeler/` klasörüne PNG kaydedilir. Kullanıcı ileride içeriğini değiştirecek.
- İrsaliye metresi (`billMeters`): kilodan çevrilen metrenin küsuratı **atılır** (yuvarlanmaz, 50,98 → 50); metre olarak girilen toplar aynen kalır. Tutar bu metre üzerinden hesaplanır (2.22.1).
- Kalıp metre fiyatı işe özeldir (`patternGroups[].pricePerMeter`), kalıp kütüphanesinde tutulmaz.
- İş kartı listesinde perspektif kartın kendisindedir (`perspective(1000px) rotateX(4deg)`); `.cards` kabına perspektif verme, yoksa uzun listede kartlar büyüyüp üst üste biner.
- Klavye açıkken küre yeniden boyutlanmaz; `backdrop-filter` kullanılmaz (titreme).

## Kaldırılanlar (kullanıcı istemedikçe geri ekleme)
- Dil balonlarının üstündeki animasyonlu kedi (2.17.0). Uzay kedisi ve mini oyunlar duruyor.
- Menü çekip bırakma animasyonundaki alt bildirim yazıları (2.12.2).
- Ayrı "Aktif İşler", "Teslim Edilen", "Yeni Müşteri", "Hakkında" düğümleri (2.1.0).
- Ayarlar'da dil seçeneği (dil yalnızca küre ekranındaki balonlarla seçilir).
