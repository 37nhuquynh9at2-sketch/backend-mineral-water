/**
 * CareInstruction Controller
 * Each CareInstruction document belongs to a Product (1:N relationship)
 */

const CareInstruction = require("../models/CareInstruction");
const Product = require("../models/Product");

/* ------------------------ GET ALL BY PRODUCT ------------------------ */
// Route: GET /api/careinstructions/:ProductID
const getCareInstructionsByProduct = async (ProductID) => {
  try {
    const product = await Product.findOne({ ProductID });
    if (!product)
      return { success: false, message: "Product not found", data: [] };

    const instructions = await CareInstruction.find({ ProductID }).select(
      "-__v"
    );

    return { success: true, data: instructions };
  } catch (error) {
    console.log("getCareInstructionsByProduct error:", error.message);
    throw error;
  }
};

/* ------------------------ GET BY INSTRUCTION ID ------------------------ */
// Route: GET /api/careinstructions/instruction/:InstructionID
const getCareInstructionById = async (InstructionID) => {
  try {
    const instruction = await CareInstruction.findOne({ InstructionID })
      .populate({
        path: "ProductID",
        select: "ProductID ProductName -_id",
      })
      .select("-__v");

    if (!instruction)
      return { success: false, message: "Instruction not found", data: null };

    return { success: true, data: instruction };
  } catch (error) {
    console.log("getCareInstructionById error:", error.message);
    throw error;
  }
};

/* ------------------------ CREATE NEW CARE INSTRUCTION ------------------------ */
// Route: POST /api/careinstructions/:ProductID
const createCareInstruction = async (ProductID, InstructionText) => {
  try {
    const product = await Product.findOne({ ProductID });
    if (!product)
      return { success: false, message: "Product not found" };

    const newInstruction = await CareInstruction.create({
      ProductID,
      InstructionID: Date.now().toString(),
      InstructionText,
    });

    return {
      success: true,
      data: newInstruction,
      message: "Instruction added successfully",
    };
  } catch (error) {
    console.log("createCareInstruction error:", error.message);
    throw error;
  }
};

/* ------------------------ UPDATE CARE INSTRUCTION ------------------------ */
// Route: PUT /api/careinstructions/:ProductID/:InstructionID
const updateCareInstruction = async (ProductID, InstructionID, text) => {
  try {
    const updated = await CareInstruction.findOneAndUpdate(
      { ProductID, InstructionID },
      { InstructionText: text },
      { new: true }
    );

    if (!updated)
      return { success: false, message: "Instruction not found" };

    return {
      success: true,
      data: updated,
      message: "Instruction updated successfully",
    };
  } catch (error) {
    console.log("updateCareInstruction error:", error.message);
    throw error;
  }
};

/* ------------------------ DELETE CARE INSTRUCTION ------------------------ */
// Route: DELETE /api/careinstructions/:ProductID/:InstructionID
const deleteCareInstruction = async (ProductID, InstructionID) => {
  try {
    const deleted = await CareInstruction.findOneAndDelete({
      ProductID,
      InstructionID,
    });

    if (!deleted)
      return { success: false, message: "Instruction not found" };

    return {
      success: true,
      message: "Instruction deleted successfully",
    };
  } catch (error) {
    console.log("deleteCareInstruction error:", error.message);
    throw error;
  }
};

module.exports = {
  getCareInstructionsByProduct,
  getCareInstructionById,
  createCareInstruction,
  updateCareInstruction,
  deleteCareInstruction,
};
