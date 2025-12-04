// ------------------------ Import Packages ------------------------
require("dotenv").config({ path: "../.env" });

const express = require("express");
//const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { connectDB } = require("./config/db");
const path = require('path');

// ------------------------ Import Routers ------------------------
const productRouter = require("./routes/productRouter");
const brandRouter = require("./routes/brandRouter");
const supplierRouter = require("./routes/supplierRouter");
const careinstructionRouter = require("./routes/careinstructionRouter");



// ------------------------ Connect Database ------------------------
(async () => {
  try {
    await connectDB();
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
})();

// ------------------------ Initialize App ------------------------
const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(express.static(path.join(__dirname, "public")));
// ------------------------ Middlewares ------------------------
//app.use(helmet());
/*app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  })
);*/
//app.use(cors());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 60_000, max: 120 }));


// ------------------------ Health Check ------------------------
app.get("/health", (_req, res) => res.json({ ok: true }));

// ------------------------ API Routes ------------------------

app.use("/api/products", productRouter);
app.use("/api/brands", brandRouter);
app.use("/api/suppliers", supplierRouter);
app.use("/api/careinstructions", careinstructionRouter);

app.get('/product/:ProductID', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// ------------------------ 404 Handler ------------------------
app.use((_req, res) => res.status(404).json({ error: "Not found" }));

// ------------------------ Error Handler ------------------------
app.use((err, _req, res, _next) => {
  console.error("⚠️ Error:", err.message);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

// ------------------------ Start Server ------------------------
app.listen(PORT, "0.0.0.0", () => console.log("Server running"));