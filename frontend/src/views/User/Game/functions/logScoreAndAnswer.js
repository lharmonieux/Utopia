import { updateScoreAndAnswer } from "../../../../utils/redux/userSlice";

export default function logScoreAndAnswer({
  dispatch,
  question,
  objectSelected,
  stateEntity,
  textareaValue,
}) {
  try {
    let logScores = new Map();
    let logAnswers = new Map();
    let totalResidentsGot = 0;
    let totalResidentsPossible = 0;

    if (
      question.questionType.name == "texte" ||
      question.questionType.name == "texte_ville" ||
      question.questionType.name == "texte_fete"
    ) {
      //Answers
      logAnswers.set("question", question.text.content);
      logAnswers.set("answers", [
        {
          content: textareaValue.get(question.text.content).answerText,
          score: 0,
          scoreMaxPossible: 0,
          nbResidents: 0,
          nbResidentsMaxPossible: 0,
        },
      ]);

      //Residents
      totalResidentsGot = 0;
      totalResidentsPossible = 0;

      //Update user save's redux store
      dispatch(
        updateScoreAndAnswer({
          totalResidentsGot,
          totalResidentsPossible,
          scoresObject: {
            thematic: question.thematic?._id,
            scoreGot: 0,
            scoreMaxPossible: 0,
          },
          answersObject: {
            question: logAnswers.get("question"),
            answers: logAnswers.get("answers"),
          },
        })
      );
    } else {
      //Score
      // For multiple choice
      if (Array.isArray(objectSelected)) {
        // Getting of total score got
        let scoreGot = 0;
        objectSelected.forEach((e) => {
          scoreGot += e.score || 0;
        });
        logScores.set("scoreGot", scoreGot);

        // Getting of total score possible
        let scoreMaxPossible = 0;
        stateEntity.forEach((e) => {
          if (e.score > 0 && question.nbOfAnswersRequired) {
            scoreMaxPossible = e.score * question.nbOfAnswersRequired;
            return;
          } else {
            scoreMaxPossible += e.score || 0;
          }
        });
        logScores.set("scoreMaxPossible", scoreMaxPossible);

        //Residents
        // Getting of total residents got
        objectSelected.forEach((e) => {
          totalResidentsGot += e.givenResidents || 0;
        });

        // Getting of total residents possible
        stateEntity.forEach((e) => {
          if (e.givenResidents > 0 && question.nbOfAnswersRequired) {
            totalResidentsPossible =
              e.givenResidents * question.nbOfAnswersRequired;
            return;
          } else {
            totalResidentsPossible += e.givenResidents || 0;
          }
        });

        //Answers
        logAnswers.set("question", question.text.content);
        let answersToStore = [];
        objectSelected.forEach((e) => {
          answersToStore.push({
            content: e?.name || e?.text?.content || "Réponse absente",
            score: e?.score || 0,
            nbResidents: e?.givenResidents || 0,
          });
        });
        logAnswers.set("answers", answersToStore);
      }
      // For single choice
      else {
        logScores.set("scoreGot", objectSelected?.score || 0);
        const sortedEntityByScore = [...stateEntity];
        let maxScore = 0;
        sortedEntityByScore.forEach((e) => {
          if (e.score > maxScore) {
            maxScore = e.score;
          }
        });
        logScores.set("scoreMaxPossible", maxScore);

        //Residents
        totalResidentsGot = objectSelected?.givenResidents || 0;
        const sortedEntityByResidents = [...stateEntity];
        let maxResidents = 0;
        sortedEntityByResidents.forEach((e) => {
          if (e.givenResidents > maxResidents) {
            maxResidents = e.givenResidents;
          }
        });
        totalResidentsPossible = maxResidents;

        //Answers
        logAnswers.set("question", question.text.content);
        let answersToStore = [
          {
            content: objectSelected?.name || objectSelected?.text.content,
            score: objectSelected?.score || 0,
            nbResidents: objectSelected?.givenResidents || 0,
          },
        ];

        if (objectSelected?.modalAnswer?.text) {
          answersToStore.push({
            content: objectSelected.modalAnswer.text,
            score: 0,
            scoreMaxPossible: 0,
            nbResidents: 0,
            nbResidentsMaxPossible: 0,
          });
        }

        logAnswers.set("answers", answersToStore);
      }

      //Update user save's redux store
      dispatch(
        updateScoreAndAnswer({
          totalResidentsGot,
          totalResidentsPossible,
          scoresObject: {
            thematic: question.thematic?._id || objectSelected?.thematic,
            scoreGot: logScores.get("scoreGot"),
            scoreMaxPossible: logScores.get("scoreMaxPossible"),
          },
          answersObject: {
            question: logAnswers.get("question"),
            thematic: question.thematic?._id || objectSelected?.thematic,
            scoreMaxPossible: logAnswers.get("scoreMaxPossible"),
            nbResidentsMaxPossible: logAnswers.get("nbResidentsMaxPossible"),
            answers: logAnswers.get("answers"),
          },
        })
      );
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
