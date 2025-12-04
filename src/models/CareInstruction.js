/*
{
  "_id": {
    "$oid": "68d416ee3d9de17d661d9148"
  },
  "InstructionID ": "IN01",
  "ProductID ": "AQU500 ",
  "InstructionText": "Để ở nơi khô ráo và thoáng mát, tránh nơi có nhiệt độ cao và đặc biệt không để tiếp xúc trực tiếp với ánh nắng mặt trời. Khi chưa sử dụng hết, cần đóng nắp kín và bảo quản ở nhiệt độ thường hoặc tủ mát có nhiệt độ từ 5 -10 độ C."
},
*/
const mongoose = require('mongoose');
const { Schema } = mongoose;

const trim = (v) => (typeof v === 'string' ? v.trim() : v);

const CareInstructionSchema = new Schema(
  {
    InstructionID:   { type: String, set: trim, trim: true },
    ProductID:       { type: String, required: true, set: trim, trim: true, index: true },
    InstructionText: { type: String, required: true, set: trim, trim: true },
  },
  {
    collection: 'CareInstruction',
    timestamps: true,
    strict: true,
    versionKey: false,
  }
);

const CareInstruction = mongoose.model('CareInstruction', CareInstructionSchema);
module.exports = CareInstruction;