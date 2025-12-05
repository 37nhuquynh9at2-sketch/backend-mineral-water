require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");

async function runExplain() {
  await mongoose.connect(process.env.MONGODB_URI);

  const result = await Product.aggregate([
    { $match: { ProductID: "AQU500" } },
    {
      $lookup: {
        from: "Composition",
        localField: "ProductID",
        foreignField: "ProductID",
        as: "composition",
      },
    },
    { $unwind: "$composition" },
    {
      $lookup: {
        from: "CareInstruction",
        localField: "ProductID",
        foreignField: "ProductID",
        as: "careInstructions",
      },
    },
  ]).explain("executionStats");

  console.log(JSON.stringify(result, null, 2));

  await mongoose.disconnect();
}

runExplain();
