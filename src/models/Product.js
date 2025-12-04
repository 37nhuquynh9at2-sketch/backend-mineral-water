/*
{
  "_id": {
    "$oid": "68dd4ffec44c95add890e738"
  },
  "ProductID": "TB500",
  "BrandID": "G002",
  "SupplierID": "GG02",
  "ProductName": "Nước khoáng Thạch Bích 500ml",
  "Volume": "500ml",
  "Price": "5.500đ/chai",
  "ExpiryDate": "24 tháng kể từ ngày sản xuất",
  "ImageURL": "https://thachbich.com.vn/wp-content/uploads/2018/08/Thach-Bich-500ml-164x300.png"
}
*/

// models/Product.js
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

// ✅ Schema cho Composition (embedded) - QUAN HỆ 1:1
const CompositionSchema = new mongoose.Schema({
  CompID:             { type: String, trim: true },
  MineralComposition: { type: String, required: true, trim: true },
  pHRange:            { type: String, trim: true }
}, { _id: false });

// Schema cho CareInstruction
const CareInstructionSchema = new mongoose.Schema({
  step: { type: Number, min: 1 },
  text: { type: String, required: true, trim: true }
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  ProductID:  { type: String, required: true, match: /^[A-Za-z0-9_-]{1,32}$/, unique: true, index: true },
  qrCode:     { type: String, required: true, unique: true, index: true },
  name:       { type: String, required: true, trim: true },
  BrandID:    { type: String, required: true, index: true },
  SupplierID: { type: String, required: true, index: true },

  composition:      { type: CompositionSchema, default: null },
  careInstructions: { type: [CareInstructionSchema], default: [] },

  volumeMl: { type: mongoose.Schema.Types.Decimal128 },
  images:   { type: [String], default: [] },
  country:  { type: String, trim: true }
}, {
  collection: 'Product',
  timestamps: true,
  strict: true,
  versionKey: false
});

// Index bổ sung
ProductSchema.index({ BrandID: 1 }, { name: 'ix_Product_BrandID' });
ProductSchema.index({ SupplierID: 1 }, { name: 'ix_Product_SupplierID' });

// Validator
ProductSchema.pre(['updateOne','findOneAndUpdate','updateMany'], function () {
  this.setOptions({ runValidators: true, context: 'query' });
});

// ✅ Export model như cũ
module.exports = mongoose.model('Product', ProductSchema);