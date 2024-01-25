import constants from "../constants.js";
import AnswerType from "../models/answerTypeModel.js";

// @acces Private
export const createAnswerType = async (req, res) => {
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
          .json({ message: "Le nom de type de réponse doit être unique" });

      //Values to save
      const newAnswerTypes = [];
      for (let data of datas) newAnswerTypes.push({ name: data.name });

      await AnswerType.create(newAnswerTypes);

      return res
        .status(constants.CREATED)
        .json({ message: "Types de réponses créés avec succès." });
    } else {
        const { name } = req.body;
        if (!name) return res.status(constants.VALIDATION_ERROR).json({message: "Veuillez renseigner tous les champs."});

        const duplicate = await AnswerType.findOne({name}).exec();
        if (duplicate) return res.status(constants.CONFLICT).json({message: "Ce type de réponse existe déjà."});

        await AnswerType.create({name});
        return res.status(constants.CREATED).json({message: "Type de réponse créé avec succès."});
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(constants.SERVER_ERROR)
      .json({
        errorMessage: `Le type de réponse de nom "${error.keyValue.name}" existe déjà.`,
      });
  }
};
