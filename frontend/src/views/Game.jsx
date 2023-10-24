import { useContext, useEffect, useState } from "react";
import { AppContext } from "./admin/GameContext.jsx";
import { CssVarsProvider } from "@mui/joy/styles";
import * as Joy from "@mui/joy";
import Propositions from "../components/Propositions.jsx";
import Characters from "../components/Characters.jsx";
import TextArea from "../components/TextArea.jsx";
import { Link, useNavigate } from "react-router-dom";

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

  // Getting total number of questions for current act
  let nbQuestions = currentAct?.questions?.length;

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
      if (feedback) {
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
        return <TextArea />;

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

  // Manage for the next element to display
  const nextPage = () => {
    //Display end modal to summarize act
    if (orderQuestion == nbQuestions) setOpenEndModal(true);

    //Display next page of act
    if (containsFeedback) () => setOpenFeedbackModal(true);
    else {
      setOrderQuestion(orderQuestion + 1);
      setCurrentQuestion(currentAct?.questions[orderQuestion + 1]);
      setStoreAnswer([]);
    }
  };

  return (
    <CssVarsProvider>
      <Joy.Stack
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100vh" }}
      >
        <Joy.Sheet
          variant="soft"
          sx={{
            width: "60vw",
            height: "80vh",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Joy.Typography level="h3">
            Acte {currentAct?.chapter}: {currentAct?.name}
          </Joy.Typography>

          <Joy.Sheet variant="soft" sx={{ padding: "30px" }}>
            <Joy.Typography level="title-md" sx={{ textAlign: "center" }}>
              {currentQuestion?.content}
            </Joy.Typography>
          </Joy.Sheet>
          <>{answerToDisplay()}</>

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
    </CssVarsProvider>
  );
};

export default Game;
