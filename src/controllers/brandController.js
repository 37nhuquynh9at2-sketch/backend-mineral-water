/**
 * The functionalities of the brand collection.
 * @module controllers/brandController
 * @requires ../models/Brand
 */

/* ------------------------ importing Packages ------------------------ */
const Brand = require("../models/Brand");
const Product = require("../models/Product"); 

/* ------------------------ Functions ------------------------ */
/**
 * @async
 * @function getBrands
 * @returns {Promise<Array<Brand>>} array of brands data if there is no error
 * @throws {Error} throws an error if there is an error
 * @description
 * gets all the brands that registered in the database
 */
const getBrands = async () => {
  try {
    const response = await Brand.find({});
    return {
      success: true,
      data: response,
      message: "Fetched all brands"
    };
  } catch (error) {
    console.log(`error at getBrands: ${error.message}`);
    throw error;
  }
};

/**
 * @async
 * @function getBrandById
 * @param {String} BrandID
 * @returns {Promise<Object<Brand>>} brand data if there is no error
 * @throws {Error} throws an error if there is an error
 * @description
 * gets a single brand by its unique ID from the database 
 */
const getBrandById = async (BrandID) => {
  try {
    const brand = await Brand.findOne({ BrandID }).select(
      "BrandName Country -_id").lean();
    if (!brand) {
      return {
        success: false,
        data: null,
        message: `BrandID ${BrandID} not found`
      };
    }
    // Get product list in in Brand
    const products = await Product.find({ BrandID }).select("ProductName -_id").lean();
    return {
      success: true,
      data: { brand, relatedProducts: products },
      message: "Fetched brand and related products"
    };

  } catch (error) {
    console.log(`error at getBrandById: ${error.message}`);
    throw error;
  }
};

/**
 * @async
 * @function postBrand 
 * @param {Object>} brand  
 * @returns {Promise<Object<Brand>>} created brand if there is no error
 * @throws {Error} throws an error if there is an error
 * @description
 * inserts a new brand into the database
 * checks whether the BrandID already exists before creating a new entry
 */
const postBrand = async (brand) => {
  try {
    if (!brand.BrandID || !brand.BrandName || !brand.Country) {
      return {
        success: false,
        message: "BrandID, BrandName and Country are required"
      };
    }

    const existingBrand = await Brand.findOne({ BrandID: brand.BrandID });
    if (existingBrand) {
      return {
        success: false,
        data: existingBrand,
        message: `BrandID ${brand.BrandID} already exists`
      };
    }

    const response = await Brand.create(brand);
    return {
      success: true,
      data: response,
      message: "Brand created successfully"
    };
  } catch (error) {
    console.log(`error at postBrand: ${error.message}`);
    throw error;
  }
};

/**
 * @async
 * @function updateBrand
 * @param {String} BrandID
 * @param {Object} brand
 * @returns {Promise<Object<Brand>>} updated brand if there is no error
 * @throws {Error} throws an error if there is an error
 * @description
 * updates an existing brand in the database by its BrandID
 * allows partial updates such as brandname, origin country
 */
const updateBrand = async (BrandID, brand) => {
  try {
    const response = await Brand.findOneAndUpdate({ BrandID }, brand, {
      new: true
    });

    if (!response) {
      return {
        success: false,
        message: `BrandID ${BrandID} not found`
      };
    }

    return {
      success: true,
      data: response,
      message: "Brand updated successfully"
    };

  } catch (error) {
    console.log(`error at updateBrand: ${error.message}`);
    throw error;
  }
};

/**
 * @async
 * @function deleteBrand
 * @param {String} BrandID
 * @returns {Promise<Object<Brand>>} deleted brand if there is no error
 * @throws {Error} throws an error if there is an error
 * @description
 * deletes a brand from the database by its BrandID
 * before deletion, it checks whether any Product is still referencing this Brand
 */
const deleteBrand = async (BrandID) => {
  try {
    const productsUsing = await Product.find({ BrandID });

    if (productsUsing.length > 0) {
      return {
        success: false,
        status: 409,
        message: `Cannot delete: Brand is still referenced by ${productsUsing.length} product(s).`,
        relatedProducts: productsUsing.map(p => ({
          ProductID: p.ProductID,
          ProductName: p.ProductName
        })),
      };
    }

    const deleted = await Brand.findOneAndDelete({ BrandID });

    if (!deleted) {
      return {
        success: false,
        status: 404,
        message: `BrandID ${BrandID} not found`
      };
    }

    return {
      success: true,
      message: `BrandID ${BrandID} deleted successfully`
    };

  } catch (error) {
    console.log(`error at deleteBrand: ${error.message}`);
    throw error;
  }
};

/* ------------------------ Model Exporting ------------------------ */
module.exports = {
  getBrands,
  getBrandById,
  postBrand,
  updateBrand,
  deleteBrand,
};

