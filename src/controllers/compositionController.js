/**
 * The functionalities of the composition collection.
 * @module controllers/compositionController
 * @requires ../models/Composition
 */

/* ------------------------ importing Packages ------------------------ */
const Composition = require("../models/Composition");
const Product = require("../models/Product");  

/* ------------------------ Functions ------------------------ */
/**
 * @async 
 * @function getCompositionById
 * @param {String} CompID
 * @returns {Promise<Object<Composition>>} composition data if there is no error
 * @throws {Error} throws an error if there is an error
 * @description
 * gets a single composition by its unique ID from the database
 * includes populate to show related Product info
 */
const getCompositionById = async (CompID) => {
  try {
    const composition = await Composition.findOne({ CompID })
      .populate({
        path: "ProductID",
        select: "ProductID ProductName Volume Price -_id"
      });

    if (!composition) {
      return {
        success: false,
        message: `No Composition found with CompID ${CompID}`,
        data: null
      };
    }

    return {
      success: true,
      data: composition,
      message: "Fetched composition successfully"
    };

  } catch (error) {
    console.log("Error at getCompositionById:", error.message);
    throw error;
  }
};

/**
 * @async
 * @function postComposition
 * @param {Object} product
 * @returns {Promise<Object<Composition>>} created composition if there is no error
 * @throws {Error} throws an error if there is an error
 * @description
 * inserts a new composition into the database
 * checks whether the CompID already exists before creating a new entry
 */
const postComposition = async (product) => {
  try {
    const exists = await Composition.findOne({ ProductID: product.ProductID });

    if (exists) {
      return {
        success: false,
        message: `Composition for ProductID ${product.ProductID} already exists`
      };
    }

    const newComp = await Composition.create({
      ProductID: product.ProductID,
      MineralComposition: product.MineralComposition,
      pH: product.pH
    });

    return {
      success: true,
      data: newComp
    };

  } catch (error) {
    console.log("Error at postCompositionForProduct:", error.message);
    throw error;
  }
};

/**
 * @async
 * @function updateComposition
 * @param {String} ProductID
 * @param {Object} data
 * @returns {Promise<Object<Composition>>} updated composition if there is no error
 * @throws {Error} throws an error if there is an error
 * @description
 * updates an existing composition in the database by its CompID
 * allows partial updates such as modifying mineral composition or pH level
 */
const updateComposition = async (ProductID, data) => {
  try {
    const updated = await Composition.findOneAndUpdate(
      { ProductID },
      {
        MineralComposition: data.MineralComposition,
        pH: data.pH
      },
      { new: true }
    );

    return {
      success: true,
      data: updated
    };

  } catch (error) {
    console.log("Error at updateCompositionForProduct:", error.message);
    throw error;
  }
};

/**
 * @async
 * @function deleteComposition
 * @param {String} ProductID
 * @returns {Promise<Object<Composition>>} deleted composition if there is no error
 * @throws {Error} throws an error if there is an error
 * @description
 * deletes a composition from the database by its CompID
 */
const deleteComposition = async (ProductID) => {
  try {
    await Composition.findOneAndDelete({ ProductID });
  } catch (error) {
    console.log("Error at deleteCompositionForProduct:", error.message);
    throw error;
  }
};


/* ------------------------ Model Exporting ------------------------ */
module.exports = {
  getCompositionById,
  postComposition,
  updateComposition,
  deleteComposition,
};
