import { useContext, useEffect, useState } from "react";
import { AppContext } from "./admin/GameContext.jsx";
import { CssVarsProvider } from "@mui/joy/styles";
import {
  Stack,
  Sheet,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemButton,
  Typography,
  Button,
  Modal,
  ModalDialog,
  ModalClose,
  DialogTitle,
} from "@mui/joy";
import { AiOutlineMenuFold } from "react-icons/ai";
import Propositions from "../components/Propositions.jsx";
import Characters from "../components/Characters.jsx";
import TextArea from "../components/TextArea.jsx";
import { Link, useNavigate } from "react-router-dom";
import { AlertNoAnswer } from "../components/Alert.jsx";
import MenuComponent from "../components/Menu.jsx";
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
    <Modal
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
      <ModalDialog>
        <ModalClose variant="outlined" />

        <Typography level="title-md">
          <DisplayingText sentence={feedback} />
        </Typography>

        <Button
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
        </Button>
      </ModalDialog>
    </Modal>
  );

  // Modal for end of act / Summary
  const endOfAct = () => (
    <Modal
      open={openEndModal}
      onClose={() => {
        setOpenEndModal(false);
        navigate("/");
      }}
    >
      <ModalDialog>
        <ModalClose variant="outlined" />
        <DialogTitle>
          Résolution de l&apos;Acte {currentAct?.chapter}
        </DialogTitle>

        <Stack direction="column" sx={{ display: "flex" }} spacing={1}>
          <Typography>
            <DisplayingText
              sentence={currentAct?.resolution
                ?.replace(
                  "totalResidents",
                  scoresThematic.filter((e) => e.thematic == "Residents")[0]
                    ?.totalScore
                )
                .replace("townStatus", currentAct?.townStatus)}
            />
          </Typography>

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

          <Sheet sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <Link to="/">
              <Button onClick={() => setOpenEndModal(false)}>Next</Button>
            </Link>
          </Sheet>
        </Stack>
      </ModalDialog>
    </Modal>
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
    <Modal open={showSummary} onClose={() => setShowSummary(false)}>
      <ModalDialog>
        <ModalClose variant="outlined" />
        <DialogTitle>
          <Typography level="h3" sx={{ textAlign: "center" }}>
            Sommaire
          </Typography>
        </DialogTitle>

        <List>
          {acts.map((act) => (
            <ListItem key={act._id}>
              <ListItemButton>
                Acte {act.chapter} : {act.name}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </ModalDialog>
    </Modal>
  );

  return (
    <CssVarsProvider>
      <Stack alignItems="center" sx={{ height: "100vh" }} spacing={1}>
        {/* Alert zone */}
        <Sheet
          sx={{
            width: "50vw",
            marginLeft: "10px",
            display: showAlertNoAnswer ? "block" : "none",
          }}
        >
          <AlertNoAnswer />
        </Sheet>

        {/* Principal content zone  */}
        <Stack spacing={2} direction="row" sx={{ height: "90%" }}>
          {/* Drawer button  */}
          <MenuComponent
            showDrawer={showDrawer}
            setShowDrawer={setShowDrawer}
            setShowSummary={setShowSummary}
          />
          <IconButton variant="outlined" sx={{ height: "5%" }} onClick={() => setShowDrawer(true)}>
            <AiOutlineMenuFold size={25} /> 
          </IconButton>

          {/* Container for act  */}
          <Sheet
            variant="soft"
            sx={{
              width: "80vw",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ width: "100%", padding: "5px" }}>
              <Typography level="h3" sx={{ textAlign: "left" }}>
                Acte {currentAct?.chapter} : {currentAct?.name}
              </Typography>
            </Box>

            <Sheet variant="soft" sx={{ padding: "30px" }}>
              <DisplayingText sentence={currentQuestion?.content} />
            </Sheet>
            {answerToDisplay()}

            <Sheet
              variant="soft"
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Button size="lg" onClick={() => nextPage()}>
                Valider
              </Button>
            </Sheet>
            {modalFeedback()}
            {endOfAct()}
            {modalSummary()}
          </Sheet>
        </Stack>
      </Stack>
    </CssVarsProvider>
  );
};

export default Game;
