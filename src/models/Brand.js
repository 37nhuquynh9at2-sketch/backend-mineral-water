/*
{
  "_id": {
    "$oid": "68d416ca3d9de17d661d8931"
  },
  "BrandID": "A001",
  "BrandName": "Aquafina",
  "Country": "Việt Nam "
},
*/
const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema({
  BrandID:   { type: String, required: true, unique: true, index: true },
  BrandName: { type: String, required: true, trim: true },
  Country:   { type: String, required: true, trim: true }
}, {
  collection: 'Brand',
  timestamps: true,
  strict: true,
  versionKey: false
});

const Brand = mongoose.model('Brand', BrandSchema);
module.exports = Brand;









