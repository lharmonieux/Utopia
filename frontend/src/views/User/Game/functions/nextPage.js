import {
  storePartyName,
  storeSymbol,
  storeTown,
  storeTownName,
  storeUserCharacter,
  storeUserSecondCharacter,
} from "../../../../utils/redux/userSlice";

export default function nextPage(
  storeAnswer,
  scaleAnswers,
  objectCharacterSelected,
  textareaValue,
  stateActs,
  stateUser,
  dispatch,
  setShowAlertNoAnswer,
  setOpenScaleModal,
  containsFeedback,
  setShowAlertBadAnswerNumber,
  orderedAnswers,
  setOpenFeedbackModal,
  objectTownSelected,
  objectPropositionSelected,
  percentAnswers,
  booleanAnswerSelected
) {
  //Control of if there are an given answer
  if (
    storeAnswer.length > 0 ||
    scaleAnswers.size > 0 ||
    objectCharacterSelected ||
    objectTownSelected ||
    objectPropositionSelected ||
    textareaValue.size > 0 ||
    booleanAnswerSelected.size > 0 ||
    orderedAnswers.length > 0 ||
    percentAnswers.size > 0
  ) {
    //Textarea control
    let tmpValue;
    if (textareaValue.size > 0) {
      //Check if all values of map textareaValue aren't empty
      const valuesIterator = textareaValue.values();
      for (let i = 0; i < textareaValue.size; i++) {
        tmpValue = valuesIterator.next().value;
        if (!tmpValue.answerText) {
          setShowAlertNoAnswer(true);
          return;
        }
      }

      // Store townName and partyName
      if (stateActs.currentQuestion.questionType.name == "texte_ville")
        dispatch(
          storeTownName(
            textareaValue.get(stateActs.currentQuestion.text.content).answerText
          )
        );
      else if (stateActs.currentQuestion.questionType.name == "texte_fete")
        dispatch(
          storePartyName(
            textareaValue.get(stateActs.currentQuestion.text.content).answerText
          )
        );
    }

    //Store character
    if (objectCharacterSelected) {
      stateUser.character
        ? dispatch(storeUserSecondCharacter(objectCharacterSelected))
        : dispatch(storeUserCharacter(objectCharacterSelected));
    }

    //Store town
    if (objectTownSelected) dispatch(storeTown(objectTownSelected));

    //Scale answer control
    if (scaleAnswers.size > 0) {
      setOpenScaleModal(true);
      return;
    }
    //Multiple answers control
    if (
      stateActs?.currentQuestion?.questionType?.name ==
        "proposition_multiple" &&
      storeAnswer.length <
        stateActs.currentQuestion?.nbOfAnswersRequired
    ) {
      setShowAlertBadAnswerNumber(true);
      return;
    }
    // Ranking answer control
    if (
      (stateActs?.currentQuestion?.questionType?.name == "classement" ||
        stateActs?.currentQuestion?.questionType?.name ==
          "classement_symbol") &&
      orderedAnswers.length < stateActs?.currentQuestion?.answers?.length
    ) {
      setShowAlertBadAnswerNumber(true);
      return;
    }

    // Save symbol choosen
    if (stateActs?.currentQuestion?.questionType?.name == "classement_symbol") {
      let nameSymbol = "";
      for (let answer of stateActs.currentQuestion.answers) {
        if (answer == orderedAnswers[0])
          nameSymbol = answer.text.content;
      }

      dispatch(storeSymbol(nameSymbol));
    }

    // Control if at least one percentage is given and if it is not 0
    if (stateActs?.currentQuestion?.questionType?.name == "pourcentage") {
      const iteratorPercent = percentAnswers.values();
      let totalPercent = 0;
      for (let i = 0; i < percentAnswers.size; i++) {
        totalPercent += iteratorPercent.next().value;
      }

      if (totalPercent == 0) {
        setShowAlertNoAnswer(true);
        return;
      }
    }

    // If answer has a feedback
    if (containsFeedback) {
      setOpenFeedbackModal(true);
      return;
    }

    return true;
  } else {
    setShowAlertNoAnswer(true);
    return false;
  }
}
