import Company from "../models/companyModel.js";
import constants from "../utils/constants.js";

// ADD COMPANY
export const addCompany = async (req, res) => {
  try {
    const { name } = req.body;
    const newCompany = await Company.create({ name });
    return res
      .status(constants.CREATED)
      .json({ message: "Company ajouté avec succès", company: newCompany });
  } catch (error) {
    return res.status(constants.SERVER_ERROR).json({ message: error.message });
  }
};

// READ ALL COMPANIES
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ isDeleted: false });
    return res.status(constants.SUCCESS).json(companies);
  } catch (error) {
    return res.status(constants.SERVER_ERROR).json({ message: error.message });
  }
};

// UPDATE COMPANY
export const updateCompany = async (req, res) => {
  try {
    const { companyId } = req.query;
    const { name } = req.body;
    const companyUpdated = await Company.findByIdAndUpdate(companyId, { name });
    if (!companyUpdated) {
      return res
        .status(constants.NOT_FOUND)
        .json({ message: "Company introuvable" });
    }
    return res.status(constants.SUCCESS).json({
      message: "Company mis à jour avec succes",
      companyUpdated,
    });
  } catch (error) {
    return res.status(constants.SERVER_ERROR).json({ message: error.message });
  }
};

// DELETE COMPANY
export const deleteCompany = async (req, res) => {
  try {
    const { companyId } = req.query;
    const companyDeleted = await Company.findByIdAndUpdate(companyId, {
      isDeleted: true,
    });
    if (!companyDeleted) {
      return res
        .status(constants.NOT_FOUND)
        .json({ message: "Company introuvable" });
    }

    return res.status(constants.SUCCESS).json({
      message: "Company supprime avec succes",
    });
  } catch (error) {
    return res.status(constants.SERVER_ERROR).json({ message: error.message });
  }
};
