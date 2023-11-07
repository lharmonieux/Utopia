import { useContext, useEffect, useState } from "react";
import { AppContext } from "./admin/GameContext.jsx";
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
import ActPresentation from "../components/ActPresentation.jsx";
import "animate.css";
import ScaleProposition from "../components/ScaleProposition.jsx";
import { animateOut } from "../middlewares/Animation.js";

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
  const [showActPresentation, setShowActPresentation] = useState(true);
  const [showMainContent, setShowMainContent] = useState(false);
  const [scaleAnswers, setScaleAnswers] = useState(new Map());
  const [openScaleModal, setOpenScaleModal] = useState(false);

  // Getting total number of questions for current act
  let nbQuestions = currentAct?.questions?.length;

  //Var for modal entrance animation
  let animationModalIn = "animate__animated animate__zoomIn animate__fast"

  useEffect(() => {
    if (orderQuestion == 1) {
      setShowActPresentation(true);
      if (currentAct?.questions)
        setCurrentQuestion(currentAct?.questions[orderQuestion - 1]);
    } else {
      //Show the act's presentation once
      setShowActPresentation(false);

      //Get the element with animation and detect the end of animation for doing anything else
      const stackMainContent = document.querySelector(".stack-main-content");
      if (stackMainContent && !showMainContent)
        stackMainContent.addEventListener("animationend", () => {
          setShowMainContent(true);
          setCurrentQuestion(currentAct?.questions[orderQuestion - 1]);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      case "notation":
        return (
          <ScaleProposition
            currentQuestion={currentQuestion}
            setScaleAnswers={setScaleAnswers}
          />
        );

      default:
        break;
    }
  };

  const modalFeedback = () => (
    // Modal for feedbacks
    <Modal
      open={openFeedbackModal}
      onClose={() =>
        animateOut(openFeedbackModal, "#modal-feedback-content", () => {
          setOpenFeedbackModal(false);
          initializingState();
        })
      }
      className={animationModalIn}
      id={"modal-feedback-content"}
    >
      <ModalDialog>
        <ModalClose variant="outlined" />

        <Typography level="title-md">
          <DisplayingText sentence={feedback} />
        </Typography>

        <Button
          onClick={() =>
            animateOut(openFeedbackModal, "#modal-feedback-content", () => {
              setOpenFeedbackModal(false);
              initializingState();
            })
          }
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
        animateOut(openEndModal, "#modal-end", () => {
          setOpenEndModal(false);
          navigate("/");
          initializingState();
        });
      }}
      className={animationModalIn}
      id={"modal-end"}
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
              <Button
                onClick={() => {
                  animateOut(openEndModal, "#modal-end", () => {
                    setOpenEndModal(false);
                    initializingState();
                  });
                }}
              >
                Next
              </Button>
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
        // If answer isn't eligible to store
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

  const initializingState = () => {
    setShowMainContent(false);
    setContainsFeedback(false);
    setFeedback("");
    setOrderQuestion(orderQuestion + 1);
    setStoreAnswer([]);
    setTown("");
    setIdCharacterSelected("");
    setShowAlertNoAnswer(false);
    scaleAnswers.clear();
    setScaleAnswers(new Map(scaleAnswers));
  };

  // Manage for the next element to display
  const nextPage = () => {
    //Control of if there are an given answer
    if (storeAnswer.length > 0 || town || scaleAnswers.size > 0) {
      //Scale answer control
      if (scaleAnswers.size > 0) setOpenScaleModal(true);
      else {
        //Store score of the answer if proposition
        storeScore();

        // If answer has a feedback
        if (containsFeedback) setOpenFeedbackModal(true);
        else {
          //Display end modal to summarize act
          if (orderQuestion == nbQuestions) setOpenEndModal(true);
          //Display next page of act
          else initializingState();
        }
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

  const scaleModal = () => {
    let choosenMotto = [];
    if (scaleAnswers) {
      const scales = scaleAnswers.values();
      let maxScale = 0;
      //Calcul max note given
      for (let nb of scales) if (nb > maxScale) maxScale = nb;

      //Get Id of answer for max note given
      let idMaxScale = "";
      for (let [key, value] of scaleAnswers)
        if (value == maxScale) idMaxScale = key;

      //Result : choosen motto
      choosenMotto = currentQuestion?.answers.filter(
        (answer) => answer._id == idMaxScale
      );
    }

    return (
      <Modal
        open={openScaleModal}
        onClose={() =>
          animateOut(openScaleModal, "#modal-scale", () =>
            setOpenScaleModal(false)
          )
        }
        className={animationModalIn}
        id={"modal-scale"}
      >
        <ModalDialog>
          <ModalClose variant="outlined" />
          <DialogTitle>
            <Typography level="h3" sx={{ textAlign: "center" }}>
              Votre devise
            </Typography>
          </DialogTitle>

          <Typography>
            En se basant sur vos notes, la devise qui vous convient le mieux est
            :{" "}
            <Typography sx={{ fontWeight: "bold" }}>
              {choosenMotto && choosenMotto[0]?.content}
            </Typography>
          </Typography>

          <Button
            onClick={() =>
              animateOut(openScaleModal, "#modal-scale", () =>
                setOpenScaleModal(false)
              )
            }
          >
            Retour au choix
          </Button>
          <Button
            onClick={() =>
              animateOut(openScaleModal, "#modal-scale", () => {
                setOpenScaleModal(false);
                updateStoreAnswer(choosenMotto[0], currentQuestion?.answerType);
                storeScore();
                initializingState();
              })
            }
          >
            Continuer
          </Button>
        </ModalDialog>
      </Modal>
    );
  };

  return (
    <>
      {showActPresentation ? (
        <ActPresentation
          act={currentAct}
          setShowActPresentation={setShowActPresentation}
          setShowMainContent={setShowMainContent}
        />
      ) : (
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
          <Stack
            spacing={2}
            direction="row"
            sx={{ height: "90%" }}
            className={`animate__animated animate__${
              showMainContent ? "lightSpeedInLeft" : "lightSpeedOutRight"
            } animate__faster stack-main-content`}
          >
            {/* Drawer button  */}
            <MenuComponent
              showDrawer={showDrawer}
              setShowDrawer={setShowDrawer}
              setShowSummary={setShowSummary}
            />
            <IconButton
              variant="outlined"
              sx={{ height: "5%" }}
              onClick={() => setShowDrawer(true)}
            >
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
              <Box sx={{ width: "100%", padding: "10px" }}>
                <Typography level="h2" sx={{ textAlign: "left" }}>
                  Acte {currentAct?.chapter}
                </Typography>
                <Typography sx={{ fontWeight: "bold" }}>
                  {currentAct?.name}
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
              {openFeedbackModal && modalFeedback()}
              {endOfAct()}
              {modalSummary()}
              {openScaleModal && scaleModal()}
            </Sheet>
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default Game;
