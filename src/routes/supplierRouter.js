/**
 * Express router providing product-related API endpoints.
 * @module routes/supplierRouter
 * @requires express
 * @requires ../controllers/supplierController
 */

/* ------------------------ Importing Packages ------------------------ */
const express = require("express");
const supplierRouter = express.Router();

const supplierController = require("../controllers/supplierController");
const adminAuth = require("../middleware/adminAuth"); // ← THÊM

/* ------------------------ Routes Definitions ------------------------ */

supplierRouter.get("/", async (req, res) => {
  try {
    const response = await supplierController.getSuppliers();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ----------- GET SUPPLIER BY ID ----------- */
supplierRouter.get("/:id", async (req, res) => {
  try {
    const response = await supplierController.getSupplierById(req.params.id);
    res.status(response.status || 200).json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ----------- CREATE SUPPLIER ----------- */
supplierRouter.post("/", adminAuth, async (req, res) => { // ← THÊM adminAuth
  try {
    const response = await supplierController.postSupplier(req.body);
    res.status(response.status || 200).json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ----------- UPDATE SUPPLIER ----------- */
supplierRouter.put("/:id", adminAuth, async (req, res) => { // ← THÊM adminAuth
  try {
    const response = await supplierController.updateSupplier(req.params.id, req.body);
    res.status(response.status || 200).json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ----------- DELETE SUPPLIER (ràng buộc Product) ----------- */
supplierRouter.delete("/:id", adminAuth, async (req, res) => { // ← THÊM adminAuth
  try {
    const response = await supplierController.deleteSupplier(req.params.id);
    res.status(response.status || 200).json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = supplierRouter;
