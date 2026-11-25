import mongoose from "mongoose";
import "dotenv/config";

const dbURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/kampus";

mongoose.connect(dbURI);

mongoose.connection.on("connected", () => {
  console.log(`Mongoose ${dbURI} adresindeki veritabanına bağlandı`);
});

mongoose.connection.on("error", (err) => {
  console.log("Mongoose bağlantı hatası: " + err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose bağlantısı kesildi");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("Uygulama kapatıldı, Mongoose bağlantısı sonlandırıldı.");
  process.exit(0);
});

export default mongoose;
