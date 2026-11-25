# Kampüs Etkinlikleri — Sprint 8 (MongoDB ve Mongoose)

- **Öğrenci Adı:** Engin Dağlayan  
- **Öğrenci Numarası:** 2416501069  
- **Canlı Frontend Linki (Vercel):** [https://engindaglayan-frontend.vercel.app](https://engindaglayan-frontend.vercel.app)  

---

## 🏗️ Proje Mimarisi

Bu sprintte bellek içi (in-memory) veri yapısı kaldırılarak, **MongoDB ve Mongoose** ile kalıcı veri katmanı eklenmiştir:

```
sprint-08/
├── frontend/               # React + Vite (Port: 5173 / Vercel)
└── backend/                # Node.js + Express + Mongoose REST API (Port: 3000)
    ├── src/
    │   ├── app.js          # Express app, middleware ve route eşleşmeleri (db bağlantısını başlatır)
    │   ├── server.js       # Sunucu başlatıcı (.env okur, portu dinler)
    │   ├── db.js           # Mongoose bağlantı modülü export'u
    │   ├── models/
    │   │   ├── db.js       # Ayrı veritabanı bağlantı modülü ve yaşam döngüsü olayları
    │   │   └── event.js    # Mongoose Event Şeması ve Modeli (required, trim, timestamps, kısıtlar)
    │   ├── routes/
    │   │   └── event-routes.js       # /events rotaları
    │   ├── controllers/
    │   │   └── event-controller.js   # MongoDB async/await iş mantığı ve hata kontrolleri
    │   ├── seed.js         # npm run seed komutu ile 6 başlangıç kaydı ekleyen script
    │   ├── test-sprint8.js # Otomatik Sprint 8 kontrol ve doğrulama testleri
    │   └── data/
    │       └── events.js   # 6 özgün başlangıç etkinlik verisi
    ├── requests/
    │   └── kampus-api.json # Postman Collection v2.1 (Sprint 8 güncel istekleri)
    ├── .env                # MONGODB_URI ve PORT yerel yapılandırması
    ├── .env.example        # MONGODB_URI ve PORT örnek yapılandırması
    ├── .gitignore          # node_modules ve .env engellemesi
    ├── package.json        # Paket bağımlılıkları ve çalıştırma komutları (dev, start, seed, test)
    └── README.md           # Backend REST API sözleşmesi ve çalıştırma kılavuzu
```

---

## 🚀 Hızlı Başlangıç

### Backend'i Çalıştırma
```bash
cd backend
npm install
npm run seed   # Veritabanına 6 başlangıç kaydını ekler
npm run dev    # Geliştirme sunucusunu başlatır
```
Sunucu `http://localhost:3000` adresinde çalışmaya başlar.

- Sağlık kontrolü: `http://localhost:3000/health`
- Etkinlikler: `http://localhost:3000/events`

### Testleri Çalıştırma
```bash
cd backend
npm test
```

### Frontend'i Çalıştırma
```bash
cd frontend
npm install
npm run dev
```
Uygulama `http://localhost:5173` adresinde açılır.

---

## 📜 REST API Özeti

Detaylı sözleşme tablosu için [backend/README.md](file:///backend/README.md) dosyasına bakabilirsiniz.

| Yöntem | Endpoint | Açıklama | Başarılı | Hata |
|---|---|---|---|---|
| `GET` | `/health` | Sağlık kontrolü ve öğrenci no | 200 | — |
| `GET` | `/events` | MongoDB'den tüm etkinlik listesi (filtreleme destekler) | 200 | — |
| `GET` | `/events/:id` | MongoDB'den tek etkinlik detayı | 200 | 404 (Olmayan / Geçersiz ID) |
| `POST` | `/events` | MongoDB'ye yeni etkinlik ekleme (Kalıcı veri) | 201 | 400 (Eksik veri / Hatalı kısıt) |

---

## ✅ Sprint 8 Kontrol Listesi

- [x] **npm install + npm run dev çalışıyor:** Bağımlılıklar kurulu, sunucu `node --watch` ile sorunsuz çalışıyor.
- [x] **Bağlantı ayrı modülde, URI .env'den okunuyor, .env.example'da MONGODB_URI var:** `backend/src/models/db.js` ayrı modül olarak tasarlandı, `process.env.MONGODB_URI` üzerinden bağlanıyor, `.env.example` içinde `MONGODB_URI` tanımlı.
- [x] **Schema'da required, trim, timestamps ve en az bir kısıt var:** `Event` şemasında `required`, `trim`, `{ timestamps: true }`, `min: 0` (capacity), `minlength: 3` (title), `enum` (category) kısıtları uygulandı.
- [x] **npm run seed 6 kayıt ekliyor; iki kez çalışınca da 6 kayıt:** Idempotent seed scripti her çalıştığında koleksiyonu temizleyip tam 6 kayıt ekler.
- [x] **GET /events ve GET /events/:id MongoDB'den okuyor; olmayan ve geçersiz id 404:** MongoDB'den async/await ile okunuyor; `CastError` ve geçersiz ObjectId kontrolleriyle hem olmayan hem geçersiz ID'ler 404 döner.
- [x] **POST 201 dönüyor; eksik veri 400 dönüyor ve sunucu çökmüyor:** Doğru veride 201 döner, eksik/hatalı veride 400 döner ve hata yakalanarak sunucunun çökmesi engellenir.
- [x] **Sunucu yeniden başlayınca POST ile eklenen kayıt duruyor:** Veriler MongoDB'de kalıcı olarak saklandığı için sunucu yeniden başladığında silinmez.
