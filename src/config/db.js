// src/config/db.js
require("dotenv").config();
const mongoose = require("mongoose");

const COLL = {
  PRODUCTS: process.env.PRODUCTS_COLL || "Product",
  BRANDS: process.env.BRANDS_COLL || "Brand",
  SUPPLIERS: process.env.SUPPLIERS_COLL || "Supplier",
  COMPOSITIONS: process.env.COMPOSITIONS_COLL || "Composition",
  CARE: process.env.CARE_COLL || "CareInstruction",
};

function bindLogs(conn, label = "[DB]") {
  conn.on("connected", () => console.log(`${label} connected`));
  conn.on("error", (e) => console.error(`${label} error:`, e.message));
  conn.on("disconnected", () => console.warn(`${label} disconnected`));
}

// ========== ✅ Kết nối với READ-ONLY user ==========
// ========== Kết nối MongoDB (Local hoặc Cloud) ==========
async function connectDB() {
  // Ưu tiên dùng MONGODB_URI (cho production/cloud)
  // Nếu không có thì fallback sang MONGODB_URI_READONLY (local)
  const uri = process.env.MONGODB_URI || process.env.MONGODB_URI_READONLY;
  
  if (!uri) {
    throw new Error("❌ Missing MONGODB_URI or MONGODB_URI_READONLY in .env");
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    autoIndex: process.env.NODE_ENV !== "production",
  });

  bindLogs(mongoose.connection, "[DB]");
  
  // Log môi trường
  if (process.env.MONGODB_URI) {
    console.log("✅ Connected to Cloud MongoDB (Production)");
  } else {
    console.log("✅ Connected to Local MongoDB (Development)");
  }
}

// ------------------------ Exports ------------------------
module.exports = {
  connectDB,
  COLL,
};