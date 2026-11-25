import mongoose from "mongoose";
import "dotenv/config";
import Event from "./models/event.js";
import { seedEvents } from "./data/seed-events.js";

const dbURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/kampus";

async function seedDatabase() {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(dbURI);
    }
    console.log("MongoDB bağlandı (Atlas)");

    await Event.deleteMany({});
    console.log("Eski kayıtlar temizlendi.");

    const inserted = await Event.insertMany(seedEvents);
    console.log(`${inserted.length} etkinlik eklendi`);

    await mongoose.connection.close();
    console.log("Bağlantı kapatıldı.");
    process.exit(0);
  } catch (err) {
    console.error("Seed işlemi sırasında hata:", err);
    process.exit(1);
  }
}

seedDatabase();
