/**
 * Supplier Controller
 * @module controllers/supplierController
 */

const Supplier = require("../models/Supplier");
const Product = require("../models/Product");

/* ------------------------ GET ALL SUPPLIERS ------------------------ */
const getSuppliers = async () => {
  try {
    const response = await Supplier.find({});
    return response;
  } catch (error) {
    console.log(`Error at getSuppliers: ${error.message}`);
    throw error;
  }
};

/* ------------------------ GET SUPPLIER BY ID ------------------------ */
const getSupplierById = async (SupplierID) => {
  try {
    const supplier = await Supplier.findOne({ SupplierID }).select(
      "SupplierName Contact Address -_id").lean();
    if (!supplier) {
      return {
        success: false,
        data: null,
        message: `No supplier found with SupplierID ${SupplierID}`,
      };
    }

    // get related products
    const products = await Product.find({ SupplierID }).select("ProductName -_id").lean();

    return {
      success: true,
      data: { supplier, relatedProducts: products },
      message: "Fetched supplier and related products",
    };
  } catch (error) {
    console.log(`Error at getSupplierById: ${error.message}`);
    throw error;
  }
};

/* ------------------------ CREATE SUPPLIER ------------------------ */
const postSupplier = async (supplier) => {
  try {
    const existingSupplier = await Supplier.findOne({ SupplierID: supplier.SupplierID });

    if (!existingSupplier) {
      const response = await Supplier.create(supplier);
      return response;
    }

    return {
      data: existingSupplier,
      message: `Supplier with ID: ${supplier.SupplierID} already exists.`,
      status: 304,
    };
  } catch (error) {
    console.log(`Error at postSupplier: ${error.message}`);
    throw error;
  }
};

/* ------------------------ UPDATE SUPPLIER ------------------------ */
const updateSupplier = async (SupplierID, supplier) => {
  try {
    const response = await Supplier.findOneAndUpdate(
      { SupplierID },
      supplier,
      { new: true } // return updated doc
    );
    return response;
  } catch (error) {
    console.log(`Error at updateSupplier: ${error.message}`);
    throw error;
  }
};

/* ------------------------ DELETE SUPPLIER ------------------------ */
const deleteSupplier = async (SupplierID) => {
  try {
    // check reference in Product
    const productsUsingSupplier = await Product.find({ SupplierID });
    if (productsUsingSupplier.length > 0) {
      return {
        success: false,
        message: `Cannot delete Supplier ${SupplierID}: still referenced by ${productsUsingSupplier.length} product(s).`,
        status: 409,
        relatedProducts: productsUsingSupplier.map(p => ({
          ProductID: p.ProductID,
          name: p.name
        })),
      };
    }

    // delete supplier
    const response = await Supplier.findOneAndDelete({ SupplierID });
    if (!response) {
      return {
        success: false,
        message: `Supplier ${SupplierID} not found.`,
        status: 404,
      };
    }

    return response;
  } catch (error) {
    console.log(`Error at deleteSupplier: ${error.message}`);
    throw error;
  }
};

module.exports = {
  getSuppliers,
  getSupplierById,
  postSupplier,
  updateSupplier,
  deleteSupplier,
};
