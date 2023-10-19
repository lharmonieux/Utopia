import constants from "../constants.js";
import Act from "../models/actModel.js";
import { handleValidationErrorsAct } from "../middlewares/handleError.js";

// Add Act
export const addAct = async (req, res) => {
  try {
    //Getting body informations
    const { name, chapter, questions } = req.body;

    //Getting the errors
    const error = handleValidationErrorsAct(
      name,
      chapter,
      questions,
      constants
    );
    if (error) return res.status(error.status).json({ message: error.message });

    const newAct = {
      name,
      chapter,
      questions,
    };

    // Save acte
    await Act.create(newAct);

    return res.status(constants.CREATED).json({
      message: "Acte créé avec succès !",
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
    const acts = await Act.find({});
    return res.status(constants.SUCCESS).send(acts);
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
    const { id_act } = req.params;
    //Getting body informations
    const { name, chapter, questions } = req.body;

    //Getting the errors
    const error = handleValidationErrorsAct(
      name,
      chapter,
      questions,
      constants
    );
    if (error) return res.status(error.status).json({ message: error.message });

    //Updating information
    const act = await Act.findByIdAndUpdate(id_act, {
      name,
      chapter,
      questions,
    });

    if (!act)
      return res.status(constants.NOT_FOUND).json({
        message: "Cet acte n'existe pas",
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
    const { id_act } = req.params;
    const result = await Act.findOneAndDelete(id_act);
    if (!result)
      return res.status(constants.NOT_FOUND).json({
        message: "Cet acte n'existe pas",
      });

    return res.status(constants.SUCCESS).json({
      message: "Acte supprimé avec succès !",
    });
  } catch (error) {}
};
