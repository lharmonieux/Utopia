import { useEffect, useState } from "react";
import {
  Stack,
  Box,
  Typography,
  Button,
  Modal,
  ModalDialog,
  ModalClose,
  DialogTitle,
  CircularProgress,
} from "@mui/joy";
import Propositions from "../../components/Propositions.jsx";
import Characters from "../../components/Characters.jsx";
import TextArea from "../../components/TextArea.jsx";
import { Link, useNavigate } from "react-router-dom";
import { AlertNoAnswer } from "../../components/Alert.jsx";
import DisplayingText from "../../components/DisplayingText.jsx";
import ActPresentation from "../../components/ActPresentation.jsx";
import "animate.css";
import ScaleProposition from "../../components/ScaleProposition.jsx";
import { animateOut } from "../../middlewares/Animation.js";
import { colors } from "../../utils/colors.js";
import Towns from "../../components/Towns.jsx";
import { useDispatch, useSelector } from "react-redux";
import { PICTURES_DIR } from "../../utils/constants.js";
import {
  setQuestion,
  setQuestionOrder,
  updateQuestion,
} from "../../utils/redux/actSlice.js";
import { backgroundSize } from "../../utils/backgroundSizeProvider.js";
import {
  setMotto,
  setThematicScore,
  setTown,
  setUserCharacter,
  setUserSecondCharacter,
  storeTownName,
} from "../../utils/redux/userSlice.js";
import apiRequest from "../../api/requestAPI.js";

const Game = () => {
  // variables
  // const { currentAct, characters, acts, towns } = useContext(AppContext);
  const stateActs = useSelector((state) => state.act);
  const domConfig = useSelector((state) => state.dom);
  const stateUser = useSelector((state) => state.user);
  const authState = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State
  // const [currentQuestion, setCurrentQuestion] = useState();
  const [objectCharacterSelected, setObjectCharacterSelected] = useState("");
  const [containsFeedback, setContainsFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  // const [orderQuestion, setOrderQuestion] = useState(1);
  const [storeAnswer, setStoreAnswer] = useState([]);
  const [openEndModal, setOpenEndModal] = useState(false);
  const [scoresThematic, setScoresThematic] = useState(new Map());
  const [showAlertNoAnswer, setShowAlertNoAnswer] = useState(false);
  const [townName, setTownName] = useState("");
  // const [showDrawer, setShowDrawer] = useState(false);
  // const [showSummary, setShowSummary] = useState(false);
  const [showActPresentation, setShowActPresentation] = useState(true);
  const [showMainContent, setShowMainContent] = useState(false);
  const [scaleAnswers, setScaleAnswers] = useState(new Map());
  const [openScaleModal, setOpenScaleModal] = useState(false);
  const [fullContentBox, setFullContentBox] = useState();

  //Images's state
  const [actPresentationImg, setActPresentationImg] = useState();
  const [decorationImg, setDecorationImg] = useState();
  const [titleActImg, setTitleActImg] = useState();
  const [logoAppImg, setLogoAppImg] = useState();
  const [questionBackgroundImg, setQuestionBackgroundImg] = useState();
  const [feedbackImg, setFeedbackImg] = useState();
  const [titleEndActImg, setTitleEndActImg] = useState();
  const [rankEndActImg, setRankEndActImg] = useState();
  const [bgEndActImg, setBgEndActImg] = useState();
  // Getting total number of questions for current act
  let actQuestionsLength = stateActs.currentAct?.questions?.length;

  //Var for modal entrance animation
  let animationModalIn = "animate__animated animate__zoomIn animate__fast";

  useEffect(() => {
    if (showActPresentation) {
      //Loading images
      setActPresentationImg(
        PICTURES_DIR + "/presentation_acte/planet-with-city-it-with-water.jpg"
      );
      setDecorationImg(PICTURES_DIR + "/Déco - Charte triangle.svg");
      setTitleActImg(PICTURES_DIR + "/presentation_acte/1.svg");
      setLogoAppImg(PICTURES_DIR + "/Logo - couleurs + blanc.svg");
    } else {
      //Get the element with animation and detect the end of animation for doing anything else
      setFullContentBox(document.querySelector("#game-full-content"));
      if (fullContentBox && !showMainContent) {
        if (stateActs.questionOrder > 0)
          //Activate the end box animation of the main screen
          fullContentBox.addEventListener("animationend", () => {
            dispatch(
              setQuestion(
                stateActs.currentAct?.questions[stateActs.questionOrder]
              )
            );
            // Map save for user's datas
            const logScores = Object.entries(stateUser.save.logScores);
            let newScoresThematic = new Map();
            for (let [key, value] of logScores) {
              newScoresThematic.set(key, value);
            }
            setScoresThematic(newScoresThematic);
            setShowMainContent(true);
          });
        else {
          dispatch(
            setQuestion(
              stateActs.currentAct?.questions[stateActs.questionOrder]
            )
          );
          // Map save for user's datas
          const logScores = Object.entries(stateUser.save.logScores);
          let newScoresThematic = new Map();
          for (let [key, value] of logScores) {
            newScoresThematic.set(key, value);
          }
          setScoresThematic(newScoresThematic);
          setShowMainContent(true);
        }
      }

      if (fullContentBox) {
        //Loading of question's datas
        if (stateActs.currentQuestion) {
          setQuestionBackgroundImg(
            `${PICTURES_DIR}/${stateActs.currentQuestion?.visual?.bgImgMainContent}`
          );

          // If question contains feedbacks for some answers
          if (openFeedbackModal || openScaleModal)
            setFeedbackImg(
              `${PICTURES_DIR}/${stateActs.currentQuestion?.visual?.feedbackImg}`
            );
          else setFeedbackImg(undefined);

          // If we are at the end of act, load the end act's image
          if (stateActs.questionOrder == actQuestionsLength - 1) {
            setTitleEndActImg(
              `${PICTURES_DIR}/${stateActs.currentAct?.resolution?.titleImg}`
            );

            setRankEndActImg(
              `${PICTURES_DIR}/${stateActs.currentAct?.resolution?.rankImg}`
            );

            setBgEndActImg(
              `${PICTURES_DIR}/${stateActs.currentAct?.resolution?.backgroundImg}`
            );
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    showActPresentation,
    fullContentBox,
    showMainContent,
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

    // Adapt state of the question
    // For unique answer
    if (answerType == "proposition") {
      // log choice's score
      updateStoreAnswer(selectedAnswer, answerType);
      storeScore(selectedAnswer);
      dispatch(
        updateQuestion({
          currentQuestion: stateActs.currentQuestion,
          selectedAnswer,
          typeAnswer: "single",
        })
      );
    }
    //For select town
    else if (answerType == "town") {
      updateStoreAnswer(selectedAnswer, answerType);
      dispatch(
        setTown({
          region: selectedAnswer?.name,
          description: selectedAnswer?.description,
        })
      );
    }

    //For scale
    else if (answerType == "notation") {
      updateStoreAnswer(selectedAnswer, answerType);
      storeScore(selectedAnswer);
    }

    // For multiples answers
    else {
      // 3 answers max for update question State
      if (storeAnswer.length < 3 || selectedAnswer.selected) {
        updateStoreAnswer(selectedAnswer, answerType);
        storeScore(selectedAnswer);
        dispatch(
          updateQuestion({
            currentQuestion: stateActs.currentQuestion,
            selectedAnswer,
            typeAnswer: "multiple",
          })
        );
      }
    }
  };

  const answerToDisplay = () => {
    switch (stateActs?.currentQuestion?.answerType) {
      //Affichage du choix des persos
      case "personnage":
        return (
          <Characters
            setIdCharacterSelected={setObjectCharacterSelected}
            idCharacterSelected={objectCharacterSelected}
          />
        );

      // Affichage des propositions de reponse
      case "proposition":
      case "proposition_multiple":
        return (
          <Propositions handleSelectedProposition={handleSelectedProposition} />
        );

      // Affichage d'une zone de texte
      case "texte":
        return <TextArea town={townName} setTownName={setTownName} />;

      case "notation":
        return <ScaleProposition setScaleAnswers={setScaleAnswers} />;

      case "town":
        return <Towns handleSelectedProposition={handleSelectedProposition} />;

      default:
        break;
    }
  };

  const modalFeedback = () => {
    const secondCharacterName = stateUser.secondCharacter.name;
    let feedbackText = feedback.content;
    feedbackText = feedbackText.replace("secondCharacterName", secondCharacterName);
    // Modal for feedbacks
    return (
      feedbackImg && (
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
              width: parseInt(domConfig.width * 0.5),
              height: parseInt(domConfig.height * 0.85),
              backgroundImage: `url(${feedbackImg})`,
              backgroundSize: backgroundSize(
                domConfig.width * 0.5,
                domConfig.height * 0.85
              ),
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
                  sentence={feedbackText}
                  level="title-md"
                  textColor={"black"}
                />
              </Typography>

              <Button
                onClick={() =>
                  animateOut(
                    openFeedbackModal,
                    "#modal-feedback-content",
                    () => {
                      setOpenFeedbackModal(false);
                      initializingState();
                    }
                  )
                }
              >
                Continuer
              </Button>
            </Box>
          </ModalDialog>
        </Modal>
      )
    );
  };

  // Modal for end of act / Summary
  const endOfAct = () => {
    const totalResidents = stateUser.save.totalResidents;
    const townStatus = stateUser.townStatus;
    let resolutionText = stateActs.currentAct.resolution.text;
    resolutionText = resolutionText
      .replace("totalResidents", totalResidents)
      .replace("townStatus", townStatus);

    let saves = [...stateUser.saves];
    saves.push(stateUser.save);

    const userToSave = {
      firstname: stateUser.firstname,
      lastname: stateUser.lastname,
      role: "JOUEUR",
      character: stateUser.character,
      secondCharacter: stateUser.secondCharacter,
      motto: stateUser.motto,
      town: stateUser.town,
      townName: stateUser.townName,
      townStatus: stateUser.townStatus,
      saves,
    };

    // Save games's datas
    apiRequest("users/update", "put", authState.token, {
      data: { ...userToSave, idUser: stateUser.idUser },
    });
    // .then((response) => {
    //   // dispatch(setToken({ token: response.accessToken, error: null }));
    // })
    // .catch((error) => {
    //   console.log(error);
    // });

    return titleEndActImg && rankEndActImg && bgEndActImg ? (
      <Modal
        open={openEndModal}
        onClose={() => {
          animateOut(openEndModal, "#modal-end", () => {
            setOpenEndModal(false);
            navigate("/user/home");
            initializingState();
          });
        }}
        className={animationModalIn}
        id={"modal-end"}
      >
        <ModalDialog
          sx={{
            height: parseInt(domConfig.height * 0.8),
            width: parseInt(domConfig.width * 0.7),
            backgroundImage: `url(${bgEndActImg})`,
            backgroundSize: backgroundSize(
              domConfig.width * 0.7,
              domConfig.height * 0.8
            ),
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
                  backgroundImage: `url(${titleEndActImg})`,
                  backgroundSize: backgroundSize(
                    domConfig.width * 0.7 * 0.5,
                    domConfig.height * 0.8 * 0.9
                  ),
                  borderTopLeftRadius: 5,
                }}
              >
                <Typography
                  padding={5}
                  level="h3"
                  textColor={"white"}
                  fontWeight={400}
                >{`Résolution de l'ACTE ${stateActs.currentAct?.chapter}`}</Typography>
              </Box>

              {/* Right side  */}
              <Box
                width={"50%"}
                height={"90%"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Typography
                  level="title-lg"
                  textColor={"white"}
                  fontWeight={400}
                >
                  <DisplayingText sentence={resolutionText} />
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

            <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <Link to="/user/home">
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
    );
  };

  const storeScore = (selectedAnswer) => {
    // update store if answer is selected again
    if (selectedAnswer.selected) {
      let newScoresThematic = new Map(scoresThematic);
      const oldScore = newScoresThematic.get(selectedAnswer.thematic);
      const oldGivenResidents = newScoresThematic.get("residents");

      if (oldScore)
        newScoresThematic.set(
          selectedAnswer.thematic,
          oldScore - selectedAnswer.score
        );
      if (oldGivenResidents) {
        newScoresThematic.set(
          "residents",
          oldGivenResidents - selectedAnswer.givenResidents
        );
      }
      setScoresThematic(newScoresThematic);
    } else {
      //update score for thematic
      const oldScore = scoresThematic.get(selectedAnswer.thematic);
      const oldGivenResidents = scoresThematic.get("residents");
      let newScoresThematic = new Map(scoresThematic);
      newScoresThematic.set(
        "residents",
        oldGivenResidents
          ? oldGivenResidents + selectedAnswer.givenResidents
          : selectedAnswer.givenResidents
      );

      if (oldScore) {
        newScoresThematic.set(
          selectedAnswer.thematic,
          oldScore + selectedAnswer.score
        );
      } else
        newScoresThematic.set(selectedAnswer.thematic, selectedAnswer.score);
      setScoresThematic(newScoresThematic);
    }
  };

  const initializingState = () => {
    setShowMainContent(false);
    setContainsFeedback(false);
    setFeedback("");
    dispatch(setQuestionOrder(stateActs.questionOrder + 1));
    setStoreAnswer([]);
    setTownName("");
    setObjectCharacterSelected(null);
    setShowAlertNoAnswer(false);
    scaleAnswers.clear();
    setScaleAnswers(new Map(scaleAnswers));
  };

  // Manage for the next element to display
  const nextPage = () => {
    //Control of if there are an given answer
    if (
      storeAnswer.length > 0 ||
      townName ||
      scaleAnswers.size > 0 ||
      objectCharacterSelected
    ) {
      //Store score
      const givenResidents = scoresThematic.get("residents");
      if (givenResidents >= 0) {
        let newScoresThematic = new Map(scoresThematic);
        newScoresThematic.delete("residents");
        dispatch(
          setThematicScore({
            scoresThematic: Object.fromEntries(newScoresThematic),
            givenResidents,
          })
        );
      }

      //Store character
      if (objectCharacterSelected) {
        stateUser.character
          ? dispatch(setUserSecondCharacter(objectCharacterSelected))
          : dispatch(setUserCharacter(objectCharacterSelected));
      }

      // Store town name
      if (townName) dispatch(storeTownName(townName));

      //Scale answer control
      if (scaleAnswers.size > 0) setOpenScaleModal(true);
      else {
        // If answer has a feedback
        if (containsFeedback) setOpenFeedbackModal(true);
        else {
          //Display end modal to summarize act
          if (stateActs.questionOrder == actQuestionsLength - 1)
            setOpenEndModal(true);
          //Display next page of act
          else initializingState();
        }
      }
    } else setShowAlertNoAnswer(true);
  };

  const scaleModal = () => {
    let choosenMotto;
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
      choosenMotto = stateActs.currentQuestion?.answers.filter(
        (answer) => answer._id == idMaxScale
      );
      choosenMotto = {
        ...choosenMotto[0],
        selected: true,
      };
    }

    const storeScaleAnswer = (choosenMotto) => {
      let newScoresThematic = new Map(scoresThematic);
      const oldScore = newScoresThematic.get(choosenMotto.thematic);
      if (oldScore)
        newScoresThematic.set(
          choosenMotto.thematic,
          oldScore + choosenMotto.score
        );
      else newScoresThematic.set(choosenMotto.thematic, choosenMotto.score);
      dispatch(
        setThematicScore({
          scoresThematic: Object.fromEntries(newScoresThematic),
          givenResidents: choosenMotto.givenResidents,
        })
      );
    };

    return domConfig.height && domConfig.width ? (
      feedbackImg ? (
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
              width: parseInt(domConfig.width * 0.7),
              height: parseInt(domConfig.height * 0.6),
              position: "relative",
              backgroundImage: `url(${feedbackImg})`,
              backgroundSize: backgroundSize(
                domConfig.width * 0.7,
                domConfig.height * 0.6
              ),
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
                {choosenMotto && choosenMotto?.content?.text?.text}
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
                  dispatch(setMotto(choosenMotto.content.text.text));
                  storeScaleAnswer(choosenMotto);
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
      stateActs.currentAct ? (
        <ActPresentation
          setShowActPresentation={setShowActPresentation}
          setShowMainContent={setShowMainContent}
          actPresentationImg={actPresentationImg}
          decorationImg={decorationImg}
          titleActImg={titleActImg}
          logoAppImg={logoAppImg}
        />
      ) : (
        <Box
          display={"flex"}
          flexDirection={"column"}
          height={"100%"}
          width={"100%"}
        >
          {/* Alert zone */}
          <Box
            sx={{
              width: "50vw",
              marginLeft: "10px",
              marginBottom: "0.5%",
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
                {/* Container for act */}
                <Box
                  height={"100%"}
                  width={"100%"}
                  id={"game-main-content"}
                  position={"relative"}
                >
                  {domConfig.width && domConfig.height ? (
                    questionBackgroundImg &&
                    decorationImg &&
                    stateActs.currentQuestion ? (
                      <Box height={domConfig.height} width={domConfig.width}>
                        {/* Main content */}
                        <Box
                          height={domConfig.height}
                          width={domConfig.width}
                          display={"flex"}
                          flexDirection={"column"}
                          justifyContent={"center"}
                          alignItems={"center"}
                          sx={{
                            backgroundImage: `url(${questionBackgroundImg})`,
                            backgroundSize: backgroundSize(
                              domConfig.width,
                              domConfig.height
                            ),
                          }}
                        >
                          {/* Question's content  */}
                          {stateActs.currentQuestion?.content?.map(
                            (questionContent, index) => (
                              <Box
                                key={index}
                                height={parseInt(domConfig.height * 0.95)}
                                width={
                                  !stateActs.currentQuestion.visual
                                    .boxAnswersImg
                                    ? domConfig.width
                                    : parseInt(
                                        (domConfig.width *
                                          parseInt(
                                            stateActs.currentQuestion.visual
                                              .boxAnswersImg.width
                                          )) /
                                          100
                                      )
                                }
                                display={
                                  !stateActs.currentQuestion.visual
                                    .boxAnswersImg && "flex"
                                }
                                flexDirection={
                                  stateActs.currentQuestion?.visual
                                    ?.directionAnswer == "column"
                                    ? "row"
                                    : "column"
                                }
                                justifyContent={questionContent?.justifyContent}
                                alignItems={"center"}
                              >
                                <Box
                                  width={
                                    questionContent?.backgroundImg
                                      ? stateActs.currentQuestion?.visual
                                          ?.directionAnswer == "row"
                                        ? parseInt(domConfig.width)
                                        : parseInt(domConfig.width * 0.4)
                                      : parseInt(domConfig.width * 0.8)
                                  }
                                  height={
                                    questionContent?.backgroundImg
                                      ? stateActs.currentQuestion?.visual
                                          ?.directionAnswer == "row"
                                        ? parseInt(domConfig.height * 0.15)
                                        : parseInt(domConfig.height * 0.5)
                                      : parseInt(domConfig.height * 0.25)
                                  }
                                  display={"flex"}
                                  justifyContent={"center"}
                                  alignItems={
                                    !stateActs.currentQuestion.visual
                                      .boxAnswersImg
                                      ? "center"
                                      : "flex-start"
                                  }
                                  sx={{
                                    marginBottom: 1,
                                    backgroundImage: `url(${PICTURES_DIR}/${questionContent.backgroundImg})`,
                                    backgroundSize:
                                      stateActs.currentQuestion?.visual
                                        ?.directionAnswer == "row"
                                        ? backgroundSize(
                                            domConfig.width,
                                            domConfig.height * 0.15
                                          )
                                        : backgroundSize(
                                            domConfig.width * 0.4,
                                            domConfig.height * 0.5
                                          ),
                                  }}
                                >
                                  <DisplayingText
                                    sentence={questionContent.text}
                                    level={"title-lg"}
                                    textColor={questionContent.textColor}
                                    padding={1}
                                    textAlign={"center"}
                                    marginLeft={
                                      questionContent.backgroundImg &&
                                      stateActs.currentQuestion?.visual
                                        ?.directionAnswer == "row"
                                        ? "20%"
                                        : 0
                                    }
                                  />
                                </Box>
                                {answerToDisplay()}
                              </Box>
                            )
                          )}

                          {/* Validate button */}
                          <Box
                            width={domConfig.width}
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
                          {openScaleModal && scaleModal()}
                        </Box>

                        {/* Decoration */}
                        {/* <Box position={"absolute"} top={0} left={0}>
                            <img
                              src={decorationImg}
                              height={domConfig.height * 0.15}
                              width={domConfig.width * 0.1}
                              style={{ transform: "rotate(180)" }}
                            />
                          </Box> */}

                        <Box position={"absolute"} bottom={-4} right={0}>
                          <img
                            src={decorationImg}
                            height={domConfig.height * 0.15}
                            width={domConfig.width * 0.1}
                          />
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
        </Box>
      )}
    </>
  );
};

export default Game;
