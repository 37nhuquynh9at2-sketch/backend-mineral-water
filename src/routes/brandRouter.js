/**
 * Routes handling Brand collection requests.
 * @module routes/brandRoutes
 * @requires express
 * @requires ../controllers/brandController
 */

/* ------------------------ Importing Packages ------------------------ */
const express = require("express");
const brandRouter = express.Router();

const brandController = require("../controllers/brandController");
const adminAuth = require("../middleware/adminAuth"); // ← THÊM

/* ------------------------ Routes Definitions ------------------------ */

/**
 * @route GET /brands
 * @description Get all brands
 */
brandRouter.get("/", async (req, res) => {
  try {
    const response = await brandController.getBrands();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route GET /brands/:id
 * @description Get brand by BrandID
 */
brandRouter.get("/:id", async (req, res) => {
  try {
    const response = await brandController.getBrandById(req.params.id);
    res.status(response.status || 200).json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route POST /brands
 * @description Create a new brand
 */
brandRouter.post("/", adminAuth, async (req, res) => { // ← THÊM adminAuth
  try {
    const response = await brandController.postBrand(req.body);
    res.status(response.status || 200).json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route PUT /brands/:id
 * @description Update an existing brand
 */
brandRouter.put("/:id", adminAuth, async (req, res) => { // ← THÊM adminAuth
  try {
    const response = await brandController.updateBrand(req.params.id, req.body);
    res.status(response.status || 200).json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route DELETE /brands/:id
 * @description Delete a brand (only if no Product references it)
 */
brandRouter.delete("/:id", adminAuth, async (req, res) => { // ← THÊM adminAuth
  try {
    const response = await brandController.deleteBrand(req.params.id);
    res.status(response.status || 200).json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ------------------------ Exporting Router ------------------------ */
module.exports = brandRouter;