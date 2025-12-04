/**
 * Product Controller
 * Public: GET
 * Admin: POST / PUT / DELETE
 */

const Product = require("../models/Product");
const CareInstruction = require("../models/CareInstruction");
const Composition = require("../models/Composition");
const QRCode = require("qrcode");
const path = require("path");
const fs = require("fs");

/* ------------------------
   QR Code folder check
------------------------- */
const folder = path.join(__dirname, "../public/qrcodes");
if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

/* ------------------------
   Generate a QR file
------------------------- */
async function generateQRCodeFile(productId) {
  // Sử dụng BASE_URL từ .env, fallback về localhost
  const baseURL = process.env.BASE_URL || 'http://localhost:4000';
  const url = `${baseURL}/product/${productId}`;
  
  await QRCode.toFile(`src/public/qrcodes/${productId}.png`, url, {
    width: 300,
  });
  
  console.log("QR created for:", url);
}

/* =====================================================
                PUBLIC API (READ ONLY)
===================================================== */

/* ----------- GET ALL PRODUCTS ----------- */
const getProducts = async () => {
  try {
    const products = await Product.aggregate([
      {
        $lookup: {
          from: "Composition",
          localField: "ProductID",
          foreignField: "ProductID",
          as: "composition",
        },
      },
      { $unwind: { path: "$composition", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "CareInstruction",
          localField: "ProductID",
          foreignField: "ProductID",
          as: "careInstructions",
        },
      },
    ]);

    return { success: true, data: products };
  } catch (error) {
    console.error("getProducts error:", error);
    throw error;
  }
};

/* ----------- GET BY ProductID ----------- */
const getProductById = async (ProductID) => {
  try {
    const product = await Product.findOne({ ProductID }).lean();

    if (!product)
      return { success: false, message: `Product ${ProductID} not found` };

    const composition = await Composition.findOne({ ProductID }).lean();
    const careInstructions = await CareInstruction.find({ ProductID }).lean();

    return {
      success: true,
      data: {
        ...product,
        composition,
        careInstructions,
      },
    };
  } catch (error) {
    console.error("getProductById error:", error);
    throw error;
  }
};

/* ----------- GET BY QR CODE ----------- */
const getProductByQRCode = async (code) => {
  try {
    const product = await Product.findOne({ QRCode: code }).lean();

    if (!product)
      return { success: false, message: `Product with QR ${code} not found` };

    const composition = await Composition.findOne({
      ProductID: product.ProductID,
    }).lean();

    const careInstructions = await CareInstruction.find({
      ProductID: product.ProductID,
    }).lean();

    return {
      success: true,
      data: {
        ...product,
        composition,
        careInstructions,
      },
    };
  } catch (error) {
    console.error("getProductByQRCode error:", error);
    throw error;
  }
};

/* =====================================================
                ADMIN API (WRITE)
===================================================== */

/* ----------- CREATE PRODUCT ----------- */
const postProduct = async (data) => {
  try {
    const exists = await Product.findOne({ ProductID: data.ProductID });
    if (exists)
      return { success: false, message: "ProductID already exists" };

    const newProduct = await Product.create(data);
    return { success: true, data: newProduct };
  } catch (error) {
    console.error("postProduct error:", error);
    throw error;
  }
};

/* ----------- UPDATE PRODUCT ----------- */
const updateProduct = async (ProductID, data) => {
  try {
    const updated = await Product.findOneAndUpdate({ ProductID }, data, {
      new: true,
    });

    if (!updated)
      return { success: false, message: `Product ${ProductID} not found` };

    return { success: true, data: updated };
  } catch (error) {
    console.error("updateProduct error:", error);
    throw error;
  }
};

/* ----------- DELETE PRODUCT ----------- */
const deleteProduct = async (ProductID) => {
  try {
    const deleted = await Product.findOneAndDelete({ ProductID });

    if (!deleted)
      return { success: false, message: `Product ${ProductID} not found` };

    await CareInstruction.deleteMany({ ProductID });

    return {
      success: true,
      message: "Product and its care instructions deleted successfully",
    };
  } catch (error) {
    console.error("deleteProduct error:", error);
    throw error;
  }
};

/* =====================================================
                EXPORT
===================================================== */
module.exports = {
  getProducts,
  getProductById,
  getProductByQRCode,
  postProduct,
  updateProduct,
  deleteProduct,
  generateQRCodeFile,
};
