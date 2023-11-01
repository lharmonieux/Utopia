import { useContext, useEffect, useState } from "react";
import { AppContext } from "./admin/GameContext.jsx";
import { CssVarsProvider } from "@mui/joy/styles";
import * as Joy from "@mui/joy";
import * as Icon from "@mui/icons-material";
import Propositions from "../components/Propositions.jsx";
import Characters from "../components/Characters.jsx";
import TextArea from "../components/TextArea.jsx";
import { Link, useNavigate } from "react-router-dom";
import { AlertNoAnswer } from "../components/Alert.jsx";
import Drawer from "../components/Drawer.jsx";
import DisplayingText from "../components/DisplayingText.jsx";

const Game = () => {
  // variables
  const { currentAct, characters, acts } = useContext(AppContext);
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
  const [showDrawer, setShowDrawer] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // Getting total number of questions for current act
  let nbQuestions = currentAct?.questions?.length;

  useEffect(() => {
    if (currentAct && currentAct.questions) {
      setCurrentQuestion(currentAct?.questions[orderQuestion - 1]);
    }
  }, [currentAct, orderQuestion]);

  const handleSelectedCharacter = (selectedCharacter) => {
    //If selected again
    if (selectedCharacter._id == idCharacterSelected) {
      setIdCharacterSelected("");
      setStoreAnswer([]);
    } else {
      setIdCharacterSelected(selectedCharacter._id);
      setStoreAnswer([selectedCharacter]);
    }

    characters.map((character) => {
      if (character._id == selectedCharacter._id)
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
    switch (currentQuestion?.answerType) {
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

        <Joy.Typography level="title-md">
          <DisplayingText sentence={feedback} />
        </Joy.Typography>

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
        <Joy.DialogTitle>
          Résolution de l&apos;Acte {currentAct?.chapter}
        </Joy.DialogTitle>

        <Joy.Stack direction="column" sx={{ display: "flex" }} spacing={1}>
          <Joy.Typography>
            <DisplayingText
              sentence={currentAct?.resolution
                ?.replace(
                  "totalResidents",
                  scoresThematic.filter((e) => e.thematic == "Residents")[0]
                    ?.totalScore
                )
                .replace("townStatus", currentAct?.townStatus)}
            />
          </Joy.Typography>

          {/* <Joy.Stack
              direction="row"
              spacing={2}
              justifyContent="space-evenly"
            >
              {scoresThematic.map((e) => (
                <Joy.Typography key={e.thematic}>
                  {e.thematic} : {e.totalScore}
                </Joy.Typography>
              ))}
            </Joy.Stack> */}

          <Joy.Sheet
            sx={{ flex: 1, display: "flex", justifyContent: "center" }}
          >
            <Link to="/">
              <Joy.Button onClick={() => setOpenEndModal(false)}>
                Next
              </Joy.Button>
            </Link>
          </Joy.Sheet>
        </Joy.Stack>
      </Joy.ModalDialog>
    </Joy.Modal>
  );

  const storeScore = () => {
    if (storeAnswer.length > 0) {
      let copyScoresThematic = [...scoresThematic];
      for (const answer of storeAnswer) {
        // If score is eligible to store
        if (answer.score == -1) continue;
        else {
          if (copyScoresThematic.length == 0) {
            copyScoresThematic.push({
              thematic: answer?.thematic,
              totalScore: answer.score,
            });

            //Initializing of number of residents won
            copyScoresThematic.push({
              thematic: "Residents",
              totalScore: answer?.givenResidents || 0,
            });
          }

          //If scoresThematic wasn't empty
          else {
            let newScoresThematic = [];
            let existThematic = new Map();
            let existResidents = new Map();
            for (const line of copyScoresThematic) {
              //Save thematic into a variable if already existThematic as score
              if (line.thematic == answer?.thematic) {
                existThematic.set("thematic", line.thematic);
                existThematic.set("totalScore", line.totalScore);
              } else if (line.thematic == "Residents") {
                existResidents.set("thematic", line.thematic);
                existResidents.set("totalScore", line.totalScore);
              } else {
                newScoresThematic.push({
                  thematic: line.thematic,
                  totalScore: line.totalScore,
                });
              }
            }

            //Update states of thematic's scores
            if (existThematic.size != 0)
              copyScoresThematic = [
                ...newScoresThematic,
                {
                  thematic: existThematic.get("thematic"),
                  totalScore: existThematic.get("totalScore") + answer.score,
                },
                {
                  thematic: existResidents.get("thematic"),
                  totalScore:
                    existResidents.get("totalScore") +
                    (answer?.givenResidents || 0),
                },
              ];
            else {
              copyScoresThematic = [
                ...newScoresThematic,
                {
                  thematic: answer?.thematic,
                  totalScore: answer.score,
                },
                {
                  thematic: existResidents.get("thematic"),
                  totalScore:
                    existResidents.get("totalScore") +
                    (answer?.givenResidents || 0),
                },
              ];
            }
          }
        }
      }

      setScoresThematic(copyScoresThematic);
    }
  };

  // Manage for the next element to display
  const nextPage = () => {
    //Control of if there are an given answer
    if (storeAnswer.length > 0 || town) {
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

  const modalSummary = () => (
    <Joy.Modal open={showSummary} onClose={() => setShowSummary(false)}>
      <Joy.ModalDialog>
        <Joy.ModalClose variant="outlined" />
        <Joy.DialogTitle>
          <Joy.Typography level="h3" sx={{ textAlign: "center" }}>
            Sommaire
          </Joy.Typography>
        </Joy.DialogTitle>

        <Joy.List>
          {acts.map((act) => (
            <Joy.ListItem key={act._id}>
              <Joy.ListItemButton>
                Acte {act.chapter} : {act.name}
              </Joy.ListItemButton>
            </Joy.ListItem>
          ))}
        </Joy.List>
      </Joy.ModalDialog>
    </Joy.Modal>
  );

  return (
    <CssVarsProvider>
      <Joy.Stack alignItems="center" sx={{ height: "100vh" }} spacing={1}>
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
        <Joy.Stack spacing={2} direction="row" sx={{ height: "90%" }}>
          {/* Drawer button  */}
          <Drawer
            showDrawer={showDrawer}
            setShowDrawer={setShowDrawer}
            setShowSummary={setShowSummary}
          />
          <Joy.IconButton variant="outlined" sx={{ height: "5%" }}>
            <Icon.Menu onClick={() => setShowDrawer(true)} />
          </Joy.IconButton>

          {/* Container for act  */}
          <Joy.Sheet
            variant="soft"
            sx={{
              width: "80vw",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Joy.Box sx={{ width: "100%", padding: "5px" }}>
              <Joy.Typography level="h3" sx={{ textAlign: "left" }}>
                Acte {currentAct?.chapter} : {currentAct?.name}
              </Joy.Typography>
            </Joy.Box>

            <Joy.Sheet variant="soft" sx={{ padding: "30px" }}>
              <DisplayingText sentence={currentQuestion?.content} />
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
            {modalSummary()}
          </Joy.Sheet>
        </Joy.Stack>
      </Joy.Stack>
    </CssVarsProvider>
  );
};

export default Game;
