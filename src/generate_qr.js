require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const { generateQRCodeFile } = require('./controllers/productController');
const Product = require('./models/Product');

async function main() {
    // Lấy connection string từ .env
    const uri = process.env.MONGODB_URI_READONLY || process.env.MONGODB_URI;
    
    if (!uri) {
        throw new Error("Missing MONGODB_URI_READONLY in .env file");
    }
    
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000 // 10 giây timeout cho cloud DB
    });
    console.log("[DB] Connected successfully");

    // Lấy tất cả sản phẩm
    const products = await Product.find();
    console.log(`Found ${products.length} products`);

    // Generate QR cho từng sản phẩm
    for (const p of products) {
        try {
            console.log(`Generating QR for: ${p.ProductID}`);
            await generateQRCodeFile(p.ProductID);
            console.log(`QR created for: ${p.ProductID}`);
        } catch (err) {
            console.error(`Failed to generate QR for ${p.ProductID}:`, err.message);
        }
    }

    console.log("\nDone generating all QR codes");
    console.log(`QR codes saved to: src/public/qrcodes/`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
}

main().catch(err => {
    console.error("Error:", err);
    process.exit(1);
});