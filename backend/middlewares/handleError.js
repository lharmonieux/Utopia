import constants from "../constants.js";

export const handleValidationErrorsAct = ({
  name,
  chapter,
  townStatus,
  resolution,
  questions,
  constants}
) => {
  if (!name || !chapter || !resolution || !townStatus)
    return {
      status: constants.VALIDATION_ERROR,
      message: "Renseignez tous les champs oligatoires",
    };

  if (isNaN(chapter) || chapter < 1)
    return {
      status: constants.VALIDATION_ERROR,
      message: "Le numéro de l'acte doit être supérieur à 0",
    };

  //Checking if questions are unique through the order
  let unique_questions_order = questions.map((question) => question.order);

  //Set provide a table who contains unique values
  if (unique_questions_order.length !== new Set(unique_questions_order).size)
    return {
      status: constants.VALIDATION_ERROR,
      message: "Deux questions ne doivent pas avoir le même rang",
    };
  
  return false;
};

export const handleValidationErrorsPersonnages = (name, caracteristic, thematic, score, img, vignette) => {
  if (!name || !caracteristic || !thematic || !score || !img || !vignette) {
    return {
      status: constants.VALIDATION_ERROR,
      message: "Renseignez tous les champs obligatoires."
    }
  }

  if (isNaN(score)){
    return {
      status: constants.VALIDATION_ERROR,
      message: "Le score doit être un nombre."
    }
  }

  return false;
}
