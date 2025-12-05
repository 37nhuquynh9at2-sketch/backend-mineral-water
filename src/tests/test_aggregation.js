// test_aggregation.js
require("dotenv").config();
const mongoose = require("mongoose");

const Product = require("../models/Product");
const Composition = require("../models/Composition");
const CareInstruction = require("../models/CareInstruction");

// ---------------------- AGGREGATION FUNCTION ----------------------
async function runAggregation() {
  return await Product.aggregate([
    { $match: { ProductID: "AQU500" } },

    {
      $lookup: {
        from: "Composition",
        localField: "ProductID",
        foreignField: "ProductID",
        as: "composition",
      },
    },
    { $unwind: { path: "$composition", preserveNullAndEmptyArrays: true } },

    {
      $lookup: {
        from: "CareInstruction",
        localField: "ProductID",
        foreignField: "ProductID",
        as: "careInstructions",
      },
    },
  ]);
}

// ---------------------- TEST RUNNER ----------------------
async function runTest() {
  console.log("🔗 Connecting to MongoDB...");

  await mongoose.connect(process.env.MONGODB_URI);

  console.log("Connected! Running test-case...\n");

  console.time("new_query");
  const result = await runAggregation();
  console.timeEnd("new_query");

  console.log("\nResult:");
  console.log(result);

  await mongoose.disconnect();
  console.log("\nDisconnected.");
}

runTest();
