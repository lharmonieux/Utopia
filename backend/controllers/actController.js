import constants from "../utils/constants.js";
import Act from "../models/actModel.js";
import { handleValidationErrorsAct } from "../middlewares/handleError.js";

// Add Act
export const addAct = async (req, res) => {
  try {
    //Getting body informations
    const { name, chapterNumber, townStatus, ending, questions, visual } =
      req.body;

    //Getting the errors
    const error = handleValidationErrorsAct({
      name,
      chapterNumber,
      questions,
      townStatus,
      ending,
      constants,
    });
    if (error) return res.status(error.status).json({ message: error.message });

    // Save acte
    const newAct = await Act.create({
      name,
      chapterNumber,
      ending,
      townStatus,
      questions,
      visual,
    });

    return res.status(constants.CREATED).json({
      message: "Acte créé avec succès !",
      act: newAct,
    });
  } catch (error) {
    console.error(error);
    return res.status(constants.SERVER_ERROR).json({ message: error.message });
  }
};

// Read Act
export const getAct = async (req, res) => {
  try {
    //Getting acts from DB
    const acts = await Act.find({})
      .populate("questions.questionType")
      .populate("questions.thematic")
      .sort({ chapterNumber: 1 });
    if (acts)
      return res
        .status(constants.SUCCESS)
        .send({ message: "Actes listés avec succès !", acts });

    return res.status(constants.NOT_FOUND).json({
      message: "Aucun acte n'a été trouvé !",
    });
  } catch (error) {
    console.error(error);
    return res.status(constants.SERVER_ERROR).json({
      message: error.message,
    });
  }
};

// Update Act
export const updateAct = async (req, res) => {
  try {
    const { id_act } = req.query;
    //Updating information
    const act = await Act.findByIdAndUpdate(id_act, {
      ...req.body,
    });

    if (!act)
      return res.status(constants.NOT_FOUND).json({
        message: `Erreur lors de la recherche de l'acte`,
      });

    return res.status(constants.CREATED).json({
      message: "Acte modifié avec succès !",
    });
  } catch (error) {
    console.error(error);
    return res.status(constants.SERVER_ERROR).json({
      message: error.message,
    });
  }
};

// Delete Act
export const deleteAct = async (req, res) => {
  try {
    const { id_act } = req.query;
    const result = await Act.findOneAndUpdate(id_act, { isDeleted: true });
    if (!result)
      return res.status(constants.NOT_FOUND).json({
        message: "Cet acte n'existe pas",
      });

    return res.status(constants.SUCCESS).json({
      message: "Acte supprimé avec succès !",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(constants.SERVER_ERROR).json({ message: error.message });
  }
};
