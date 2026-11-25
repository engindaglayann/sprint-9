# Kampüs Etkinlikleri — Sprint 9 (PATCH, DELETE ve Sorgular)

- **Öğrenci Adı:** Engin Dağlayan  
- **Öğrenci Numarası:** 2416501069  
- **Canlı Frontend Linki (Vercel):** [https://engindaglayan-frontend.vercel.app](https://engindaglayan-frontend.vercel.app)  

---

## 🏗️ Proje Mimarisi

Sprint 9 kapsamında CRUD döngüsü tamamlanmış; PATCH, DELETE (204 No Content), metin araması (`?search`), kategori filtresi (`?category`) ve yaklaşan etkinlikler (`/events/upcoming`) eklenmiştir. Tarih formatı API genelinde `"GG-AA-YYYY"` standardına geçirilmiştir.

```
sprint-09/
├── frontend/               # React + Vite
└── backend/                # Node.js + Express + Mongoose REST API (Port: 3000)
    ├── src/
    │   ├── app.js          # Express app, middleware ve route eşleşmeleri
    │   ├── server.js       # Sunucu başlatıcı (.env okur, portu dinler)
    │   ├── db.js           # Mongoose bağlantı modülü export'u
    │   ├── config/
    │   │   └── db.js       # DB modülü
    │   ├── utils/
    │   │   └── date.js     # GG-AA-YYYY ↔ Date dönüşüm ve todayStart yardımcıları
    │   ├── models/
    │   │   ├── db.js       # Ayrı veritabanı bağlantı modülü
    │   │   └── event.js    # Mongoose Event Şeması ve Modeli (Date tipi, getter/setter, kısıtlar)
    │   ├── routes/
    │   │   └── event-routes.js       # /events rotaları (upcoming, /:id'den önce)
    │   ├── controllers/
    │   │   └── event-controller.js   # getEvents, getUpcomingEvents, getEventById, createEvent, updateEvent, deleteEvent
    │   ├── seed.js         # npm run seed komutu ile 6 başlangıç kaydı ekleyen script
    │   └── data/
    │       └── seed-events.js # 6 etkinlik (en az 2 geçmiş tarihli, GG-AA-YYYY)
    ├── requests/
    │   ├── kampus-api.json # Postman Collection v2.1 (Sprint 9: 18 istek)
    │   └── run-results.json # Newman test çalıştırma sonuçları (18/18 istek, 45/45 test yeşil)
    ├── .env.example        # MONGODB_URI ve PORT örnek yapılandırması
    ├── .gitignore          # node_modules ve .env engellemesi
    ├── package.json        # Paket bağımlılıkları ve çalıştırma komutları
    └── README.md           # Backend REST API sözleşmesi ve çalıştırma kılavuzu
```

---

## 🚀 Hızlı Başlangıç

### Backend'i Çalıştırma
```bash
cd backend
npm install
npm run seed   # Veritabanına 6 başlangıç kaydını ekler (en az 2 geçmiş tarihli)
npm run dev    # Geliştirme sunucusunu başlatır
```
Sunucu `http://localhost:3000` adresinde çalışmaya başlar.

- Sağlık kontrolü: `http://localhost:3000/health`
- Tüm etkinlikler: `http://localhost:3000/events`
- Arama ve filtre: `http://localhost:3000/events?search=atölye&category=Atölye`
- Yaklaşan etkinlikler: `http://localhost:3000/events/upcoming`

### Testleri Çalıştırma (Newman)
Backend sunucusu çalışırken terminalde:
```bash
newman run https://webdersi.vercel.app/test.json
```
**Sonuç:** 18 istek, 45 test, 0 hata!

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

Hata yanıtı formatı:
```json
{
  "error": {
    "message": "…"
  }
}
```

---

## ✅ Sprint 9 Kontrol Listesi

- [x] **Adım 0 · Seed verisi:** `src/data/seed-events.js` içinde 6 etkinlikten 2'si geçmiş tarihli ("15-10-2026", "05-11-2026").
- [x] **Adım 1 · Tarih GG-AA-YYYY:** `src/utils/date.js` (`parseDate`, `formatDate`, `todayStart`), `models/event.js` içinde `Date` tipi, `set: parseDate`, `get: formatDate`, `toJSON: { getters: true }`.
- [x] **Adım 2 · Route sırası:** `/events/upcoming` rotası `/events/:id` rotasından önce tanımlandı.
- [x] **Adım 3 · PATCH /events/:id:** Sadece gönderilen alanları günceller; boş body (`400`), korunan alanlar `_id`, `createdAt`, `updatedAt`, `__v` (`400`), `returnDocument: "after"` ve `runValidators: true` ile çalışır.
- [x] **Adım 5 · DELETE /events/:id:** Başarılı silmede `204 No Content` (boş gövde); silinmiş veya olmayan id'de `404 Event not found`.
- [x] **Adım 6 · Arama ve Filtre:** `GET /events` `?category` ve `?search` (regex karakterleri kaçırılmış ve case-insensitive `$options: "i"`) sorgularını destekler; tarihe göre sıralı.
- [x] **Adım 7 · GET /events/upcoming:** Bugün ve sonrası etkinlikleri tarihe göre artan sıralar; geçmiş etkinlikler listede yer almaz.
- [x] **Adım 8 · Collection Runner & Newman:** Newman ile 18 istek, 45 testin tamamı 0 hata ile geçti ve sonuçlar `backend/requests/run-results.json` dosyasına kaydedildi.
