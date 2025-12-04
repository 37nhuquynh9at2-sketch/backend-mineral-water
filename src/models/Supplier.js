/*
{
  "_id": {
    "$oid": "68d417043d9de17d661d9555"
  },
  "SupplierID": "AA01",
  "SupplierName": "Suntory PepsiCo Việt Nam",
  "Address": "Cao ốc Sheraton, số 88 đường Đồng Khởi, Phường Bến Nghé, Quận 1, TP. HCM",
  "Contact": " (84-28) 3821 9437"
},
*/
const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  SupplierID:   { type: String, required: true, unique: true, index: true },
  SupplierName: { type: String, required: true, trim: true },
  Address:      { type: String, required: true, trim: true },
  Contact:      { type: String, required: true, trim: true }
}, {
  collection: 'Supplier',
  timestamps: true,
  strict: true,
  versionKey: false
});

const Supplier = mongoose.model('Supplier', SupplierSchema);
module.exports = Supplier;


