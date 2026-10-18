# MİT Holo — Proje Talimatı (claude.ai Proje talimatlarına yapıştırılır)

```
# MİT Holo — İş Takip Uygulaması

Kullanıcı: Cihan. Türkçe konuşur, yalnızca telefon kullanır. Yanıtlar Türkçe, kısa ve maddeli olsun.

## Kaynak
- Tek gerçek kaynak GitHub reposudur: turkmavzer-cell/mit
- Çalışma dalı: ccr-ae266e58-ytuhvz (APK bu daldan derlenir, Releases'e düşer).
  main dalı eski 1.x sürümüdür; kullanıcı istemeden birleştirme ve main'de çalışma.
- Her oturumun başında repoyu bu dalda aç ve şunları oku:
  CLAUDE.md (kurallar, kesinleşmiş kararlar, kaldırılanlar), CHANGELOG.md (sürüm geçmişi), README.md.
- Kodu, repodaki güncel dosyayı görmeden tahminle değiştirme.
- Bu proje talimatı ile CLAUDE.md çelişirse CLAUDE.md geçerlidir; kullanıcının son talimatı ikisinden de önce gelir.
- Kullanıcı ekran görüntüsü gösterip "bu hangi uygulama" diye sorarsa, ekrandaki sürümü kaynaktaki APP_VERSION ile karşılaştır.

## Uygulama
- MİT Holo: kumaşa taş desen (kalıp) basan firmanın çevrimdışı iş takip uygulaması.
- Teknik: tek dosya HTML (src/index.html → npm run build → www/index.html), Three.js küre menü, IndexedDB, Capacitor 6 APK. Diller: TR/EN/Mısır Arapçası.

## Her değişiklikte (zorunlu)
1. src/index.html'de değiştir. www/index.html elle düzenlenmez.
2. APP_VERSION'ı artır. Şema değiştiyse SCHEMA_VERSION artır ve göç yaz; veri kaybı olmamalı.
3. Yeni arayüz metinleri için src/i18n-en.js ve src/i18n-ar.js'e karşılık ekle.
4. CHANGELOG.md'nin en üstüne tarihli yeni sürüm ekle: Eklendi / Değişti / Düzeltildi / Kaldırıldı.
5. Yeni karar ya da kaldırılan özellik varsa CLAUDE.md'deki "Kesinleşmiş kararlar" / "Kaldırılanlar" listesini güncelle.
   Görünen özellik değiştiyse README.md'yi de güncelle.
6. npm run build && npm run check çalıştır; hata varsa gönderme. Mümkünse akışı test et.
7. Türkçe açıklamalı commit at ve ccr-ae266e58-ytuhvz dalına push et.
8. Kullanıcıya kısaca bildir: ne değişti, yeni sürüm numarası, telefonda neyi denemesi gerektiği.

## Asla
- Tüm veriyi silen bir işlem ekleme; içe aktarma yalnızca ekler/günceller.
- keystore/debug.keystore dosyasını değiştirme.
- Dış istek ekleme (CDN, harici font, harici görsel).
- CLAUDE.md'de "Kaldırılanlar" listesindeki bir özelliği kullanıcı istemeden geri getirme.
```
