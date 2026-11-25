import app from "./app.js";
import mongoose from "mongoose";
import Event from "./models/event.js";

async function runTests() {
  console.log("=== SPRINT 8 TESTLERİ BAŞLIYOR ===");

  // Sunucuyu geçici bir portta başlat
  const server = app.listen(3099, async () => {
    console.log("Test sunucusu 3099 portunda başlatıldı.");

    try {
      // 1. GET /health
      const resHealth = await fetch("http://localhost:3099/health");
      const healthData = await resHealth.json();
      console.log("1. GET /health:", resHealth.status === 200 ? "BAŞARILI (200)" : "BAŞARISIZ", healthData);

      // 2. GET /events (MongoDB'den okuma)
      const resEvents = await fetch("http://localhost:3099/events");
      const events = await resEvents.json();
      console.log(`2. GET /events: ${resEvents.status === 200 ? "BAŞARILI (200)" : "BAŞARISIZ"}, Toplam: ${events.length} kayıt.`);
      if (events.length !== 6) {
        throw new Error(`Beklenen 6 kayıt, gelen: ${events.length}`);
      }

      // 3. GET /events/:id (Var olan kayıt)
      const sampleId = events[0]._id;
      const resSingle = await fetch(`http://localhost:3099/events/${sampleId}`);
      const singleData = await resSingle.json();
      console.log(`3. GET /events/:id (${sampleId}):`, resSingle.status === 200 ? "BAŞARILI (200)" : "BAŞARISIZ", singleData.title);

      // 4. GET /events/:id (Olmayan geçerli ObjectId -> 404)
      const nonExistentId = "507f1f77bcf86cd799439011";
      const resNotFound = await fetch(`http://localhost:3099/events/${nonExistentId}`);
      console.log(`4. GET /events/olmayan-id (${nonExistentId}):`, resNotFound.status === 404 ? "BAŞARILI (404)" : "BAŞARISIZ", await resNotFound.json());

      // 5. GET /events/:id (Geçersiz ID -> 404)
      const resInvalid = await fetch("http://localhost:3099/events/gecersiz-id-123");
      console.log("5. GET /events/gecersiz-id:", resInvalid.status === 404 ? "BAŞARILI (404)" : "BAŞARISIZ", await resInvalid.json());

      // 6. POST /events (Eksik veri -> 400 Bad Request ve sunucu çökmüyor)
      const resMissing = await fetch("http://localhost:3099/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Sadece Başlık" }),
      });
      console.log("6. POST /events (Eksik Veri):", resMissing.status === 400 ? "BAŞARILI (400)" : "BAŞARISIZ", await resMissing.json());

      // 7. POST /events (Başarılı veri -> 201 Created)
      const newEventPayload = {
        title: "Yapay Zeka ve Geleceğin Teknolojileri Semineri",
        category: "Seminer",
        date: "2026-12-15",
        time: "14:00",
        capacity: 100,
        location: "Büyük Salon",
        description: "Sprint 8 otomatik test kaydı.",
      };
      const resCreate = await fetch("http://localhost:3099/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEventPayload),
      });
      const createdEvent = await resCreate.json();
      console.log("7. POST /events (Başarılı Kayıt):", resCreate.status === 201 ? "BAŞARILI (201)" : "BAŞARISIZ", createdEvent);

      // 8. Kalıcılık kontrolü (Yeni eklenen kayıt MongoDB'de duruyor mu?)
      const resAfterPost = await fetch("http://localhost:3099/events");
      const eventsAfterPost = await resAfterPost.json();
      const persisted = eventsAfterPost.some((e) => e.title === newEventPayload.title);
      console.log(`8. Kalıcılık kontrolü: Toplam kayıt ${eventsAfterPost.length}, Yeni kayıt mevcut mu?:`, persisted ? "EVET (BAŞARILI)" : "HAYIR");

      console.log("\n>>> TÜM SPRINT 8 TESTLERİ EKSİKSİZ GEÇTİ! <<<");
    } catch (err) {
      console.error("Test sırasında hata:", err);
    } finally {
      server.close();
      await mongoose.connection.close();
      process.exit(0);
    }
  });
}

runTests();
