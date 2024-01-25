import constants from "../constants.js";
import Thematic from "../models/thematicModel.js";

// @acces Private
export const createThematic = async (req, res) => {
  try {
    const datas = req.body;
    if (Array.isArray(datas)) {
      let errorFound = 0;
      let dataNameTmp = "";
      let duplicateName = 0;
      //Verify if all forms are filled good and if there are duplicate value
      for (let data of datas) {
        if (!data.name) errorFound++;

        if (dataNameTmp == data.name) duplicateName++;

        dataNameTmp = data.name;
      }

      if (errorFound)
        return res
          .status(constants.VALIDATION_ERROR)
          .json({ message: "Assurez vous de remplir tous les champs" });

      if (duplicateName)
        return res
          .status(constants.VALIDATION_ERROR)
          .json({ message: "Le nom de thématique doit être unique" });

      //Values to save
      const newThematics = [];
      for (let data of datas) newThematics.push({ name: data.name });

      await Thematic.create(newThematics);

      return res
        .status(constants.CREATED)
        .json({ message: "Thematiques créées avec succès." });
    } else {
        const { name } = req.body;
        if (!name) return res.status(constants.VALIDATION_ERROR).json({message: "Veuillez renseigner tous les champs."});

        const duplicate = await Thematic.findOne({name}).exec();
        if (duplicate) return res.status(constants.CONFLICT).json({message: "Cette thématique existe déjà."});

        await Thematic.create({name});
        return res.status(constants.CREATED).json({message: "Thématique créée avec succès."});
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(constants.SERVER_ERROR)
      .json({
        errorMessage: `La thématique de nom "${error.keyValue.name}" existe déjà.`,
      });
  }
};
