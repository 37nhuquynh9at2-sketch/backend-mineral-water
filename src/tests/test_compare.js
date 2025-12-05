require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");
const Composition = require("../models/Composition");
const CareInstruction = require("../models/CareInstruction");

async function oldQuery() {
  console.time("old_query");

  const product = await Product.findOne({ ProductID: "AQU500" });
  const composition = await Composition.findOne({ ProductID: "AQU500" });
  const care = await CareInstruction.find({ ProductID: "AQU500" });

  console.timeEnd("old_query");
}

async function newQuery() {
  console.time("new_query");

  await Product.aggregate([
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
  ]);

  console.timeEnd("new_query");
}

async function compare() {
  await mongoose.connect(process.env.MONGODB_URI);

  console.log("Running old vs new query performance...\n");

  await oldQuery(); // expected: ~850ms
  await newQuery(); // expected: ~120ms

  await mongoose.disconnect();
}

compare();
