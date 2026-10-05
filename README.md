# MİT Holo — Müşteri & İmalat İş Takip Asistanı

Tekstil/konfeksiyon atölyesi için çevrimdışı çalışan iş takip uygulaması.
Hologram küre arayüzü (Three.js), Android APK (Capacitor 6).

## Neden yeni sürüm?
Eski MİT (1.x) tüm kayıtları ve fotoğrafları `localStorage` içinde tek bir kayıtta tutuyordu.
~5 MB sınırı dolunca kayıt **sessizce** başarısız oluyordu: yeni işler kaydedilmiyor,
silinen işler uygulama yeniden açılınca geri geliyordu.

MİT Holo'da:
- Veriler **IndexedDB**'de, müşteri başına ayrı kayıt olarak tutulur.
- Fotoğraflar ayrı depoda; işte yalnızca fotoğraf kimliği saklanır.
- Her yazma kontrol edilir; hata olursa ekranda uyarı çıkar.
- Yedekleme ekranında kullanılan depolama alanı görünür.
- **Otomatik yedek:** APK sormadan `Belgeler/MIT-Holo/mit-holo-otomatik-yedek.json` dosyasına yazar
  (açılışta günde bir, uygulama arka plana geçerken değişiklik varsa); her seferinde eskisinin üzerine kaydeder.
- Küre ortasında: işi olan müşteri sayısı, baskı bekleyen ve baskısı yapılan iş sayısı.

## Menü (küre düğümleri)
| Düğüm | İçerik |
|---|---|
| İşler | Haftalık/aylık metraj, arama, İmalatta / Teslim Edildi sekmeleri (baskı bekleyenler üstte), + yeni iş |
| Müşteriler | + yeni müşteri, arama, 5 sıralama, müşteri detayı (Ara, Konum, İmalatta/Teslim sekmeleri, + Yeni İş, düzenle, sil) |
| Kalıplar | Kalıp kütüphanesi (ad + fotoğraf, düzenle, sil) |
| Rapor | Bu hafta / bu ay / geçen ay: metraj, yeni ve teslim edilen iş, müşteri ve kalıp dağılımı, görsel olarak paylaş |
| Yedekleme | Otomatik yedek durumu, yedeği paylaş (fotoğraflar dahil), yedekten geri yükle (yalnızca eksikleri ekler) |
| Ayarlar | Tema (koyu / açık gün doğumu), ses, titreşim, otomatik yedek, asteroit olayı, günlük yedek hatırlatıcısı, uzay kedisi, hakkında |

İş formu: durum (imalatta/teslim), baskı durumu, kumaş türü/rengi/gramajı, atanmamış toplar,
kalıp grupları (metre/kilo topları, uzun basınca düzenleme), kalıba top gönderme,
notlar, 25 fotoğrafa kadar, iş özeti görseli paylaşma.

## Eski uygulamadan veri aktarma
1. Eski MİT → Ayarlar → Veri Yedekleme → **Yedekle**, dosyayı telefona kaydet.
2. MİT Holo → Yedekleme → **Yedek Dosyası Seç** → o dosyayı aç.

İki uygulama ayrı kimlikle (`com.turkmavzercell.mitholo`) kurulur; eski uygulama silinmez.

## APK
GitHub Actions (`.github/workflows/build-apk.yml`) her push'ta APK üretir:
- **Releases** sayfası → `MIT-Holo-v2.0.N.apk` (telefondan doğrudan indirilebilir)
- veya Actions → çalışma → Artifacts → `mit-holo-apk`

İmza anahtarı `keystore/debug.keystore` sabittir (SHA-256: `c228769ce531c4fc9009088f168c464b2e4ab9ce1f69d8a8b1cf314e20c38719`).
Derleme bu anahtarı Gradle'a açıkça bağlar ve APK'nın imzasını doğrular; uyuşmazsa derleme başarısız olur.
Her Release açıklamasında APK'nın imza özeti yazar. Yeni sürümler eskisinin üstüne kurulur, veri silinmez.

**"Paket, mevcut bir paketle çakıştığından uygulama yüklenemedi" hatası:** telefondaki uygulama başka bir anahtarla
imzalanmış demektir (ör. bu düzeltmeden önceki bir derleme). Bir kereye mahsus: Yedekleme → yedeği paylaş ile yedek al,
uygulamayı kaldır, yeni APK'yı kur, Yedekleme → yedekten geri yükle. Sonraki tüm güncellemeler üstüne kurulur.

## Geliştirme
- Kaynak: `src/index.html` (tek dosya; bölümler: VERİ · SES · KÜRE · PANELLER · EKRANLAR · OYUNLAR · BAŞLAT)
- Derleme: `npm ci && npm run build` → `www/index.html` (Three.js r149 ve Exo 2 gömülür, dış istek yok)
- Kontrol: `npm run check`
