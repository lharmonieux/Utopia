import Project from "../models/projectModel.js";
import constants from "../utils/constants.js";

// ADD Project
export const addProject = async (req, res) => {
  try {
    const { name, admin, company, email_message } = req.body;

    if (!name || !admin || !company || !email_message) {
      return res
        .status(constants.VALIDATION_ERROR)
        .json({ message: "Veuillez renseigner tous les champs" });
    }

    // Check if project already exists for the admin user
    const foundProject = await Project.findOne({ name, admin, company });
    if (foundProject) {
      return res.status(constants.CONFLICT).json({
        message: "Vous avez déjà un projet de ce nom pour cette entreprise",
      });
    }

    const project = await Project.create({ name, admin, company, email_message });
    return res
      .status(constants.SUCCESS)
      .json({ message: "Projet ajouté avec succès", project });
  } catch (error) {
    return res.status(constants.SERVER_ERROR).json({ message: error.message });
  }
};

// READ Projects by admin
export const getProjectsByAdmin = async (req, res) => {
  try {
    const { adminId } = req.query;
    const projects = await Project.find({
      admin: adminId,
      isDeleted: false,
    }).populate("company");
    if (!projects)
      return res
        .status(constants.NOT_FOUND)
        .json({ message: "Aucun projet n'a été trouvé" });

    return res.status(constants.SUCCESS).json(projects);
  } catch (error) {
    return res.status(constants.SERVER_ERROR).json({ message: error.message });
  }
};

// UPDATE Project
export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.query;
    const { name, status, company } = req.body;

    const projectUpdated = await Project.findByIdAndUpdate(projectId, {
      name,
      status,
      company,
    });

    if (!projectUpdated) {
      return res
        .status(constants.NOT_FOUND)
        .json({ message: "Projet introuvable" });
    }

    return res.status(constants.SUCCESS).json({
      message: "Projet mis à jour avec succes",
    });
  } catch (error) {
    return res.status(constants.SERVER_ERROR).json({ message: error.message });
  }
};

// Delete Project
export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.query;
    const projectDeleted = await Project.findByIdAndUpdate(projectId, {
      isDeleted: true,
    });
    if (!projectDeleted) {
      return res
        .status(constants.NOT_FOUND)
        .json({ message: "Projet introuvable" });
    }

    return res.status(constants.SUCCESS).json({
      message: "Projet supprimé avec succès",
    });
  } catch (error) {
    return res.status(constants.SERVER_ERROR).json({ message: error.message });
  }
};
