/*
{
  "_id": {
    "$oid": "68d416dd3d9de17d661d8d3e"
  },
  "ProductID ": "AQU500 ",
  "CompID": "CO1",
  "MineralComposition": "Nước tinh khiết, TDS < 50 mg/L; nguồn thủy cục; loại nước mềm; Hydro-7.",
  "Nồng độ pH": "6.0 – 7..0"
},
*/
// models/Composition.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const trim = (v) => (typeof v === 'string' ? v.trim() : v);

const CompositionSchema = new Schema(
  {
    ProductID:          { type: String, required: true, set: trim, trim: true, index: true },
    CompID:             { type: String, set: trim, trim: true },
    MineralComposition: { type: String, required: true, set: trim, trim: true },
    pHRange:            { type: String, set: trim, trim: true },
  },
  {
    collection: 'Composition',
    timestamps: true,
    strict: true,
    versionKey: false,
  }
);

const Composition = mongoose.model('Composition', CompositionSchema); 
module.exports = Composition; 

