const express = require("express");
const productRouter = express.Router();

const productController = require("../controllers/productController");
const compositionController = require("../controllers/compositionController");
const adminAuth = require("../middleware/adminAuth"); // ← THÊM

/* =====================================================
   PRODUCT ROUTES
===================================================== */

/* ----------- GET ALL PRODUCTS ----------- */
productRouter.get("/", async (req, res) => {
  try {
    const result = await productController.getProducts();
    res.status(result?.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ----------- GET FULL INFO BY QR CODE ----------- */
productRouter.get("/qr/:code", async (req, res) => {
  try {
    const { code } = req.params;
    
    // ===== ✅ THÊM VALIDATION =====
    
    // 1. Kiểm tra kiểu dữ liệu
    if (typeof code !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid QR code type" 
      });
    }
    
    // 2. Kiểm tra độ dài
    if (code.length === 0 || code.length > 100) {
      return res.status(400).json({ 
        success: false, 
        message: "QR code length must be between 1-100 characters" 
      });
    }
    
    // 3. Kiểm tra format - chỉ cho phép chữ, số, gạch ngang, gạch dưới
    if (!/^[A-Za-z0-9_-]+$/.test(code)) {
      return res.status(400).json({ 
        success: false, 
        message: "QR code contains invalid characters" 
      });
    }
    
    // ===== KẾT THÚC VALIDATION =====
    
    const result = await productController.getProductByQRCode(code);
    res.status(result?.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ----------- GET PRODUCT BY ID ----------- */
productRouter.get("/:id", async (req, res) => {
  //console.log("Request params:", req.params); 
  try {
    const result = await productController.getProductById(req.params.id);
    res.status(result?.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ----------- CREATE PRODUCT ----------- */
productRouter.post("/", adminAuth, async (req, res) => {     // ← THÊM adminAuth
  try {
    const result = await productController.postProduct(req.body);
    res.status(result?.success ? 201 : 400).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ----------- UPDATE PRODUCT ----------- */
productRouter.put("/:id", adminAuth, async (req, res) => {               // ← THÊM adminAuth
  try {
    const result = await productController.updateProduct(req.params.id, req.body);
    res.status(result?.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ----------- DELETE PRODUCT ----------- */
productRouter.delete("/:id", adminAuth, async (req, res) => {           // ← THÊM adminAuth
  try {
    const result = await productController.deleteProduct(req.params.id);
    res.status(result?.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* =====================================================
   COMPOSITION (Nested under Product)
===================================================== */

/* GET composition of a product */
productRouter.get("/:id/composition", async (req, res) => {
  try {
    const result = await compositionController.getCompositionByProduct(req.params.id);
    res.status(result?.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* CREATE composition for a product */
productRouter.post("/:id/composition", adminAuth, async (req, res) => {    // ← THÊM adminAuth
  try {
const result = await compositionController.createCompositionForProduct(
      req.params.id,
      req.body
    );
    res.status(result?.success ? 201 : 400).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* UPDATE composition for a product */
productRouter.put("/:id/composition", adminAuth, async (req, res) => {    // ← THÊM adminAuth
  try {
    const result = await compositionController.updateCompositionForProduct(
      req.params.id,
      req.body
    );
    res.status(result?.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* DELETE composition of a product */
productRouter.delete("/:id/composition", adminAuth, async (req, res) => {             // ← THÊM adminAuth
  try {
    const result = await compositionController.deleteCompositionForProduct(req.params.id);
    res.status(result?.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = productRouter;
