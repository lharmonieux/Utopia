import constants from "../constants.js";

export const handleValidationErrorsAct = (
  name,
  chapter,
  questions,
  constants
) => {
  if (!name || !chapter)
    return {
      status: constants.VALIDATION_ERROR,
      message: "Renseignez tous les champs oligatoires",
    };

  if (isNaN(chapter) || chapter < 1)
    return {
      status: constants.VALIDATION_ERROR,
      message: "Le numéro de l'acte doit être positif",
    };

  //Checking if questions are unique through the order
  let unique_questions_order = questions.map((question) => question.order);

  //Set provide a table who contains unique values
  if (unique_questions_order.length !== new Set(unique_questions_order).size)
    return {
      status: constants.VALIDATION_ERROR,
      message: "Deux questions ne doivent pas avoir le même ordre",
    };
  
  return false;
};

export const handleValidationErrorsPersonnages = (name, caracteristic) => {
  if (!name || !caracteristic) {
    return {
      status: constants.VALIDATION_ERROR,
      message: "Renseignez tous les champs obligatoires"
    }
  }

  return false;
}
