import Personnage from "../models/characterModel.js";
import constants from "../constants.js";
import { handleValidationErrorsPersonnages } from "../middlewares/handleError.js";

//Add personnage
export const addPersonnage = async (req, res) => {
  try {
    //Save of multiple character
    if (Array.isArray(req.body)) {
      const datas = [...req.body];
      for (const data of datas) {
        const resultValidation = handleValidationErrorsPersonnages(
          data.name,
          data.caracteristic,
          data.thematic,
          data.score,
          data.img,
          data.vignette
        );

        //If error exist in list of datas
        if (resultValidation)
          return res
            .status(resultValidation.status)
            .json({ message: resultValidation.message });
      }

      //Save characters
      for (const data of datas)
        await Personnage.create({
          name: data.name,
          caracteristic: data.caracteristic,
          thematic: data.thematic,
          score: data.score,
          img: data.img,
          vignette: data.vignette,
        });

      return res
        .status(constants.CREATED)
        .json({ message: "Personnages créés avec succès." });
    } else {
      const { name, caracteristic, thematic, score, img, vignette } = req.body;
      const resultValidation = handleValidationErrorsPersonnages(
        name,
        caracteristic,
        thematic,
        score,
        img,
        vignette
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
        thematic,
        score,
        img,
        vignette,
      });
      return res
        .status(constants.CREATED)
        .json({ message: "Personnages créé avec succès." });
    }
  } catch (error) {
    console.log("here");
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
    console.log(error.message);
    return res.status(constants.SERVER_ERROR).json({
      message: error.message,
    });
  }
};
