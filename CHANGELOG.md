# MİT Holo — Değişiklik Günlüğü

Her sürüm: **Eklendi** · **Değişti** · **Düzeltildi** · **Kaldırıldı**. En yeni sürüm en üstte.
Geliştirme dalı: `ccr-ae266e58-ytuhvz` (APK bu daldan derlenir). `main` eski 1.x sürümünde kaldı.

## 2.25.0 — 2026-11-14
- **Eklendi:** İrsaliyeler ekranına **Ara** düğmesi ve arama çubuğu; müşteri adı, toplam tutar, tarih, irsaliye numarası ve kalıp ismine göre (Türkçe karakter duyarsız ve çoklu kelime destekli) anlık irsaliye arama ve ödenmeyen/ödenen sekmeleri arasında filtreleme.

## 2.24.1 — 2026-11-14
- **Değişti:** Ana ekranda sadeleştirme — ikinci (sol üst) ödenenler butonu kaldırıldı; yalnızca tek **İrsaliyeler** gezegeni (`#waybill-planet`) kalır ve üzerinde sadece **ödenmemiş irsaliye sayısı** gösterilir.
- **Değişti:** Aynı İrsaliyeler menüsü içinde **Ödenmeyenler** ve **Ödenenler** sekmeleri birleştirildi; üst bilgi ve sekmelerde yalnızca ödenmemiş irsaliye adedi gösterilir, ödenenler sayısı gösterilmez.

## 2.24.0 — 2026-11-14
- **Eklendi:** Ödeme alınan faturalar silinmeden **Ödenenler** sekmesine atanır ve tüm faturalar ödense bile ana ekrandaki irsaliye butonu `0` durumunda sakin tonda görünmeye devam eder.

## 2.23.0 — 2026-11-12
- **Eklendi:** Ana arayüzde gezegenin dışında bağımsız **İrsaliye Gezegeni** (`#waybill-planet`). Ana kürenin dönüşüne bağlı olmadan harici yörüngede parlar ve ödenmemiş (tahsil edilmemiş) irsaliye sayısını gösterir.
- **Eklendi:** **İrsaliye ve Fatura Takibi Menüsü** (`Screens.waybills`). Ödenmemiş faturaları, toplam metrajı ve toplam tutarı listeler; "İrsaliyeyi Gör" ile belgeyi açma/paylaşma ve "Ödendi" butonu ile faturayı ödenmiş yapıp listeden kaldırma desteği sunar.
- **Eklendi:** **Otomatik Fatura Senkronizasyonu**. İşler sekmesinde bir işte fiyat, metre veya kumaş gramajı düzenlendiğinde, eğer aynı işin faturası ödenmeyenler listesindeyse irsaliye otomatik olarak yeni fiyat ve metrelerle güncellenir.
- **Eklendi:** Her kalıp içinde bağımsız **1 metre kumaşın gramajı (1 mt Gramı)** giriş kutusu eklendi. Metre fiyatının yanına yerleştirildi; kilo girilen toplar kalıbın kendi gramajına göre anında metreye çevrilir.
- **Kaldırıldı:** İş detayındaki genel gramaj alanı ve "Atanmamış Toplar" çekmecesi kaldırıldı.
- **Değişti:** Kurulum sırasında telefon uygulamasının adı "mit" olarak güncellendi (`capacitor.config.json` appName: "mit").

## 2.22.2 — 2026-10-18
- **Değişti:** İrsaliyede her kalıbın metresi tam sayıdır: metre ya da kilo fark etmeksizin kalıp toplamının küsuratı atılır (100,5 → 100; 50,98 → 50). Tutar bu metreyle hesaplanır.
- **Not:** Küsuratlı metresi olan, irsaliyesi oluşturulmuş ama teslim edilmemiş işlerde irsaliye yeniden oluşturulmalıdır.

## 2.22.1 — 2026-10-18
- **Değişti:** İrsaliyede ve kalıp tutarında, kilodan metreye çevrilen miktarın küsuratı atılır (50,98 mt → 50 mt; yuvarlama yok). Metre olarak girilen toplar olduğu gibi kalır.
- **Not:** Kilo topu olan işlerde daha önce oluşturulmuş irsaliye (henüz teslim edilmemişse) yeniden oluşturulmalıdır.

## 2.22.0 — 2026-10-18
- **Eklendi:** Ayarlar'da **Firma Bilgileri** (firma adı, isteğe bağlı para birimi).
- **Eklendi:** İş formunda her kalıba **Metre Fiyatı** ve tutar (kalıp başına ayrı fiyat).
- **Eklendi:** **İrsaliye.** İmalattaki işte "İrsaliye Oluştur" ve "Teslim Edildi" düğmeleri yan yana.
  - İrsaliye oluşturulmadan iş teslim edilemez.
  - Eksik firma adı, fiyat veya metre ya da atanmamış top varsa irsaliye oluşmaz ve uyarı verir.
  - İrsaliyeden sonra metre veya fiyat değişirse irsaliye yeniden oluşturulmalıdır; numara aynı kalır.
  - İrsaliye görseli: müşteri, işi yapan firma, kalıp · metre · birim fiyat · tutar, toplam. Ekranda gösterilir, `Belgeler/MIT-Holo/Irsaliyeler/` klasörüne PNG kaydedilir, paylaşılabilir.
  - İrsaliye numaraları sıralı ilerler (`Meta.waybillSeq`).
- **Değişti:** Şema 3 (`pricePerMeter`, `waybill`). QR ile güncellemede kalıp fiyatları korunur.
- **Değişti:** Fatura hatırlatma düğmesinin metni kısaldı ("Fatura kestin mi? Tekrar dokun").
- **Düzeltildi:** İş listesi uzayınca kartların büyüyüp üst üste binmesi (perspektif listeden karta taşındı).

## 2.21.0 — 2026-10-08
- **Eklendi:** İşin müşterisini değiştirme (iş formunda "Müşteriyi değiştir", geri alma); Ayarlar'da açma/kapama.

## 2.20.0 — 2026-10-06
- **Eklendi:** 5 yeni oyun: Trafik Yarışı, Tuğla Kır, Sayı Birleştir, Hızlı Hesap, Refleks Avı.

## 2.19.0 — 2026-10-06
- **Eklendi:** Müşterisiz iş. Müşteri girmeden iş eklenir, sonradan müşteriye atanır. Sistem müşterisi sayımlara katılmaz.

## 2.18.0 — 2026-10-06
- **Eklendi:** QR ile iş paylaşımı. İş özetinden çok parçalı QR gösterilir; İşler'de kamerayla alınır, onayla eklenir veya güncellenir.

## 2.17.2 — 2026-10-06
- **Düzeltildi:** Klavye açılıp kapanınca kürenin büyümesi.

## 2.17.1 — 2026-10-05
- **Düzeltildi:** Dil balonu seçilirken kareye dönme (.pick sınıf çakışması).

## 2.17.0 — 2026-10-05
- **Değişti:** Dil geçişi tüm yönlerde düzeltildi (EN↔AR dahil); nefes alan dil balonları, balondan şok dalgasıyla dil değişimi.
- **Kaldırıldı:** Dil balonlarının üstündeki animasyonlu kedi (iskelet/IK yürüyüş, zıplama, kaçış). *Uzay kedisi (Ayarlar'daki açma/kapama, mini oyun) duruyor.*

## 2.16.0 / 2.15.0 / 2.14.0 — 2026-10-05
- **Eklendi:** İngilizce dil ve dil küreleri.
- **Eklendi, sonra kaldırıldı:** Dil kürelerinin üstündeki kedi animasyonu (2.17.0'da kaldırıldı).

## 2.13.0 — 2026-10-05
- **Eklendi:** Mısır Arapçası (RTL) ve küre ekranında animasyonlu dil anahtarı.

## 2.12.x — 2026-10-05
- **Değişti:** Gezegen Patlat'ta sabit yükselme var, bomba yok. Uzay Savaşı'nda sınırlar, düşman canı ve dar mermi demeti.
- **Kaldırıldı:** Menü çekip bırakma animasyonunda alttaki bildirim yazıları.
- **Değişti:** APK imzası sabit anahtara açıkça bağlandı; derleme imzayı doğrular.

## 2.11.0 — 2026-10-05
- **Değişti:** Gezegen Patlat kesme oyunu oldu; Uzay Savaşı'nda kademeli güçlendirme.

## 2.10.0 / 2.9.0 — 2026-10-04
- **Eklendi:** Seviyeli hızlanma; Yılan ve Uzay Savaşı oyunları.
- **Düzeltildi:** Oyun sırası, hız ve asteroit dağılması.

## 2.8.x — 2026-10-04
- **Eklendi:** Menü düğümünü basılı tutup çekme; bırakınca çarpışma ve yörünge bozulması (3 sn).

## 2.7.0 — 2026-10-04
- **Eklendi:** Teslim öncesi fatura uyarısı (iki dokunuşla teslim).

## 2.6.0 — 2026-10-04
- **Eklendi:** Asteroit olayı: uyarı, geri sayım, roketle yok etme, çarpma ve toparlanma.

## 2.5.0 — 2026-10-04
- **Değişti:** Oyunlar temaya uyumlu hale getirildi, kontroller kolaylaştırıldı.

## 2.4.0 — 2026-10-04
- **Eklendi:** Tema: koyu (gece) / açık (gün doğumu).

## 2.3.0 — 2026-10-04
- **Eklendi:** Otomatik yedek (`Belgeler/MIT-Holo/`), Rapor düğümü, iş kartında paylaş. Sayılar küre ortasına döndü.

## 2.2.0 — 2026-10-04
- **Eklendi:** Ana ekran sayıları: işi olan müşteri, baskı bekleyen ve baskısı yapılan iş.

## 2.1.0 — 2026-10-04
- **Değişti:** Menü 8 düğümden 5'e indi.
- **Kaldırıldı:** "Aktif İşler", "Teslim Edilen", "Yeni Müşteri" ve "Hakkında" düğümleri. Hepsi İşler, Müşteriler ve Ayarlar içine taşındı.

## 2.0.0 — 2026-10-04
- **Eklendi:** MİT Holo. Hologram küre arayüzü (Three.js); veri localStorage yerine IndexedDB'de. Eski 1.x verisi otomatik aktarılır.

## 1.x — 2026-09-01
- React/Vite tabanlı ilk MİT (localStorage). `main` dalında duruyor.
