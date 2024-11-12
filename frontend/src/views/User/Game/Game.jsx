import { useEffect, useState } from "react";
import {
  Stack,
  Box,
  Typography,
  Modal,
  ModalDialog,
  ModalClose,
  CircularProgress,
  Alert,
} from "@mui/joy";
import Propositions from "../../../components/Propositions.jsx";
import Characters from "../../../components/Characters.jsx";
import TextArea from "../../../components/TextArea.jsx";
import {
  AlertBAdAnswerNumber,
  AlertNoAnswer,
} from "../../../components/Alert.jsx";
import DisplayingText from "../../../components/DisplayingText.jsx";
import ActPresentation from "../../../components/ActPresentation.jsx";
import "animate.css";
import ScaleProposition from "../../../components/ScaleProposition.jsx";
import { animateOut } from "../../../middlewares/Animation.js";
import { colors } from "../../../utils/colors.js";
import Towns from "../../../components/Towns.jsx";
import { useDispatch, useSelector } from "react-redux";
import { PICTURES_DIR } from "../../../utils/constants.js";
import {
  storeQuestion,
  storeQuestionOrder,
} from "../../../utils/redux/actSlice.js";
import apiRequest from "../../../api/requestAPI.js";
import CustomButton from "../../../components/CustomButton.jsx";
import RankView from "../../../components/RankView.jsx";
import ButtonNavScroll from "../../../components/ButtonNavScroll.jsx";
import { TbArrowBigDownFilled, TbArrowBigUpFilled } from "react-icons/tb";
import nextPage from "./functions/nextPage.js";
import { ModalFeedback } from "./components/ModalFeedback.jsx";
import ModalScaleFeedback from "./components/ModalScaleFeedback.jsx";
import logScoreAndAnswer from "./functions/logScoreAndAnswer.js";
import { storeScoreAndAnswer } from "../../../utils/redux/userSlice.js";
import { jwtDecode } from "jwt-decode";
import Loading from "../../Loading.jsx";

const Game = () => {
  // variables
  // const { currentAct, characters, acts, towns } = useContext(AppContext);
  const stateActs = useSelector((state) => state.act);
  const stateUser = useSelector((state) => state.user);
  const stateCharacters = useSelector((state) => state.character);
  const stateTowns = useSelector((state) => state.town);
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // State

  //Characters
  const [objectCharacterSelected, setObjectCharacterSelected] = useState(null);

  // Towns
  const [objectTownSelected, setObjectTownSelected] = useState(null);

  // Mottos
  const [objectMottoSelected, setObjectMottoSelected] = useState(null);

  //Propositions
  const [objectPropositionSelected, setObjectPropositionSelected] =
    useState(null);

  //Boolean answer
  const [booleanAnswerSelected, setBooleanAnswerSelected] = useState(new Map());

  const [containsFeedback, setContainsFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isModalFeedbackPassed, setIsModalFeedbackPassed] = useState(false);
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const [storeAnswer, setStoreAnswer] = useState([]);
  const [openEndModal, setOpenEndModal] = useState(false);
  const [showAlertNoAnswer, setShowAlertNoAnswer] = useState(false);
  const [showAlertBadAnswerNumber, setShowAlertBadAnswerNumber] =
    useState(false);
  const [textareaValue, setTextareaValue] = useState(new Map());
  const [rankUserText, setRankUserText] = useState("");
  const [showActPresentation, setShowActPresentation] = useState(true);
  const [showMainContent, setShowMainContent] = useState(false);
  const [scaleAnswers, setScaleAnswers] = useState(new Map());
  const [openScaleModal, setOpenScaleModal] = useState(false);
  const [fullContentBox, setFullContentBox] = useState();
  const [orderedAnswers, setOrderedAnswers] = useState([]);
  const [percentAnswers, setPercentAnswers] = useState(new Map());
  const [logAnswerModal, setLogAnswerModal] = useState({
    text: { content: "" },
  });
  const [displayRankView, setDisplayRankView] = useState(false);
  const [timer, setTimer] = useState(null);
  const [displayVerticalNav, setDisplayVerticalNav] = useState(true);
  const [isAnswerDisplayed, setIsAnswerDisplayed] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [currentQuestionOK, setCurrentQuestionOK] = useState(false);

  //Images's state
  const [actPresentationImg, setActPresentationImg] = useState();
  const [decorationImg, setDecorationImg] = useState();
  const [titleActImg, setTitleActImg] = useState();
  const [logoAppImg, setLogoAppImg] = useState();
  const [titleEndActImg, setTitleEndActImg] = useState();
  const [rankEndActImg, setRankEndActImg] = useState();
  const [bgEndActImg, setBgEndActImg] = useState();

  // Getting total number of questions for current act
  let actQuestionsLength = stateActs.currentAct?.questions?.length;
  //Var for modal entrance animation
  let animationModalIn = "animate__animated animate__zoomIn animate__fast";

  // Control of page reload
  // function confirmationRechargement(e) {
  //   const confirmationMessage =
  //     "Veuillez accepter de quitter la page si vous passez à l'acte suivant. Mais si vous essayez d'actualiser, votre progression en cours sera perdue. Continuer ?";
  //   e.returnValue = confirmationMessage;
  //   return confirmationMessage;
  // }

  // useEffect(() => {
  //   window.addEventListener("beforeunload", confirmationRechargement);
  // }, []);

  // Right control
  useEffect(() => {
    if (authState.token) {
      const decoded_token = jwtDecode(authState.token);
      if (
        decoded_token?.UserInfo?.role?.name === "ADMIN" ||
        decoded_token?.UserInfo?.role?.name === "SUPERADMIN"
      ) {
        window.location.href = "/admin/home";
      }
    }
  });

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
        if (stateActs.questionOrder > 0) {
          //Activate the end box animation of the main screen
          fullContentBox.addEventListener("animationend", () => {
            dispatch(
              storeQuestion(
                stateActs.currentAct?.questions[stateActs.questionOrder]
              )
            );
            setShowMainContent(true);
          });
        } else {
          dispatch(
            storeQuestion(
              stateActs.currentAct?.questions[stateActs.questionOrder]
            )
          );
          // Map last saves for user
          dispatch(
            storeScoreAndAnswer({
              act: null,
              totalResidentsGot: stateUser.save.totalResidentsGot || 0,
              totalResidentsPossible:
                stateUser.save.totalResidentsPossible || 0,
              logAnswers: [],
              logScores: stateUser.save.logScores || [],
            })
          );

          setShowMainContent(true);
        }
        setCurrentQuestionOK(true);
      }

      if (fullContentBox) {
        if (stateActs.currentQuestion) {
          // For manage multi-form and if we must to display vertical nav buttons for personnage page
          let isPersonnagePage = false;
          if (stateActs.currentQuestion?.questionType?.name == "personnage")
            isPersonnagePage = true;

          setDisplayVerticalNav(!isPersonnagePage);

          //Loading of question's datas
          // If we are at the end of act, load the end act's image
          if (stateActs.questionOrder == actQuestionsLength - 1) {
            setTitleEndActImg(
              `${PICTURES_DIR}/${stateActs.currentAct?.ending?.titleImg}`
            );

            setRankEndActImg(
              `${PICTURES_DIR}/${stateActs.currentAct?.ending?.rankImg}`
            );

            setBgEndActImg(
              `${PICTURES_DIR}/${stateActs.currentAct?.ending?.backgroundImg}`
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

  // Animations
  useEffect(() => {
    if (
      currentQuestionOK &&
      !animationStarted &&
      stateActs.currentQuestion?.questionType.name != "texte_fete" &&
      stateActs.currentQuestion?.questionType.name != "texte" &&
      stateActs.currentQuestion?.questionType.name != "text_ville"
    ) {
      setAnimationStarted(true);
    }
    // } else if (stateActs.currentQuestion?.questionType.name == "texte_fete")
    //   setAnimationStarted(false);

    if (animationStarted) {
      // Display question Box
      const questionBox = document.getElementById("question-box");

      if (questionBox) {
        // eslint-disable-next-line no-unused-vars
        const isQuestionfinishedAnim = new Promise((resolve, reject) => {
          const timerQuestion = setTimeout(() => {
            questionBox.style.display = "flex";
            resolve("question displaying");
          }, 1000);

          return () => clearTimeout(timerQuestion);
        });

        isQuestionfinishedAnim.then(() => {
          // eslint-disable-next-line no-unused-vars
          const isAnswerFinishedAnim = new Promise((resolve, reject) => {
            const timerAnswer = setTimeout(() => {
              const answerBox = document.getElementById("answer-box");
              if (answerBox) {
                answerBox.style.display = "block";
                resolve(true);
              }
            }, 2500);
            return () => clearTimeout(timerAnswer);
          });

          isAnswerFinishedAnim.then(() => {
            setIsAnswerDisplayed(true);
          });
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionOK, animationStarted, showMainContent]);

  // Next page actions after modalFeedback
  useEffect(() => {
    if (isModalFeedbackPassed) initializingState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalFeedbackPassed]);

  const updateStoreAnswer = (selectedAnswer, questionType) => {
    // Remove answer if selected again
    if (storeAnswer.find((e) => e._id == selectedAnswer._id)) {
      setStoreAnswer(() =>
        storeAnswer.filter((e) => e._id != selectedAnswer._id)
      );
      return;
    }

    let answerToPreStore = null;
    // Display alternative text if exist
    if (selectedAnswer?.alternatifText?.content)
      answerToPreStore = {
        ...selectedAnswer,
        alternatifText: {
          content: selectedAnswer.alternatifText.content,
          textColor: selectedAnswer.alternatifText.textColor,
          hidden: false,
          img: selectedAnswer.alternatifText?.img,
        },
      };
    else answerToPreStore = { ...selectedAnswer };

    // Add Answer selected
    if (
      questionType == "proposition_multiple" &&
      storeAnswer.length < stateActs?.currentQuestion?.nbOfAnswersRequired
    ) {
      setStoreAnswer([...storeAnswer, answerToPreStore]);
    }
  };

  const handleSelectedProposition = (selectedAnswer, questionType) => {
    // Adapt state of the question

    // For multiples answers
    if (questionType == "proposition_multiple") {
      updateStoreAnswer(selectedAnswer, questionType);
    }
  };

  const answerToDisplay = (question) => {
    switch (question.questionType?.name) {
      //Affichage du choix des persos
      case "personnage":
        return (
          <Characters
            setObjectCharacterSelected={setObjectCharacterSelected}
            objectSelectedCharacter={objectCharacterSelected}
          />
        );

      // Affichage des propositions de reponse
      case "proposition":
      case "proposition_multiple":
      case "classement":
      case "classement_symbol":
      case "pourcentage":
      case "reponse_double":
        return (
          <Propositions
            handleSelectedProposition={handleSelectedProposition}
            orderedAnswers={orderedAnswers}
            setOrderedAnswers={setOrderedAnswers}
            percentAnswers={percentAnswers}
            setPercentAnswers={setPercentAnswers}
            question={question}
            storeAnswer={storeAnswer}
            objectPropositionSelected={objectPropositionSelected}
            setObjectPropositionSelected={setObjectPropositionSelected}
            feedback={feedback}
            setFeedback={setFeedback}
            setContainsFeedback={setContainsFeedback}
            booleanAnswerSelected={booleanAnswerSelected}
            setBooleanAnswerSelected={setBooleanAnswerSelected}
          />
        );

      // Affichage d'une zone de texte
      case "texte":
      case "texte_ville":
      case "texte_fete":
        return (
          <TextArea
            textareaValue={textareaValue}
            setTextareaValue={setTextareaValue}
            question={question}
          />
        );

      case "notation":
        return (
          <ScaleProposition
            setScaleAnswers={setScaleAnswers}
            scaleAnswers={scaleAnswers}
            question={question}
          />
        );

      case "town":
        return (
          <Towns
            objectTownSelected={objectTownSelected}
            setObjectTownSelected={setObjectTownSelected}
            setContainsFeedback={setContainsFeedback}
            setFeedback={setFeedback}
          />
        );

      default:
        break;
    }
  };

  // Modal for end of act / Summary
  const endOfAct = () => {
    // window.removeEventListener("beforeunload", confirmationRechargement);
    let resolutionText = stateActs.currentAct.ending.text;

    resolutionText = resolutionText.replace(
      "totalResidents",
      stateUser.save.totalResidentsGot
    );

    let saves = [...stateUser.saves];
    saves.push({
      ...stateUser.save,
      act: stateActs.currentAct._id,
    });

    const userToSave = {
      firstname: stateUser.firstname,
      lastname: stateUser.lastname,
      character: stateUser.character,
      secondCharacter: stateUser.secondCharacter,
      motto: stateUser.motto,
      town: stateUser.town,
      townName: stateUser.townName,
      townStatus: stateUser.townStatus,
      partyName: stateUser.partyName,
      symbol: stateUser.symbol,
      saves,
    };

    // Save games's datas and display ending modal
    apiRequest("users/update", "patch", authState.token, {
      data: { userToSave, idUser: stateUser.idUser },
    })
      .then((resultSave) => {
        if (
          resultSave.response.status >= 200 &&
          resultSave.response.status < 300
        ) {
          //Calcul of percentage ranking of user
          const percentRank =
            100 -
            (stateUser.save.totalResidentsGot /
              stateUser.save.totalResidentsPossible) *
              100;
          // If we finished the game
          if (stateActs.currentAct.chapterNumber == 5) {
            if (percentRank <= 100 && percentRank >= 80)
              setRankUserText(
                `\n\nVous faites partie des 80% les meilleurs. Bien joué ! Même si la vie sur Terre semble davantage faite pour vous.`
              );
            else if (percentRank < 80 && percentRank >= 30)
              setRankUserText(
                `\n\nVous faites partie des 50% les meilleurs. Excellent résultat ! Vous êtes prêt à changer de planête !`
              );
            else if (percentRank < 30 && percentRank >= 0)
              setRankUserText(
                `\n\nVous faites partie des 30% les meilleurs ! Bravo, quel exploit ! C'était une aventure faite pour vous.`
              );
            else
              setRankUserText(
                `\n\nVous faites partie des 30% les meilleurs ! Bravo, quel exploit ! C'était une aventure faite pour vous.`
              );
          } else {
            if (percentRank <= 100 && percentRank >= 80)
              setRankUserText(
                `\n\nVous faites partie des 80% les meilleurs. Il va falloir accélérer, tout reste à conquérir !`
              );
            else if (percentRank < 80 && percentRank >= 30)
              setRankUserText(
                `\n\nVous faites partie des 50% les meilleurs. Encore un effort, vous êtes sur la bonne voie !`
              );
            else if (percentRank < 30 && percentRank >= 0)
              setRankUserText(
                `\n\nVous faites partie des 30% les meilleurs ! Quelle performance, continuez comme ça !`
              );
            else
              setRankUserText(
                `\n\nVous faites partie des 30% les meilleurs ! Quelle performance, continuez comme ça !`
              );
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return titleEndActImg && rankEndActImg && bgEndActImg && rankUserText ? (
      <Modal
        open={openEndModal}
        onClose={() => {
          animateOut(openEndModal, "#modal-end", () => {
            setOpenEndModal(false);
            window.location = "/summary";
          });
        }}
        className={animationModalIn}
        id={"modal-end"}
      >
        <ModalDialog
          sx={{
            height: "90%",
            width: "75%",
            backgroundImage: `url(${bgEndActImg})`,
            backgroundSize: "100% 100%",
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
                width={"40%"}
                height={"100%"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                sx={{
                  backgroundImage: `url(${titleEndActImg})`,
                  backgroundSize: "100% 100%",
                  borderTopLeftRadius: 5,
                }}
              >
                <Typography
                  padding={5}
                  level="h3"
                  textColor={"white"}
                  fontWeight={400}
                  id={"end-modal-title"}
                >{`Résolution de l'ACTE ${stateActs.currentAct?.chapterNumber}`}</Typography>
              </Box>

              {/* Right side  */}
              <Box
                width={"58%"}
                height={"90%"}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <DisplayingText
                  level={stateActs.currentAct?.ending?.textStyle?.size}
                  textColor={"white"}
                  fontWeight={stateActs.currentAct?.ending?.textStyle?.weight}
                  sentence={resolutionText}
                  animated={true}
                  backgroundText={"rgba(70, 8, 134, 0.7)"}
                  padding={"5%"}
                  onComplete={() => setDisplayRankView(true)}
                  id={"end-modal-res-text"}
                />

                {displayRankView && <RankView text={rankUserText} />}
              </Box>
            </Stack>

            <Box height={"8%"} display="flex" justifyContent="center">
              <CustomButton
                backgroundColor={colors.buttonDark}
                hoverColor={colors.buttonDarkHover}
                textColor={colors.titleBackDark}
                clickMethod={() => {
                  animateOut(openEndModal, "#modal-end", () => {
                    setOpenEndModal(false);
                    window.location.href = "/summary";
                  });
                }}
              >
                Passer à la suite
              </CustomButton>
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

  const initializingState = () => {
    //Defining variables for log scores and answers
    let objectSelected;
    let stateEntity;
    if (stateActs.currentQuestion.questionType.name === "personnage") {
      objectSelected = objectCharacterSelected;
      stateEntity = stateCharacters.characters;
    } else if (stateActs.currentQuestion.questionType.name === "town") {
      objectSelected = objectTownSelected;
      stateEntity = stateTowns.towns;
    } else if (stateActs.currentQuestion.questionType.name === "notation") {
      objectSelected = objectMottoSelected;
      stateEntity = stateActs.currentQuestion.answers;
    } else if (
      stateActs.currentQuestion.questionType.name === "proposition_multiple"
    ) {
      objectSelected = storeAnswer;
      stateEntity = stateActs.currentQuestion.answers;
    } else if (stateActs.currentQuestion.questionType.name === "proposition") {
      if (logAnswerModal.text.content) {
        objectSelected = {
          ...objectPropositionSelected,
          modalAnswer: { text: logAnswerModal.text.content },
        };
        stateEntity = stateActs.currentQuestion.answers;
      } else {
        objectSelected = objectPropositionSelected;
        stateEntity = stateActs.currentQuestion.answers;
      }
    } else if (
      stateActs.currentQuestion.questionType.name === "classement" ||
      stateActs.currentQuestion.questionType.name === "classement_symbol"
    ) {
      objectSelected = orderedAnswers[0];
      stateEntity = stateActs.currentQuestion.answers;
    } else if (stateActs.currentQuestion.questionType.name === "pourcentage") {
      // Getting max percent for store score
      let maxPercentValue = 0;
      let objectPercent = null;
      percentAnswers.forEach((value, key) => {
        if (value > maxPercentValue) {
          maxPercentValue = value;
          objectPercent = key;
        }
      });

      objectSelected = objectPercent;
      stateEntity = stateActs.currentQuestion.answers;
    } else if (
      stateActs.currentQuestion.questionType.name === "reponse_double"
    ) {
      const goodAnswers = [];

      //Get only answers that match with the right boolean stored
      stateActs.currentQuestion.answers.forEach((answer) => {
        if (answer.boolForScore == booleanAnswerSelected.get(answer)) {
          goodAnswers.push(answer);
        }
      });

      objectSelected = goodAnswers;
      stateEntity = stateActs.currentQuestion.answers;
    }

    const isScoreAndAnswerStored = logScoreAndAnswer({
      dispatch,
      question: stateActs.currentQuestion,
      objectSelected,
      stateEntity,
      textareaValue,
    });

    if (isScoreAndAnswerStored) {
      //Display end modal to summarize act
      if (stateActs.questionOrder == actQuestionsLength - 1) {
        setOpenEndModal(true);
        return;
      } else {
        setShowMainContent(false);
        setContainsFeedback(false);
        setFeedback({
          content: "",
          title: "",
          hasQuestion: false,
          img: "",
        });
        dispatch(storeQuestionOrder(stateActs.questionOrder + 1));
        setStoreAnswer([]);
        setObjectCharacterSelected(null);
        setObjectTownSelected(null);
        setObjectPropositionSelected(null);
        setObjectMottoSelected(null);
        setShowAlertNoAnswer(false);
        setShowAlertBadAnswerNumber(false);
        scaleAnswers.clear();
        setScaleAnswers(new Map(scaleAnswers));
        setOrderedAnswers([]);
        booleanAnswerSelected.clear();
        setBooleanAnswerSelected(new Map(booleanAnswerSelected));
        textareaValue.clear();
        setTextareaValue(new Map(textareaValue));
        percentAnswers.clear();
        setPercentAnswers(new Map(percentAnswers));
        clearTimeout(timer);
        setTimer(null);
        setAnimationStarted(false);
        setCurrentQuestionOK(false);
        setIsModalFeedbackPassed(false);
      }
    } else {
      console.log("no score and answer stored");
    }
    // window.removeEventListener("beforeunload", confirmationRechargement);
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

          <Box
            sx={{
              width: "50vw",
              marginLeft: "10px",
              marginBottom: "0.5%",
              display: showAlertBadAnswerNumber ? "block" : "none",
            }}
          >
            <AlertBAdAnswerNumber />
          </Box>

          {/* Other alert error zone */}
          {stateUser.error && <Alert color="danger">{stateUser.error}</Alert>}
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
                  <Box height={"100%"} width={"100%"}>
                    {/* Main content */}
                    <Box
                      height={"100%"}
                      width={"100%"}
                      display={"flex"}
                      flexDirection={"column"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      sx={{
                        backgroundImage: `url(${PICTURES_DIR}/${stateActs.currentQuestion?.bgImgMainContent})`,
                        backgroundSize: "100% 100%",
                      }}
                    >
                      <Box
                        height={"95%"}
                        width={"100%"}
                        display={"flex"}
                        flexDirection={
                          stateActs.currentQuestion?.directionAnswer == "column"
                            ? "row"
                            : "column"
                        }
                        position={"relative"}
                        justifyContent={
                          stateActs.currentQuestion?.text?.justifyContent
                        }
                        alignItems={"center"}
                      >
                        {/* Question's content  */}
                        <Box
                          width={`${
                            stateActs.currentQuestion?.backgroundImg?.width *
                            100
                          }%`}
                          height={`${
                            stateActs.currentQuestion?.backgroundImg?.height *
                            100
                          }%`}
                          display={"flex"}
                          justifyContent={"center"}
                          alignItems={"center"}
                          position={
                            stateActs?.currentQuestion?.additionalContent
                              .length > 0
                              ? "absolute"
                              : "static"
                          }
                          left={
                            stateActs?.currentQuestion?.additionalContent
                              .length > 0
                              ? `${stateActs.currentQuestion?.backgroundImg?.left}%`
                              : 0
                          }
                          top={
                            stateActs?.currentQuestion?.additionalContent
                              .length > 0
                              ? `${stateActs.currentQuestion?.backgroundImg?.top}%`
                              : 0
                          }
                          sx={{
                            backgroundImage: `url(${PICTURES_DIR}/${stateActs.currentQuestion.backgroundImg.img})`,
                            backgroundSize: "100% 100%",
                            zIndex: 10,
                          }}
                          id={`question-box`}
                          className={animationStarted ? "fade-in" : ""}
                        >
                          <DisplayingText
                            sentence={stateActs.currentQuestion.text.content}
                            level={stateActs.currentQuestion.text.level || "h4"}
                            textColor={stateActs.currentQuestion.text.textColor}
                            padding={
                              window.innerWidth >= 601 &&
                              window.innerWidth <= 799
                                ? 2
                                : 5
                            }
                            textAlign={"center"}
                            marginLeft={`${stateActs.currentQuestion.text.marginLeft}%`}
                            marginTop={`${stateActs.currentQuestion?.text?.marginTop}%`}
                            id={"question-text"}
                          />
                        </Box>

                        {/* Answer content */}
                        <Box
                          id={`answer-box`}
                          width={
                            stateActs.currentQuestion?.directionAnswer ==
                              "row" ||
                            stateActs?.currentQuestion?.additionalContent
                              .length > 0
                              ? "100%"
                              : `
                                  ${
                                    (0.9 -
                                      stateActs.currentQuestion?.backgroundImg
                                        ?.width) *
                                    100
                                  }%`
                          }
                          height={
                            stateActs.currentQuestion?.directionAnswer == "row"
                              ? `${
                                  (0.9 -
                                    stateActs.currentQuestion?.backgroundImg
                                      ?.height) *
                                  100
                                }%`
                              : "90%"
                          }
                          display={"flex"}
                          className={animationStarted ? "zoom-in" : ""}
                          sx={{ zIndex: 1000 }}
                        >
                          {answerToDisplay(stateActs.currentQuestion)}
                        </Box>

                        {/* additionnal content  */}
                        {stateActs.currentQuestion.additionalContent.length >
                          0 &&
                          stateActs.currentQuestion.additionalContent.map(
                            (element) => {
                              const isVignette = element?.img?.includes(
                                "stateUser.secondCharacter.vignette"
                              );
                              const img = element?.img?.replace(
                                "stateUser.secondCharacter.vignette",
                                stateUser.secondCharacter?.vignette
                              );
                              return (
                                <Box
                                  key={element._id}
                                  position={"absolute"}
                                  width={`${element?.scale?.width * 100}%`}
                                  height={`${element?.scale?.height * 100}%`}
                                  top={`${element?.position?.top}%`}
                                  left={`${element?.position?.left}%`}
                                  display={"flex"}
                                  alignItems={"center"}
                                  zIndex={element?.zIndex}
                                  sx={{
                                    backgroundImage: `url(${PICTURES_DIR}/${img})`,
                                    backgroundSize: "100% 100%",
                                    borderRadius: isVignette ? 30 : 0,
                                  }}
                                >
                                  {element.text && (
                                    <DisplayingText
                                      sentence={element.text}
                                      animated={false}
                                      textAlign={"center"}
                                      padding={"10%"}
                                      id={"add-content-text"}
                                      level={element?.textLevel || "title-sm"}
                                      textColor={element?.textColor || "black"}
                                    />
                                  )}
                                </Box>
                              );
                            }
                          )}
                      </Box>
                      {/* Validate button */}
                      <Box
                        width={"100%"}
                        height={"5%"}
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        zIndex={1000}
                      >
                        <CustomButton
                          width={"15%"}
                          height={"100%"}
                          backgroundColor={colors.buttonLight}
                          hoverColor={colors.buttonLightHover}
                          clickMethod={() => {
                            const isValidAnswer = nextPage(
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
                            );

                            if (isValidAnswer) initializingState();
                          }}
                          textColor={colors.titleBackLight}
                        >
                          Valider
                        </CustomButton>
                      </Box>
                      {openFeedbackModal && (
                        <ModalFeedback
                          feedback={feedback}
                          logAnswerModal={logAnswerModal}
                          setLogAnswerModal={setLogAnswerModal}
                          openFeedbackModal={openFeedbackModal}
                          stateActs={stateActs}
                          setOpenEndModal={setOpenEndModal}
                          actQuestionsLength={actQuestionsLength}
                          setOpenFeedbackModal={setOpenFeedbackModal}
                          setIsModalFeedbackPassed={setIsModalFeedbackPassed}
                        />
                      )}
                      {openEndModal && endOfAct()}
                      {openScaleModal && (
                        <ModalScaleFeedback
                          scaleAnswers={scaleAnswers}
                          setOpenScaleModal={setOpenScaleModal}
                          setShowAlertNoAnswer={setShowAlertNoAnswer}
                          stateActs={stateActs}
                          openScaleModal={openScaleModal}
                          dispatch={dispatch}
                          setIsModalFeedbackPassed={setIsModalFeedbackPassed}
                          setObjectMottoSelected={setObjectMottoSelected}
                        />
                      )}
                    </Box>

                    {/* Decoration */}
                    <Box
                      position={"absolute"}
                      bottom={0}
                      left={"90%"}
                      width={"10%"}
                      height={"15%"}
                    >
                      <img src={decorationImg} height={"100%"} width={"100%"} />
                    </Box>

                    {/* Nav Buttons for proposition's answers*/}
                    {displayVerticalNav && isAnswerDisplayed && (
                      <Box bgcolor={"red"}>
                        <ButtonNavScroll
                          id="up-nav-button"
                          color="warning"
                          directionScroll={-1}
                          left={"-10%"}
                          top={"40%"}
                          height={0.05}
                          idContainer={"proposition-container"}
                          widthMove={200}
                          alignMvnt={"column"}
                        >
                          <TbArrowBigUpFilled />
                        </ButtonNavScroll>
                        <ButtonNavScroll
                          id="down-nav-button"
                          color="warning"
                          directionScroll={1}
                          left={"-10%"}
                          top={"50%"}
                          height={0.05}
                          idContainer={"proposition-container"}
                          widthMove={200}
                          alignMvnt={"column"}
                        >
                          <TbArrowBigDownFilled />
                        </ButtonNavScroll>
                      </Box>
                    )}
                  </Box>
                </Box>
              </>
            ) : (
              <Loading />
            )}
            {/* Drawer button  */}
          </Stack>
        </Box>
      )}
    </>
  );
};

export default Game;
