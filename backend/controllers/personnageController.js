import Personnage from "../models/personnageModel.js";
import constants from "../constants.js";
import { handleValidationErrorsPersonnages } from "../middlewares/handleError.js";

//Add personnage
export const addPersonnage = async (req, res) => {
  try {

    if (Array.isArray(req.body)) {
      const datas = [...req.body];
      let resultValidation;
      for (const data of datas) {
        resultValidation = handleValidationErrorsPersonnages(
          data.name,
          data.caracteristic
        );
      }

      //If error exist in list of datas
      if (resultValidation)
        return res
          .status(resultValidation.status)
          .json({ message: resultValidation.message });

      for (const data of datas)
        await Personnage.create({
          name: data.name,
          caracteristic: data.caracteristic,
        });
      return res
        .status(constants.CREATED)
        .json({ message: "Personnages créés avec succès." });
    } else {
      const { name, caracteristic } = req.body;
      const resultValidation = handleValidationErrorsPersonnages(
        name,
        caracteristic
      );

      //If error
      if (resultValidation)
        return res
          .status(resultValidation.status)
          .json({ message: resultValidation.message });

      //Save data
      await Personnage.create({
        name,
        caracteristic,
      });
      return res
        .status(constants.CREATED)
        .json({ message: "Personnages créé avec succès." });
    }
  } catch (error) {
    console.error(error);
    return res.status(constants.SERVER_ERROR).json({ message: error.message });
  }
};

//Read personnage
export const getAllPersonnage = async (req, res) => {
  try {
    const personnages = await Personnage.find({});
    if (personnages) return res.status(constants.SUCCESS).send(personnages);

    return res.status(constants.SUCCESS).json({
      message: "Aucun personnage trouvé.",
    });
  } catch (error) {
    console.error();
    return res.status(constants.SERVER_ERROR).json({
      message: error.message,
    });
  }
};
