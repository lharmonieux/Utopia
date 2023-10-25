import { useContext, useEffect, useState } from "react";
import { AppContext } from "./admin/GameContext.jsx";
import { CssVarsProvider } from "@mui/joy/styles";
import * as Joy from "@mui/joy";
import Propositions from "../components/Propositions.jsx";
import Characters from "../components/Characters.jsx";
import TextArea from "../components/TextArea.jsx";
import { Link, useNavigate } from "react-router-dom";
import { AlertNoAnswer } from "../components/Alert.jsx";
import Scores from "../components/Scores.jsx";

const Game = () => {
  // variables
  const { currentAct, characters } = useContext(AppContext);
  const navigate = useNavigate();

  // State
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [idCharacterSelected, setIdCharacterSelected] = useState("");
  const [openCaracteristic, setOpenCaracteristic] = useState(false);
  const [caracteristicToDisplay, setCaracteristicToDisplay] = useState("");
  const [containsFeedback, setContainsFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const [orderQuestion, setOrderQuestion] = useState(1);
  const [storeAnswer, setStoreAnswer] = useState([]);
  const [openEndModal, setOpenEndModal] = useState(false);
  const [scoresThematic, setScoresThematic] = useState([]);
  const [showAlertNoAnswer, setShowAlertNoAnswer] = useState(false);
  const [town, setTown] = useState("");

  // Getting total number of questions for current act
  let nbQuestions = currentAct?.questions?.length;
  console.log(storeAnswer, scoresThematic);

  useEffect(() => {
    if (currentAct && currentAct.questions) {
      setCurrentQuestion(currentAct?.questions[orderQuestion - 1]);
    }
  }, [currentAct, orderQuestion]);

  const handleSelectedCharacter = (idCharacter) => {
    idCharacter == idCharacterSelected
      ? setIdCharacterSelected("")
      : setIdCharacterSelected(idCharacter);
    characters.map((character) => {
      if (character._id == idCharacter)
        character.selected = !character.selected;
      else character.selected = false;
    });
  };

  const updateStoreAnswer = (selectedAnswer, answerType) => {
    // Remove answer if selected again
    if (selectedAnswer.selected) {
      setStoreAnswer(() =>
        storeAnswer.filter((e) => e._id != selectedAnswer._id)
      );
    }

    // Add Answer selected
    else if (answerType == "proposition_multiple")
      setStoreAnswer([...storeAnswer, selectedAnswer]);
    else setStoreAnswer([selectedAnswer]);
  };

  const handleSelectedProposition = (selectedAnswer, answerType) => {
    if (selectedAnswer.feedback.length != 0) {
      // If answer selected again
      if (feedback == selectedAnswer.feedback) {
        setFeedback("");
        setContainsFeedback(false);
      } else {
        setFeedback(selectedAnswer.feedback);
        setContainsFeedback(true);
      }
    } else setContainsFeedback(false);

    setCurrentQuestion(() => {
      let newCurrentQuestion = {};
      // For unique answer
      if (answerType == "proposition") {
        updateStoreAnswer(selectedAnswer, answerType);
        newCurrentQuestion = {
          ...currentQuestion,
          answers: currentQuestion?.answers.map((answer) => ({
            ...answer,
            selected:
              selectedAnswer._id == answer._id ? !answer.selected : false,
          })),
        };

        return newCurrentQuestion;
      }
      // For multiples answers
      else {
        // 3 answers max for update question State
        if (storeAnswer.length < 3 || selectedAnswer.selected) {
          updateStoreAnswer(selectedAnswer, answerType);
          newCurrentQuestion = {
            ...currentQuestion,
            answers: currentQuestion?.answers.map((answer) => ({
              ...answer,
              selected:
                selectedAnswer._id == answer._id
                  ? !answer.selected
                  : answer.selected,
            })),
          };

          return newCurrentQuestion;
        }
      }

      return currentQuestion;
    });
  };

  const answerToDisplay = () => {
    switch (currentQuestion?.answer_type) {
      //Affichage du choix des persos
      case "personnage":
        return (
          <Characters
            characters={characters}
            handleSelectedCharacter={handleSelectedCharacter}
            setOpenCaracteristic={setOpenCaracteristic}
            setCaracteristicToDisplay={setCaracteristicToDisplay}
            openCaracteristic={openCaracteristic}
            caracteristicToDisplay={caracteristicToDisplay}
          />
        );

      // Affichage des propositions de reponse
      case "proposition":
      case "proposition_multiple":
        return (
          <Propositions
            currentQuestion={currentQuestion}
            handleSelectedProposition={handleSelectedProposition}
          />
        );

      // Affichage d'une zone de texte
      case "texte":
        return <TextArea town={town} setTown={setTown} />;

      default:
        break;
    }
  };

  const modalFeedback = () => (
    // Modal for feedbacks
    <Joy.Modal
      open={openFeedbackModal}
      onClose={() => {
        setContainsFeedback(false);
        setFeedback("");
        setOrderQuestion(orderQuestion + 1);
        setCurrentQuestion(currentAct?.questions[orderQuestion + 1]);
        setStoreAnswer([]);
        setOpenFeedbackModal(false);
      }}
    >
      <Joy.ModalDialog>
        <Joy.ModalClose variant="outlined" />

        <Joy.Typography level="title-md">{feedback}</Joy.Typography>

        <Joy.Button
          onClick={() => {
            setContainsFeedback(false);
            setFeedback("");
            setOrderQuestion(orderQuestion + 1);
            setCurrentQuestion(currentAct?.questions[orderQuestion + 1]);
            setStoreAnswer([]);
            setShowAlertNoAnswer(false);
            setOpenFeedbackModal(false);
          }}
        >
          Continuer
        </Joy.Button>
      </Joy.ModalDialog>
    </Joy.Modal>
  );

  // Modal for end of act / Summary
  const endOfAct = () => (
    <Joy.Modal
      open={openEndModal}
      onClose={() => {
        setOpenEndModal(false);
        navigate("/");
      }}
    >
      <Joy.ModalDialog>
        <Joy.ModalClose variant="outlined" />
        <Joy.DialogTitle>Fin de l&apos;acte</Joy.DialogTitle>

        <Joy.Typography>
          Bravo !Nombre habitants ont d&apos;ores et déjà fait part de leur
          intérêt pour rejoindre votre ville !Statut de la ville : en projet
        </Joy.Typography>

        <Link to="/">
          <Joy.Button onClick={() => setOpenEndModal(false)}>Next</Joy.Button>
        </Link>
      </Joy.ModalDialog>
    </Joy.Modal>
  );

  const storeScore = () => {
    if (storeAnswer.length > 0) {
      let copyScoresThematic = [...scoresThematic];
      for (const answer of storeAnswer) {
        // If score is eligible to store
        if (answer.score == -1) continue
        else {
          if (scoresThematic.length == 0)
            setScoresThematic(
              [
                {
                  thematic: currentQuestion?.thematic,
                  totalScore: answer.score,
                }
              ])

          //If scoresThematic wasn't empty
          else {
           
            let newScoresThematic = [];
            let exist = {};
            for (const line of copyScoresThematic) { 
              if (line.thematic == currentQuestion?.thematic) {
                exist = line;
              }
              else{
                console.log(line);
                newScoresThematic.push({
                  thematic: line.thematic,
                  totalScore: line.totalScore,
                });
              }
                
            }

            if (exist) copyScoresThematic = [...newScoresThematic, { thematic: exist.thematic, totalScore: exist.totalScore + answer.score }]
            else copyScoresThematic = [...newScoresThematic, { thematic: currentQuestion?.thematic, totalScore: answer.score }]
          }
        }
      }

      setScoresThematic(copyScoresThematic);
    }
  };

  // Manage for the next element to display
  const nextPage = () => {
    //Control of if there are an given answer
    if (storeAnswer.length > 0 || town || idCharacterSelected) {
      //Display end modal to summarize act
      if (orderQuestion == nbQuestions) setOpenEndModal(true);

      //Store score of the answer if proposition
      storeScore();

      //Display next page of act
      if (containsFeedback) setOpenFeedbackModal(true);
      else {
        setOrderQuestion(orderQuestion + 1);
        setCurrentQuestion(currentAct?.questions[orderQuestion + 1]);
        setStoreAnswer([]);
        setTown("");
        setIdCharacterSelected("");
        setShowAlertNoAnswer(false);
      }
    } else setShowAlertNoAnswer(true);
  };

  return (
    <CssVarsProvider>
      <Joy.Stack alignItems="center" sx={{ height: "100vh" }} spacing={2}>
        {/* Alert zone */}
        <Joy.Sheet
          sx={{
            width: "50vw",
            marginLeft: "10px",
            display: showAlertNoAnswer ? "block" : "none",
          }}
        >
          <AlertNoAnswer />
        </Joy.Sheet>

        {/* Principal content zone  */}
        <Joy.Stack
          sx={{
            height: "85vh",
          }}
          alignItems="center"
          direction="row"
          spacing={2}
        >
          {/* Container for scores  */}
          <Joy.Sheet
            variant="soft"
            sx={{
              width: "20vw",
              height: "100%",
            }}
          >
            <Scores scoresThematic={scoresThematic} />
          </Joy.Sheet>

          {/* Container for act  */}
          <Joy.Sheet
            variant="soft"
            sx={{
              width: "70vw",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Joy.Typography level="h3">
              Acte {currentAct?.chapter} : {currentAct?.name}
            </Joy.Typography>

            <Joy.Sheet variant="soft" sx={{ padding: "30px" }}>
              <Joy.Typography level="title-md" sx={{ textAlign: "center" }}>
                {currentQuestion?.content}
              </Joy.Typography>
            </Joy.Sheet>
            {answerToDisplay()}

            <Joy.Sheet
              variant="soft"
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Joy.Button size="lg" onClick={() => nextPage()}>
                Valider
              </Joy.Button>
            </Joy.Sheet>
            {modalFeedback()}
            {endOfAct()}
          </Joy.Sheet>
        </Joy.Stack>
      </Joy.Stack>
    </CssVarsProvider>
  );
};

export default Game;
