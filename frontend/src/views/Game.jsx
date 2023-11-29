import { useContext, useEffect, useState } from "react";
import { AppContext } from "./admin/GameContext.jsx";
import {
  Stack,
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
  CircularProgress,
  CssVarsProvider,
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
import cloudinary from "../utils/cloudinary.js";
import { scale } from "@cloudinary/url-gen/actions/resize";
import { typographyTheme } from "../utils/themeJoy.js";
import { AdvancedImage } from "@cloudinary/react";
import { byAngle } from "@cloudinary/url-gen/actions/rotate";
import { colors } from "../utils/colors.js";
import Towns from "../components/Towns.jsx";

const Game = () => {
  // variables
  const { currentAct, characters, acts, towns } = useContext(AppContext);
  const navigate = useNavigate();

  // State
  const [currentQuestion, setCurrentQuestion] = useState();
  const [idCharacterSelected, setIdCharacterSelected] = useState("");
  const [containsFeedback, setContainsFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const [orderQuestion, setOrderQuestion] = useState(1);
  const [storeAnswer, setStoreAnswer] = useState([]);
  const [openEndModal, setOpenEndModal] = useState(false);
  const [scoresThematic, setScoresThematic] = useState([]);
  const [showAlertNoAnswer, setShowAlertNoAnswer] = useState(false);
  const [townName, setTownName] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showActPresentation, setShowActPresentation] = useState(true);
  const [showMainContent, setShowMainContent] = useState(false);
  const [scaleAnswers, setScaleAnswers] = useState(new Map());
  const [openScaleModal, setOpenScaleModal] = useState(false);
  const [fullContentBox, setFullContentBox] = useState();
  const [widthMainContent, setWidthMainContent] = useState(0);
  const [heightMainContent, setHeightMainContent] = useState(0);
  const [isCharactersImg, setIsCharactersImg] = useState(false);

  //Images's state
  const [actPresentationImg, setActPresentationImg] = useState();
  const [decorationImg, setDecorationImg] = useState();
  const [reversedDecorationImg, setReversedDecorationImg] = useState();
  const [titleActImg, setTitleActImg] = useState();
  const [logoAppImg, setLogoAppImg] = useState();
  const [questionBackgroundImg, setQuestionBackgroundImg] = useState();
  const [questionContentImg, setQuestionContentImg] = useState();
  const [feedbackImg, setFeedbackImg] = useState();
  const [titleEndActImg, setTitleEndActImg] = useState();
  const [rankEndActImg, setRankEndActImg] = useState();
  const [bgEndActImg, setBgEndActImg] = useState();

  // Getting total number of questions for current act
  let nbQuestions = currentAct?.questions?.length;

  //Var for modal entrance animation
  let animationModalIn = "animate__animated animate__zoomIn animate__fast";

  useEffect(() => {
    if (showActPresentation) {
      //Loading images
      setActPresentationImg(
        cloudinary
          .image(`exploria/${currentAct?.visual?.backgroundImg}`)
          .quality("auto:best")
          .format("png")
      );
      setDecorationImg(
        cloudinary
          .image(`exploria/${currentAct?.visual?.decorationImg}`)
          .quality("auto:best")
          .format("png")
      );
      setReversedDecorationImg(
        cloudinary
          .image(`exploria/${currentAct?.visual?.decorationImg}`)
          .rotate(byAngle(180))
          .quality("auto:best")
          .format("png")
      );
      setTitleActImg(
        cloudinary
          .image(`exploria/${currentAct?.visual?.titleImg}`)
          .quality("auto:best")
          .format("png")
      );
      setLogoAppImg(
        cloudinary
          .image(`exploria/${currentAct?.visual?.logoAppImg}`)
          .quality("auto:best")
          .format("png")
      );
    } else {
      //Get the element with animation and detect the end of animation for doing anything else
      setFullContentBox(document.querySelector("#game-full-content"));
      if (fullContentBox && !showMainContent) {
        if (orderQuestion > 1)
          fullContentBox.addEventListener("animationend", () => {
            setCurrentQuestion(currentAct?.questions[orderQuestion - 1]);
            setShowMainContent(true);
          });
        else {
          setCurrentQuestion(currentAct?.questions[orderQuestion - 1]);
          setShowMainContent(true);
        }
      }

      if (fullContentBox) {
        const mainContent = document.querySelector("#game-main-content");
        //Sizes for the game's content and images
        if (mainContent) {
          setWidthMainContent(mainContent.clientWidth);
          setHeightMainContent(mainContent.clientHeight);
        }

        //Loading of question's datas
        if (currentQuestion) {
          setQuestionBackgroundImg(
            cloudinary
              .image(`exploria/${currentQuestion?.visual?.backgroundImg}`)
              .quality("auto:best")
              .format("png")
          );

          //If question's content has a background image
          if (currentQuestion?.content?.backgroundImg)
            setQuestionContentImg(
              cloudinary
                .image(`exploria/${currentQuestion?.content?.backgroundImg}`)
                .quality("auto:best")
                .format("png")
            );
          else setQuestionContentImg(undefined);

          // If question contains feedbacks for some answers
          if (openFeedbackModal || openScaleModal)
            setFeedbackImg(
              cloudinary
                .image(`exploria/${currentQuestion?.visual?.feedbackImg}`)
                .quality("auto:best")
                .format("png")
            );
          else setFeedbackImg(undefined);

          if (orderQuestion == nbQuestions) {
            currentAct?.resolution?.titleImg &&
              setTitleEndActImg(
                cloudinary
                  .image(`exploria/${currentAct.resolution.titleImg}`)
                  .quality("auto:best")
                  .format("png")
              );

            currentAct?.resolution?.rankImg &&
              setRankEndActImg(
                cloudinary
                  .image(`exploria/${currentAct.resolution.rankImg}`)
                  .quality("auto:best")
                  .format("png")
              );

            currentAct?.resolution?.backgroundImg &&
              setBgEndActImg(
                cloudinary
                  .image(`exploria/${currentAct.resolution.backgroundImg}`)
                  .quality("auto:best")
                  .format("png")
              );
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    showActPresentation,
    orderQuestion,
    currentAct,
    fullContentBox,
    showMainContent,
    currentQuestion,
    openFeedbackModal,
    openScaleModal,
  ]);

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

  const handleSelectedProposition = (
    selectedAnswer,
    answerType,
    modalTitle
  ) => {
    if (selectedAnswer?.feedback) {
      // If answer selected again
      if (feedback == selectedAnswer.feedback) {
        setFeedback(undefined);
        setContainsFeedback(false);
      } else {
        setFeedback({ content: selectedAnswer.feedback, title: modalTitle });
        setContainsFeedback(true);
      }
    }

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
      //For select town
      else if (answerType == "town")
        updateStoreAnswer(selectedAnswer, answerType);
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
        //Define size's images
        if (!isCharactersImg)
          for (const character of characters) {
            character.img = character.img.resize(
              scale()
                .width(parseInt(widthMainContent * 0.3))
                .height(parseInt(heightMainContent * 0.65))
            );
          }

        !isCharactersImg && setIsCharactersImg(true);

        return (
          isCharactersImg && (
            <Characters
              characters={characters}
              widthMainContent={widthMainContent}
              heightMainContent={heightMainContent}
              setIdCharacterSelected={setIdCharacterSelected}
              setStoreAnswer={setStoreAnswer}
              idCharacterSelected={idCharacterSelected}
            />
          )
        );

      // Affichage des propositions de reponse
      case "proposition":
      case "proposition_multiple":
        return (
          <Propositions
            currentQuestion={currentQuestion}
            handleSelectedProposition={handleSelectedProposition}
            heightMainContent={heightMainContent}
            widthMainContent={widthMainContent}
          />
        );

      // Affichage d'une zone de texte
      case "texte":
        return (
          <TextArea
            town={townName}
            setTownName={setTownName}
            widthMainContent={widthMainContent}
            heightMainContent={heightMainContent}
            currentQuestion={currentQuestion}
          />
        );

      case "notation":
        return (
          <ScaleProposition
            currentQuestion={currentQuestion}
            setScaleAnswers={setScaleAnswers}
            heightMainContent={heightMainContent}
            widthMainContent={widthMainContent}
          />
        );

      case "town":
        return (
          <Towns
            currentQuestion={currentQuestion}
            heightMainContent={heightMainContent}
            widthMainContent={widthMainContent}
            towns={towns}
            handleSelectedProposition={handleSelectedProposition}
          />
        );

      default:
        break;
    }
  };

  const modalFeedback = () =>
    // Modal for feedbacks
    feedbackImg &&
    feedbackImg.resize(
      scale()
        .width(parseInt(widthMainContent * 0.5))
        .height(parseInt(heightMainContent * 0.85))
    ) && (
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
        <ModalDialog
          sx={{
            width: parseInt(widthMainContent * 0.5),
            height: parseInt(heightMainContent * 0.85),
            backgroundImage: `url(${feedbackImg.toURL()})`,
            position: "relative",
          }}
        >
          <ModalClose variant="outlined" />
          <Box
            position={"absolute"}
            width={"85%"}
            height={"10%"}
            left={"14%"}
            top={"12%"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Typography
              level="h3"
              textColor={colors.titleBackLight}
              fontWeight={400}
            >
              {feedback.title}
            </Typography>
          </Box>
          <Box
            width={"100%"}
            height={"100%"}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"space-evenly"}
          >
            <Typography padding={2} marginTop={5}>
              <DisplayingText
                sentence={feedback.content}
                level="title-md"
                textColor={"black"}
              />
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
          </Box>
        </ModalDialog>
      </Modal>
    );

  // Modal for end of act / Summary
  const endOfAct = () => {
    return heightMainContent && widthMainContent ? (
      titleEndActImg &&
      titleEndActImg.resize(
        scale()
          .width(parseInt(widthMainContent * 0.7 * 0.5))
          .height(parseInt(heightMainContent * 0.8 * 0.9))
      ) &&
      rankEndActImg &&
      // rankEndActImg.resize() &&
      bgEndActImg &&
      bgEndActImg.resize(
        scale()
          .width(parseInt(widthMainContent * 0.7))
          .height(parseInt(heightMainContent * 0.8))
      ) ? (
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
          <ModalDialog
            sx={{
              height: parseInt(heightMainContent * 0.8),
              width: parseInt(widthMainContent * 0.7),
              backgroundImage: `url(${bgEndActImg.toURL()})`,
              padding: 0,
            }}
          >
            <ModalClose variant="outlined" />

            <Stack
              width={"100%"}
              height={"100%"}
              direction="column"
              display={"flex"}
              spacing={1}
            >
              <Stack
                direction={"row"}
                width={"100%"}
                height={"90%"}
                display={"flex"}
                alignItems={"center"}
                spacing={2}
              >
                {/* Left side  */}
                <Box
                  width={"50%"}
                  height={"100%"}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  sx={{
                    backgroundImage: `url(${titleEndActImg.toURL()})`,
                    borderTopLeftRadius: 5,
                  }}
                >
                  <Typography
                    padding={5}
                    level="h3"
                    textColor={"white"}
                    fontWeight={400}
                  >{`Résolution de l'ACTE ${currentAct?.chapter}`}</Typography>
                </Box>

                {/* Right side  */}
                <Box
                  width={"50%"}
                  height={"90%"}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Typography level="title-lg" textColor={"white"}>
                    {currentAct?.chapter == 1 ? (
                      <DisplayingText
                        sentence={currentAct?.resolution?.text
                          ?.replace(
                            "totalResidents",
                            scoresThematic.filter(
                              (e) => e.thematic == "Residents"
                            )[0]?.totalScore
                          )
                          .replace("townStatus", currentAct?.townStatus)}
                      />
                    ) : (
                      ""
                    )}
                  </Typography>
                </Box>
              </Stack>

              {/* <Stack direction="row" spacing={2} justifyContent="space-evenly">
                {scoresThematic.map((e) => (
                  <Typography key={e.thematic}>
                    {e.thematic} : {e.totalScore}
                  </Typography>
                ))}
              </Stack> */}

              <Box
                sx={{ flex: 1, display: "flex", justifyContent: "center" }}
              >
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
              </Box>
            </Stack>
          </ModalDialog>
        </Modal>
      ) : (
        <Box
          height={"100%"}
          width={"100%"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <CircularProgress variant="soft" color="success" />
        </Box>
      )
    ) : (
      <Box
        height={"100%"}
        width={"100%"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <CircularProgress variant="soft" color="success" />
      </Box>
    );
  };

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
    setTownName("");
    setIdCharacterSelected("");
    setShowAlertNoAnswer(false);
    scaleAnswers.clear();
    setScaleAnswers(new Map(scaleAnswers));
  };

  // Manage for the next element to display
  const nextPage = () => {
    //Control of if there are an given answer
    if (storeAnswer.length > 0 || townName || scaleAnswers.size > 0) {
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

    return heightMainContent && widthMainContent ? (
      feedbackImg &&
      feedbackImg.resize(
        scale()
          .width(parseInt(widthMainContent * 0.7))
          .height(parseInt(heightMainContent * 0.6))
      ) ? (
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
          <ModalDialog
            sx={{
              width: parseInt(widthMainContent * 0.7),
              height: parseInt(heightMainContent * 0.6),
              position: "relative",
              backgroundImage: `url(${feedbackImg.toURL()})`,
            }}
          >
            <ModalClose variant="outlined" />
            <DialogTitle sx={{ position: "absolute", top: "14%", left: "50%" }}>
              Votre devise
            </DialogTitle>

            <Typography sx={{ marginTop: "13%" }}>
              En se basant sur vos notes, la devise qui vous convient le mieux
              est :{" "}
              <Typography sx={{ fontWeight: "bold" }}>
                {choosenMotto && choosenMotto[0]?.content.text}
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
                  updateStoreAnswer(
                    choosenMotto[0],
                    currentQuestion?.answerType
                  );
                  storeScore();
                  initializingState();
                })
              }
            >
              Continuer
            </Button>
          </ModalDialog>
        </Modal>
      ) : (
        <Box
          height={"100%"}
          width={"100%"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <CircularProgress variant="soft" color="success" />
        </Box>
      )
    ) : (
      <Box
        height={"100%"}
        width={"100%"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <CircularProgress variant="soft" color="success" />
      </Box>
    );
  };

  return (
    <>
      {showActPresentation &&
      actPresentationImg &&
      decorationImg &&
      titleActImg &&
      logoAppImg &&
      reversedDecorationImg &&
      currentAct ? (
        <ActPresentation
          act={currentAct}
          setShowActPresentation={setShowActPresentation}
          setShowMainContent={setShowMainContent}
          actPresentationImg={actPresentationImg}
          decorationImg={decorationImg}
          titleActImg={titleActImg}
          logoAppImg={logoAppImg}
          reversedDecorationImg={reversedDecorationImg}
        />
      ) : (
        <CssVarsProvider theme={typographyTheme}>
          <Stack alignItems="center" height={"97vh"} width={"99vw"} spacing={1}>
            {/* Alert zone */}
            <Box
              sx={{
                width: "50vw",
                marginLeft: "10px",
                display: showAlertNoAnswer ? "block" : "none",
              }}
            >
              <AlertNoAnswer />
            </Box>

            {/* Principal content zone  */}
            <Stack
              spacing={2}
              direction="row"
              height={"100%"}
              width={"100%"}
              display={"flex"}
              justifyContent={"center"}
              className={`animate__animated animate__${
                showMainContent ? "lightSpeedInLeft" : "lightSpeedOutRight"
              } animate__faster`}
              id={"game-full-content"}
            >
              {showMainContent ? (
                <>
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
                    <AiOutlineMenuFold size={25} color="white" />
                  </IconButton>

                  {/* Container for act */}
                  <Box
                    height={"100%"}
                    width={"85%"}
                    id={"game-main-content"}
                    position={"relative"}
                  >
                    {widthMainContent && heightMainContent ? (
                      questionBackgroundImg &&
                      questionBackgroundImg.resize(
                        scale()
                          .width(widthMainContent)
                          .height(heightMainContent)
                      ) &&
                      decorationImg &&
                      decorationImg.resize(
                        scale()
                          .width(parseInt(widthMainContent * 0.1))
                          .height(parseInt(heightMainContent * 0.15))
                      ) &&
                      reversedDecorationImg &&
                      reversedDecorationImg.resize(
                        scale()
                          .width(parseInt(widthMainContent * 0.1))
                          .height(parseInt(heightMainContent * 0.15))
                      ) &&
                      currentQuestion &&
                      (currentQuestion?.content?.backgroundImg
                        ? questionContentImg &&
                          questionContentImg.resize(
                            scale()
                              .width(
                                currentQuestion?.visual?.directionAnswer ==
                                  "row"
                                  ? parseInt(widthMainContent * 0.8)
                                  : parseInt(widthMainContent * 0.4)
                              )
                              .height(
                                parseInt(
                                  currentQuestion?.visual?.directionAnswer ==
                                    "row"
                                    ? heightMainContent * 0.1
                                    : heightMainContent * 0.5
                                )
                              )
                          )
                        : !questionContentImg) ? (
                        <Box
                          height={heightMainContent}
                          width={widthMainContent}
                        >
                          {/* Main content */}
                          <Box
                            height={heightMainContent}
                            width={widthMainContent}
                            display={"flex"}
                            flexDirection={"column"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            sx={{
                              backgroundImage: `url(${questionBackgroundImg.toURL()})`,
                            }}
                          >
                            {" "}
                            <Box
                              height={parseInt(heightMainContent * 0.95)}
                              width={widthMainContent}
                              display={"flex"}
                              flexDirection={
                                currentQuestion?.visual?.directionAnswer ==
                                "column"
                                  ? "row"
                                  : "column"
                              }
                              justifyContent={
                                currentQuestion?.content?.justifyContent
                              }
                              alignItems={"center"}
                            >
                              {/* Question's content  */}
                              <Box
                                width={
                                  currentQuestion?.content?.backgroundImg
                                    ? currentQuestion?.visual
                                        ?.directionAnswer == "row"
                                      ? parseInt(widthMainContent * 0.8)
                                      : parseInt(widthMainContent * 0.4)
                                    : parseInt(widthMainContent * 0.8)
                                }
                                height={
                                  currentQuestion?.content?.backgroundImg
                                    ? currentQuestion?.visual
                                        ?.directionAnswer == "row"
                                      ? parseInt(heightMainContent * 0.1)
                                      : parseInt(heightMainContent * 0.5)
                                    : parseInt(heightMainContent * 0.25)
                                }
                                display={"flex"}
                                justifyContent={"center"}
                                alignItems={"center"}
                                sx={{
                                  marginBottom: 1,
                                  backgroundImage:
                                    currentQuestion?.content?.backgroundImg &&
                                    `url(${questionContentImg.toURL()})`,
                                }}
                              >
                                <DisplayingText
                                  sentence={currentQuestion?.content.text}
                                  level={"h4"}
                                  textColor={currentQuestion?.content.textColor}
                                  padding={1}
                                />
                              </Box>
                              {answerToDisplay()}
                            </Box>
                            {/* Validate button */}
                            <Box
                              width={widthMainContent}
                              sx={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <Button
                                sx={{
                                  width: "15%",
                                  backgroundColor: colors.buttonLight,
                                  "&:hover": {
                                    backgroundColor: colors.buttonLightHover,
                                  },
                                }}
                                size="lg"
                                onClick={() => nextPage()}
                              >
                                Valider
                              </Button>
                            </Box>
                            {openFeedbackModal && modalFeedback()}
                            {openEndModal && endOfAct()}
                            {showSummary && modalSummary()}
                            {openScaleModal && scaleModal()}
                          </Box>

                          {/* Decoration */}
                          <Box position={"absolute"} top={0} left={0}>
                            <AdvancedImage cldImg={reversedDecorationImg} />
                          </Box>

                          <Box position={"absolute"} bottom={-4} right={0}>
                            <AdvancedImage cldImg={decorationImg} />
                          </Box>
                        </Box>
                      ) : (
                        <Box
                          height={"100%"}
                          width={"100%"}
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"center"}
                        >
                          <CircularProgress variant="soft" color="success" />
                        </Box>
                      )
                    ) : (
                      <Box
                        height={"100%"}
                        width={"100%"}
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                      >
                        <CircularProgress variant="soft" color="success" />
                      </Box>
                    )}
                  </Box>
                </>
              ) : (
                <Box
                  height={"100%"}
                  width={"100%"}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <CircularProgress variant="soft" color="success" />
                </Box>
              )}
              {/* Drawer button  */}
            </Stack>
          </Stack>
        </CssVarsProvider>
      )}
    </>
  );
};

export default Game;
