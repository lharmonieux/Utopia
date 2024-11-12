import constants from "../utils/constants.js";
import QuestionType from "../models/questionTypeModel.js";

// @acces Private
export const createQuestionType = async (req, res) => {
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
          .json({ message: "Le nom de type de question doit être unique" });

      //Values to save
      const newQuestionTypes = [];
      for (let data of datas) newQuestionTypes.push({ name: data.name });

      await QuestionType.create(newQuestionTypes);

      return res
        .status(constants.CREATED)
        .json({ message: "Types de réponses créés avec succès." });
    } else {
        const { name } = req.body;
        if (!name) return res.status(constants.VALIDATION_ERROR).json({message: "Veuillez renseigner tous les champs."});

        const duplicate = await QuestionType.findOne({name}).exec();
        if (duplicate) return res.status(constants.CONFLICT).json({message: "Ce type de question existe déjà."});

        await QuestionType.create({name});
        return res.status(constants.CREATED).json({message: "Type de question créé avec succès."});
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(constants.SERVER_ERROR)
      .json({
        errorMessage: `Le type de question de nom "${error.keyValue.name}" existe déjà.`,
      });
  }
};
