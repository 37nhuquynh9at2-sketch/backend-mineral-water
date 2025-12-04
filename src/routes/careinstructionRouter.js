/**
 * Routes for managing care instructions of a product.
 * @module routes/careRoutes
 */

const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const adminAuth = require("../middleware/adminAuth"); // ← THÊM

/* ================================
   GET all care instructions
================================ */
router.get("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await productController.getProductById(productId);

    if (!result?.success) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: result.data?.careInstructions || [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ================================
   ADD a new care instruction
================================ */
router.post("/:productId", adminAuth, async (req, res) => { // ← THÊM adminAuth
  try {
    const { productId } = req.params;
    const { InstructionText } = req.body;

    if (!InstructionText || InstructionText.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "InstructionText is required." });
    }

    const result = await productController.addCareInstruction(
      productId,
      InstructionText
    );

    res.status(result?.success ? 201 : 400).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ================================
   UPDATE a specific care instruction
================================ */
router.put("/:productId/:step", adminAuth, async (req, res) => { // ← THÊM adminAuth
  try {
    const { productId, step } = req.params;
    const { InstructionText } = req.body;

    if (!InstructionText || InstructionText.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "InstructionText is required." });
    }

    const result = await productController.updateCareInstruction(
      productId,
      step,
      InstructionText
    );

    res.status(result?.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ================================
   DELETE a specific care instruction
================================ */
router.delete("/:productId/:step", adminAuth, async (req, res) => { // ← THÊM adminAuth
  try {
    const { productId, step } = req.params;

    const result = await productController.deleteCareInstruction(
      productId,
      step
    );

    res.status(result?.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
