# Kampüs Etkinlikleri — Backend REST API (Sprint 9: PATCH, DELETE ve Sorgular)

- **Öğrenci Adı:** Engin Dağlayan  
- **Öğrenci Numarası:** 2416501069  

Bu proje, Kampüs Etkinlikleri platformunun Express ve Mongoose tabanlı RESTful API sunucusudur. Sprint 9 kapsamında PATCH, DELETE ve gelişmiş sorgu (arama, filtre, yaklaşan etkinlikler) desteği eklenmiştir. Tarih formatı `GG-AA-YYYY` olarak güncellenmiştir.

---

## 🚀 Kurulum ve Çalıştırma

### 1. Bağımlılıkları Yükleme
```bash
cd backend
npm install
```

### 2. Veritabanını Doldurma (Seed)
Koleksiyonu sıfırlar ve 6 başlangıç etkinliğini ekler (en az 2 geçmiş tarihli):
```bash
npm run seed
```

### 3. Geliştirme Sunucusunu Başlatma
```bash
npm run dev
```
Sunucu varsayılan olarak `http://localhost:3000` adresinde çalışır.

### 4. Newman ile Test
```bash
newman run https://webdersi.vercel.app/test.json
```
Hedef: **18 istek, 45 test, 0 hata**

---

## ⚙️ Ortam Değişkenleri (.env)

| Değişken | Açıklama | Varsayılan Değer |
|---|---|---|
| `PORT` | API sunucusunun çalışacağı port | `3000` |
| `MONGODB_URI` | MongoDB bağlantı dizesi (Yerel veya Atlas) | `mongodb://127.0.0.1:27017/kampus` |

Örnek `.env` dosyası: `.env.example`  
Gerçek `.env` ve `node_modules` `.gitignore` ile korunmaktadır.

---

## 🗄️ Tarih Formatı

API her yerde `"GG-AA-YYYY"` biçimini kullanır (ör. `"15-10-2026"`).  
Veritabanında gerçek `Date` tipinde saklanır; getter ile `"GG-AA-YYYY"` döner.

---

## 📜 REST API Sözleşmesi

| Yöntem | Endpoint | Başarılı | Hata | Durum |
|---|---|---|---|---|
| `GET` | `/health` | `200` | — | çalışıyor |
| `GET` | `/events ?search= & ?category=` | `200` | — | çalışıyor |
| `GET` | `/events/upcoming` | `200` · tarihe göre sıralı | — | çalışıyor |
| `GET` | `/events/:id` | `200` | `404` | çalışıyor |
| `POST` | `/events` | `201` | `400` | çalışıyor |
| `PATCH` | `/events/:id` | `200` · güncel kayıt | `400`, `404` | çalışıyor |
| `DELETE` | `/events/:id` | `204` · gövde yok | `404` | çalışıyor |

Hata biçimi: `{ "error": { "message": "…" } }`  
Geçersiz ya da olmayan id her yerde → `404`

---

## ⚠️ Hata Yanıtları

```json
{
  "error": {
    "message": "Hata açıklaması"
  }
}
```

---

## 📁 Proje Yapısı

```
backend/
  src/
    utils/date.js            ← GG-AA-YYYY ↔ Date dönüşümü
    data/seed-events.js      ← Seed verisi (geçmiş tarihli etkinlikler dahil)
    models/event.js          ← Mongoose şeması (date: Date tipinde)
    controllers/event-controller.js  ← Tüm route handler'lar
    routes/event-routes.js   ← Route tanımları (sıra önemli!)
    app.js                   ← Express uygulaması
    server.js                ← Sunucu başlatma
    seed.js                  ← Seed script
    db.js                    ← MongoDB bağlantısı
  requests/
    kampus-api.json          ← Postman koleksiyonu
    run-results.json         ← Newman çalıştırma sonuçları
  .env.example
  .gitignore
  package.json
  README.md
```
