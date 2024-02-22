import { useEffect, useState } from "react";
import {
  Stack,
  Box,
  Typography,
  Modal,
  ModalDialog,
  ModalClose,
  DialogTitle,
  CircularProgress,
  Alert,
} from "@mui/joy";
import Propositions from "../../components/Propositions.jsx";
import Characters from "../../components/Characters.jsx";
import TextArea from "../../components/TextArea.jsx";
import {
  AlertBAdAnswerNumber,
  AlertNoAnswer,
} from "../../components/Alert.jsx";
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
import {
  setMotto,
  setPartyName,
  setSymbol,
  setTown,
  setUserCharacter,
  setUserSecondCharacter,
  storeTownName,
} from "../../utils/redux/userSlice.js";
import apiRequest from "../../api/requestAPI.js";
import { IoInformationCircle } from "react-icons/io5";
import CustomButton from "../../components/CustomButton.jsx";
import RankView from "../../components/RankView.jsx";
import ButtonNavScroll from "../../components/ButtonNavScroll.jsx";
import { TbArrowBigDownFilled, TbArrowBigUpFilled } from "react-icons/tb";

const Game = () => {
  // variables
  // const { currentAct, characters, acts, towns } = useContext(AppContext);
  const stateActs = useSelector((state) => state.act);
  const stateUser = useSelector((state) => state.user);
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // State
  const [objectCharacterSelected, setObjectCharacterSelected] = useState(null);
  const [containsFeedback, setContainsFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const [storeAnswer, setStoreAnswer] = useState([]);
  const [openEndModal, setOpenEndModal] = useState(false);
  const [scoresThematic, setScoresThematic] = useState(new Map());
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
  const [answerModal, setAnswerModal] = useState({
    answerText: "",
    hasAnswer: true,
  });
  const [percentFinalAnswer, setPercentFinalAnswer] = useState({});
  const [answersToLogs, setAnswersToLogs] = useState(new Map());
  const [displayRankView, setDisplayRankView] = useState(false);
  const [timer, setTimer] = useState(null);

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
            setShowMainContent(true);
          });
        else {
          dispatch(
            setQuestion(
              stateActs.currentAct?.questions[stateActs.questionOrder]
            )
          );
          // Map last saves for user
          const logScores = Object.entries(stateUser.save.logScores);
          let newScoresThematic = new Map();
          for (let [key, value] of logScores) {
            newScoresThematic.set(key, value);
          }
          newScoresThematic.set("residents", stateUser.save.totalResidents);
          setScoresThematic(newScoresThematic);
          setShowMainContent(true);
        }
      }

      if (fullContentBox) {
        if (stateActs.currentQuestion) {
          // Display question Box
          let timer;
          for (let questionContent of stateActs.currentQuestion.content) {
            const questionBox = document.querySelector(
              `#question-box-${questionContent._id}`
            );
            if (questionBox) {
              timer = setTimeout(() => {
                questionBox.style.display = "flex";
                timer = setTimeout(() => {
                  const answerBox = document.querySelector(
                    `#answer-box-${questionContent._id}`
                  );
                  if (answerBox) answerBox.style.display = "block";
                }, 2500);
              }, 1000);
            }
          }
          setTimer(timer);

          // For manage multi-form
          const allTextareas = new Map();
          for (let content of stateActs.currentQuestion.content)
            if (
              content?.answerType?.name == "texte" ||
              content?.answerType?.name == "texte_ville" ||
              content?.answerType?.name == "texte_fete"
            ) {
              allTextareas.set(content.text, {
                answerText: "",
                answerType: "",
              });
            }
          setTextareaValue(allTextareas);

          //Loading of question's datas
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
      return;
    }

    // Add Answer selected
    if (
      answerType == "proposition_multiple" ||
      answerType == "classement" ||
      answerType == "classement_symbol"
    )
      setStoreAnswer([...storeAnswer, selectedAnswer]);
    else if (answerType == "reponse_double") return;
    else setStoreAnswer([selectedAnswer]);
  };

  const handleSelectedProposition = (
    selectedAnswer,
    answerType,
    modalTitle
  ) => {
    if (selectedAnswer?.feedback) {
      // If answer selected again
      if (feedback?.content == selectedAnswer.feedback) {
        setFeedback({
          content: undefined,
          title: undefined,
          hasQuestion: undefined,
        });
        setContainsFeedback(false);
      } else {
        setFeedback({
          content: selectedAnswer.feedback,
          title: modalTitle,
          hasQuestion: selectedAnswer?.feedbackHasQuestion,
        });
        setContainsFeedback(true);
      }
    } else setContainsFeedback(false);

    // Adapt state of the question
    // For unique answer
    if (answerType == "proposition") {
      // log choice's score
      updateStoreAnswer(selectedAnswer, answerType);
      storeScore(answerType, selectedAnswer);
      dispatch(
        updateQuestion({
          currentQuestion: stateActs.currentQuestion,
          selectedAnswer,
          typeAnswer: "single",
        })
      );
    }
    //For answer with classement
    //For store the score, we have to pass only the fisrt element of the table rank
    else if (answerType == "classement" || answerType == "classement_symbol") {
      let newOrderedAnswers = [...orderedAnswers];
      if (orderedAnswers.length > 0) {
        if (orderedAnswers.includes(selectedAnswer._id)) {
          newOrderedAnswers = newOrderedAnswers.filter(
            (id) => id != selectedAnswer._id
          );
          setOrderedAnswers(newOrderedAnswers);
        } else {
          newOrderedAnswers.push(selectedAnswer._id);
          setOrderedAnswers(newOrderedAnswers);
        }
      } else {
        newOrderedAnswers.push(selectedAnswer._id);
        setOrderedAnswers(newOrderedAnswers);
      }

      updateStoreAnswer(selectedAnswer, answerType);
      const newSelectedAnswer = stateActs.currentQuestion.answers?.filter(
        (answer) => answer._id == newOrderedAnswers[0]
      );

      //For the fisrt click/selection
      if (newSelectedAnswer.length > 0 || selectedAnswer.selected) {
        if (newSelectedAnswer[0]?._id == selectedAnswer._id) {
          dispatch(
            updateQuestion({
              currentQuestion: stateActs.currentQuestion,
              selectedAnswer,
              typeAnswer: "single",
            })
          );
          storeScore(answerType, selectedAnswer);
          return;
        }

        //If the answer with rank 1 is selected again
        if (selectedAnswer.selected) {
          dispatch(
            updateQuestion({
              currentQuestion: stateActs.currentQuestion,
              selectedAnswer: newSelectedAnswer[0] || selectedAnswer,
              typeAnswer: "single",
            })
          );
          storeScore(answerType, newSelectedAnswer[0] || selectedAnswer);
        }
      }
    }
    //For answer with percentage
    else if (answerType == "pourcentage") {
      if (percentFinalAnswer._id == selectedAnswer._id) return;
      else {
        updateStoreAnswer(selectedAnswer, answerType);
        storeScore(answerType, selectedAnswer);
        dispatch(
          updateQuestion({
            currentQuestion: stateActs.currentQuestion,
            selectedAnswer: selectedAnswer,
            typeAnswer: "single",
          })
        );
        setPercentFinalAnswer(selectedAnswer);
      }
    }
    //For select town
    else if (answerType == "town") {
      if (stateActs?.currentQuestion?.visual?.mapView?.hasAnswer) {
        updateStoreAnswer(selectedAnswer, answerType);
        storeScore(answerType, selectedAnswer);
        dispatch(
          updateQuestion({
            currentQuestion: stateActs.currentQuestion,
            selectedAnswer,
            typeAnswer: "single",
          })
        );
      } else {
        updateStoreAnswer(selectedAnswer, answerType);
        dispatch(
          setTown({
            region: selectedAnswer?.name,
            description: selectedAnswer?.description,
          })
        );
      }
    }

    // For multiples answers
    else {
      // 3 answers max for update question State
      if (
        storeAnswer.length <
          (stateActs.currentQuestion?.visual?.nbOfAnswersRequired || 3) ||
        selectedAnswer.selected
      ) {
        updateStoreAnswer(selectedAnswer, answerType);
        storeScore(answerType, selectedAnswer);
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

  const answerToDisplay = (questionContent) => {
    switch (questionContent.answerType?.name) {
      //Affichage du choix des persos
      case "personnage":
        return (
          <Characters
            setObjectCharacterSelected={setObjectCharacterSelected}
            objectSelectedCharacter={objectCharacterSelected}
            questionContent={questionContent}
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
            orderedAnswer={orderedAnswers}
            percentAnswers={percentAnswers}
            setPercentAnswers={setPercentAnswers}
            questionContent={questionContent}
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
            questionContent={questionContent}
          />
        );

      case "notation":
        return (
          <ScaleProposition
            setScaleAnswers={setScaleAnswers}
            scaleAnswers={scaleAnswers}
            questionContent={questionContent}
          />
        );

      case "town":
        return (
          <Towns
            handleSelectedProposition={handleSelectedProposition}
            questionContent={questionContent}
          />
        );

      default:
        break;
    }
  };

  const modalFeedback = () => {
    const handleSubmit = () => {
      if (feedback.hasQuestion && !answerModal.answerText) {
        setAnswerModal({ answerText: "", hasAnswer: false });
        return;
      }

      animateOut(openFeedbackModal, "#modal-feedback-content", () => {
        //Display end modal to summarize act
        if (stateActs.questionOrder == actQuestionsLength - 1)
          setOpenEndModal(true);
        else {
          if (storeAnswer.length == 1) {
            //Single answer proposition
            let answerText = storeAnswer[0]?.content?.text?.text;
            const newAnswersToLog = new Map(answersToLogs);
            newAnswersToLog.set(
              stateActs?.currentQuestion?.content[0]?.text,
              answerText
            );
            if (feedback.hasQuestion) {
              //Save answer of question in modal
              newAnswersToLog.set(feedback.content, answerModal);
            }
            setAnswersToLogs(newAnswersToLog);
          }
          setOpenFeedbackModal(false);
          initializingState();
        }
      });
    };

    // Modal for feedbacks
    return (
      <Modal
        open={openFeedbackModal}
        onClose={() => handleSubmit()}
        className={animationModalIn}
        id={"modal-feedback-content"}
        sx={{ zIndex: 1000 }}
      >
        <ModalDialog
          sx={{
            width: "50%",
            height: "85%",
            backgroundImage: `url(${PICTURES_DIR}/${stateActs.currentQuestion?.visual?.feedbackImg})`,
            backgroundSize: "100% 100%",
            position: "relative",
            paddingTop: "5%",
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
              id={"modal-title"}
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
            <DisplayingText
              sentence={feedback.content}
              level="title-md"
              textColor={"black"}
              animated={true}
              textAlign={"justify"}
              id={"modal-text"}
            />

            {/* Text area for some answers */}
            {feedback.hasQuestion && (
              <>
                <textarea
                  value={answerModal.answerText}
                  onChange={(e) =>
                    setAnswerModal({
                      answerText: e.target.value,
                      hasAnswer: true,
                    })
                  }
                  rows={6}
                  cols={45}
                  style={{
                    resize: "none",
                    fontSize: window.innerWidth >= 1920 ? "1.7em" : "1em",
                  }}
                />

                {!answerModal.hasAnswer && (
                  <Typography
                    marginTop={"-5%"}
                    level="body-sm"
                    fontWeight={600}
                    textColor={"red"}
                    startDecorator={<IoInformationCircle />}
                  >
                    Une réponse est requise
                  </Typography>
                )}
              </>
            )}

            <Box width={"25%"} height={"8%"}>
              <CustomButton
                backgroundColor={colors.buttonLight}
                hoverColor={colors.buttonLightHover}
                width={"100%"}
                height={"100%"}
                clickMethod={handleSubmit}
                textColor={colors.titleBackLight}
              >
                Continuer
              </CustomButton>
            </Box>
          </Box>
        </ModalDialog>
      </Modal>
    );
  };

  // Modal for end of act / Summary
  const endOfAct = () => {
    const copyScoresThematic = new Map(scoresThematic);
    const totalResidents = copyScoresThematic.get("residents");
    copyScoresThematic.delete("residents");
    const logScores = Object.fromEntries(copyScoresThematic);
    const logAnswers = Object.fromEntries(answersToLogs);
    let resolutionText = stateActs.currentAct.resolution.text;

    resolutionText = resolutionText.replace("totalResidents", totalResidents);

    let saves = [...stateUser.saves];
    saves.push({
      logScores,
      logAnswers,
      totalResidents,
      act: stateActs.currentAct?._id,
    });

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
      partyName: stateUser.partyName,
      saves,
    };

    // Save games's datas
    apiRequest("users/update", "put", authState.token, {
      data: { ...userToSave, idUser: stateUser.idUser },
    });

    const resultAllUsers = apiRequest("users/all", "get", authState.token);
    resultAllUsers
      .then((response) => {
        const allUsers = response.response.data?.filter(
          (account) => account.user._id != stateUser.idUser
        );
        // Calcul of max resident that one user won
        let maxResidents = 0;
        for (let account of allUsers) {
          const userSave =
            account.user.saves[stateActs.currentAct?.chapter - 1];
          const userResidents = userSave?.totalResidents;
          if (userResidents > maxResidents) maxResidents = userResidents;
        }

        //Calcul of percentage ranking of user
        const percentRank = 100 - (totalResidents / maxResidents) * 100;
        if (percentRank < 100 && percentRank >= 80)
          setRankUserText(
            `\n\nVous faites partie des 80% les meilleurs. Il va falloir accélérer, tout reste à conquérir !`
          );
        else if (percentRank < 80 && percentRank >= 50)
          setRankUserText(
            `\n\nVous faites partie des 50% les meilleurs. Encore un effort, vous êtes sur la bonne voie !`
          );
        else if (percentRank < 50 && percentRank >= 0)
          setRankUserText(
            `\n\nVous faites partie des 30% les meilleurs ! Quelle performance, continuez comme ça !`
          );
        else
          setRankUserText(
            `\n\nVous faites partie des 30% les meilleurs ! Quelle performance, continuez comme ça !`
          );
      })
      .catch((error) => {
        console.log(error);
      });

    return titleEndActImg && rankEndActImg && bgEndActImg ? (
      <Modal
        open={openEndModal}
        onClose={() => {
          animateOut(openEndModal, "#modal-end", () => {
            setOpenEndModal(false);
            window.location.href = "/summary";
            initializingState();
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
                >{`Résolution de l'ACTE ${stateActs.currentAct?.chapter}`}</Typography>
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
                {rankUserText ? (
                  <>
                    <DisplayingText
                      level={stateActs.currentAct?.resolution?.textStyle?.size}
                      textColor={
                        stateActs.currentAct?.resolution?.textStyle?.color
                      }
                      fontWeight={
                        stateActs.currentAct?.resolution?.textStyle?.weight
                      }
                      sentence={resolutionText}
                      animated={true}
                      backgroundText={"rgba(70, 8, 134, 0.7)"}
                      padding={"5%"}
                      onComplete={function () {
                        setDisplayRankView(true);
                      }}
                      id={"end-modal-res-text"}
                    />
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
                    initializingState();
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

  const storeScore = (answerType, selectedAnswer = null, answers = []) => {
    switch (answerType) {
      case "proposition":
      case "proposition_multiple":
      case "personnage":
      case "notation":
      case "classement":
      case "pourcentage":
      case "town":
        // update store if answer is selected again
        if (selectedAnswer.selected) {
          let newScoresThematic = new Map(scoresThematic);
          const oldScore = newScoresThematic.get(selectedAnswer.thematic.name);
          const oldGivenResidents = newScoresThematic.get("residents");

          if (oldScore)
            newScoresThematic.set(
              selectedAnswer.thematic.name,
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
          let oldScore;
          let oldGivenResidents = scoresThematic.get("residents");
          let newScoresThematic = new Map(scoresThematic);

          //Remove score of the previous selected answer
          for (let answer of stateActs.currentQuestion.answers) {
            if (answer.selected) {
              oldScore = newScoresThematic.get(answer.thematic.name);
              newScoresThematic.set(
                "residents",
                oldGivenResidents
                  ? oldGivenResidents - answer.givenResidents
                  : 0
              );

              newScoresThematic.set(
                answer.thematic.name,
                oldScore ? oldScore - answer.score : 0
              );
            }
          }

          //Store new score
          oldScore = newScoresThematic.get(selectedAnswer.thematic.name);
          oldGivenResidents = newScoresThematic.get("residents");
          newScoresThematic.set(
            "residents",
            oldGivenResidents
              ? oldGivenResidents + selectedAnswer.givenResidents
              : selectedAnswer.givenResidents
          );

          newScoresThematic.set(
            selectedAnswer.thematic.name,
            oldScore ? oldScore + selectedAnswer.score : selectedAnswer.score
          );
          setScoresThematic(newScoresThematic);
        }

        break;

      case "reponse_double":
        if (answers) {
          let newScoresThematic = new Map(scoresThematic);
          for (let answer of answers) {
            const oldScore = newScoresThematic.get(answer.thematic.name);
            const oldGivenResidents = newScoresThematic.get("residents");

            // Check the pair of good answer
            if (answer.selected == answer.boolForScore) {
              newScoresThematic.set(
                "residents",
                oldGivenResidents
                  ? oldGivenResidents + answer.givenResidents
                  : answer.givenResidents
              );

              newScoresThematic.set(
                answer.thematic.name,
                oldScore ? oldScore + answer.score : answer.score
              );
            }
          }
          setScoresThematic(newScoresThematic);
        }
        break;

      default:
        break;
    }
  };

  const initializingState = () => {
    //Display end modal to summarize act
    if (stateActs.questionOrder == actQuestionsLength - 1) {
      setOpenEndModal(true);
      return;
    }

    setShowMainContent(false);
    setContainsFeedback(false);
    setFeedback({
      content: undefined,
      title: undefined,
      hasQuestion: undefined,
    });
    dispatch(setQuestionOrder(stateActs.questionOrder + 1));
    setStoreAnswer([]);
    setObjectCharacterSelected(null);
    setShowAlertNoAnswer(false);
    setShowAlertBadAnswerNumber(false);
    scaleAnswers.clear();
    setScaleAnswers(new Map(scaleAnswers));
    setOrderedAnswers([]);
    textareaValue.clear();
    setTextareaValue(new Map(textareaValue));
    percentAnswers.clear();
    setPercentAnswers(new Map(percentAnswers));
    clearTimeout(timer);
    setTimer(null);
  };

  // Manage for the next element to display
  const nextPage = () => {
    //Control of if there are an given answer
    if (
      storeAnswer.length > 0 ||
      scaleAnswers.size > 0 ||
      objectCharacterSelected ||
      textareaValue.size > 0 ||
      stateActs?.currentQuestion?.content[0]?.answerType?.name ==
        "reponse_double"
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
        for (let content of stateActs.currentQuestion.content) {
          if (content.answerType.name == "texte_ville")
            dispatch(storeTownName(textareaValue.get(content.text).answerText));
          else if (content.answerType.name == "texte_fete")
            dispatch(setPartyName(textareaValue.get(content.text).answerText));
          else continue;
        }
      }
      //Store character
      if (objectCharacterSelected) {
        stateUser.character
          ? dispatch(setUserSecondCharacter(objectCharacterSelected))
          : dispatch(setUserCharacter(objectCharacterSelected));
      }

      //Scale answer control
      if (scaleAnswers.size > 0) {
        setOpenScaleModal(true);
        return;
      }
      //Multiple answers control
      if (
        stateActs?.currentQuestion?.content[0]?.answerType?.name ==
          "proposition_multiple" &&
        storeAnswer.length <
          (stateActs.currentQuestion?.visual?.nbOfAnswersRequired || 3)
      ) {
        setShowAlertBadAnswerNumber(true);
        return;
      }
      // Ranking answer control
      if (
        (stateActs?.currentQuestion?.content[0]?.answerType?.name ==
          "classement" ||
          stateActs?.currentQuestion?.content[0]?.answerType?.name ==
            "classement_symbol") &&
        storeAnswer.length < stateActs?.currentQuestion?.answers?.length
      ) {
        setShowAlertBadAnswerNumber(true);
        return;
      }
      // Store score for double answer
      if (
        stateActs?.currentQuestion?.content[0]?.answerType?.name ==
        "reponse_double"
      ) {
        storeScore(
          stateActs?.currentQuestion?.content[0]?.answerType?.name,
          null,
          stateActs.currentQuestion?.answers
        );
      }
      // Save symbol choosen
      if (
        stateActs?.currentQuestion?.content[0]?.answerType?.name ==
        "classement_symbol"
      ) {
        let nameSymbol = "";
        for (let answer of stateActs.currentQuestion.answers) {
          if (answer._id == orderedAnswers[0])
            nameSymbol = answer.content.text.text;
        }

        dispatch(setSymbol(nameSymbol));
      }
      // If answer has a feedback
      if (containsFeedback) {
        setOpenFeedbackModal(true);
        return;
      }

      //Save answer for historic and Display next page of act
      else {
        //Multiple answers
        if (storeAnswer.length > 1) {
          let answersText = [];
          const newAnswersToLog = new Map(answersToLogs);
          for (let answer of storeAnswer) {
            answersText.push(answer?.content?.text?.text);
          }
          newAnswersToLog.set(
            stateActs?.currentQuestion?.content[0]?.text,
            answersText
          );
          setAnswersToLogs(newAnswersToLog);
        } else if (percentAnswers.size > 0) {
          //Percents values
          let answerObj = Object.fromEntries(percentAnswers);
          const newAnswersToLog = new Map(answersToLogs);
          newAnswersToLog.set(
            stateActs?.currentQuestion?.content[0]?.text,
            answerObj
          );
          setAnswersToLogs(newAnswersToLog);
        } else if (textareaValue.size > 0) {
          //Store random textarea answer
          const iterator = textareaValue.entries();
          const newAnswersToLog = new Map(answersToLogs);
          for (let i = 0; i < textareaValue.size; i++) {
            const curr = iterator.next().value;
            if (curr[1].answerType == "texte") {
              newAnswersToLog.set(curr[0], curr[1].answerText);
            }
          }

          setAnswersToLogs(newAnswersToLog);
        } else if (storeAnswer.length == 1) {
          //Single answer proposition
          let answerText = storeAnswer[0]?.content?.text?.text;
          const newAnswersToLog = new Map(answersToLogs);
          newAnswersToLog.set(
            stateActs?.currentQuestion?.content[0]?.text,
            answerText
          );
          setAnswersToLogs(newAnswersToLog);
        } else {
          //Save all "reponse_double" for having their status
          const answersDbl = new Map();
          const newAnswersToLog = new Map(answersToLogs);
          for (let answer of stateActs.currentQuestion.answers) {
            answersDbl.set(answer.content.text.text, answer.selected);
          }
          newAnswersToLog.set(
            stateActs?.currentQuestion?.content[0]?.text,
            Object.fromEntries(answersDbl)
          );
          setAnswersToLogs(newAnswersToLog);
        }

        initializingState();
      }
    } else setShowAlertNoAnswer(true);
  };

  const scaleModal = () => {
    let choosenMotto;
    if (scaleAnswers) {
      const scales = scaleAnswers.values();
      let maxScale = 1;
      //Calcul max note given
      for (let nb of scales) if (nb > maxScale) maxScale = nb;

      if (maxScale == 1) {
        setOpenScaleModal(false);
        setShowAlertNoAnswer(true);
      }

      //Get Id of answer for max note given
      let idMaxScale = "";
      for (let [key, value] of scaleAnswers)
        if (value == maxScale) idMaxScale = key;

      //Result : choosen motto
      choosenMotto = stateActs.currentQuestion?.answers?.filter(
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
        <ModalDialog
          sx={{
            width: "30%",
            height: "70%",
            position: "relative",
            backgroundImage: `url(${PICTURES_DIR}/${stateActs.currentQuestion?.visual?.feedbackImg})`,
            backgroundSize: "100% 100%",
          }}
        >
          <ModalClose variant="outlined" />
          <DialogTitle
            id={"modal-scale-feedback-title"}
            sx={{
              marginTop: "10%",
              marginLeft: "45%",
              color: colors.titleBackLight,
            }}
          >
            Votre devise
          </DialogTitle>

          {/* Main content */}
          <Box
            width={"100%"}
            height={"60%"}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"space-evenly"}
            alignItems={"center"}
          >
            <Typography textAlign={"justify"} id={"modal-scale-feedback-text"}>
              En se basant sur vos notes, la devise qui vous convient le mieux
              est :{" "}
              <Typography fontWeight={800}>
                {choosenMotto && choosenMotto[0]?.content?.text?.text}
              </Typography>
            </Typography>

            <Box
              width={"100%"}
              height={"15%"}
              display={"flex"}
              flexDirection={"row"}
              alignItems={"center"}
              justifyContent={"space-evenly"}
            >
              {/* Left button */}
              <CustomButton
                backgroundColor={colors.buttonLight}
                hoverColor={colors.buttonLightHover}
                height={"100%"}
                textColor={colors.titleBackLight}
                clickMethod={() =>
                  animateOut(openScaleModal, "#modal-scale", () => {
                    setShowAlertNoAnswer(false);
                    setOpenScaleModal(false);
                  })
                }
              >
                Retour au choix
              </CustomButton>

              {/* Right button */}
              <CustomButton
                backgroundColor={colors.buttonLight}
                hoverColor={colors.buttonLightHover}
                height={"100%"}
                textColor={colors.titleBackLight}
                clickMethod={() =>
                  animateOut(openScaleModal, "#modal-scale", () => {
                    setOpenScaleModal(false);
                    dispatch(setMotto(choosenMotto[0]?.content?.text?.text));
                    storeScore(
                      stateActs?.currentQuestion?.content[0]?.answerType?.name,
                      choosenMotto[0]
                    );
                    initializingState();
                  })
                }
              >
                Continuer
              </CustomButton>
            </Box>
          </Box>
        </ModalDialog>
      </Modal>
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
                        backgroundImage: `url(${PICTURES_DIR}/${stateActs.currentQuestion?.visual?.bgImgMainContent})`,
                        backgroundSize: "100% 100%",
                      }}
                    >
                      {stateActs.currentQuestion?.content?.map(
                        (questionContent, index) => {
                          return (
                            <Box
                              key={index}
                              height={"95%"}
                              width={"100%"}
                              display={"flex"}
                              flexDirection={
                                stateActs.currentQuestion?.visual
                                  ?.directionAnswer == "column"
                                  ? "row"
                                  : "column"
                              }
                              position={"relative"}
                              justifyContent={questionContent?.justifyContent}
                              alignItems={"center"}
                            >
                              {/* Question's content  */}
                              <Box
                                width={`${
                                  questionContent?.backgroundImg?.width * 100
                                }%`}
                                height={`${
                                  questionContent?.backgroundImg?.height * 100
                                }%`}
                                display={
                                  stateActs.currentQuestion?.content?.length > 1
                                    ? "flex"
                                    : "none"
                                }
                                justifyContent={"center"}
                                alignItems={
                                  !stateActs.currentQuestion.visual
                                    .boxAnswersImg
                                    ? "center"
                                    : "flex-start"
                                }
                                position={
                                  stateActs?.currentQuestion?.additionalContent
                                    .length > 0
                                    ? "absolute"
                                    : "static"
                                }
                                left={
                                  stateActs?.currentQuestion?.additionalContent
                                    .length > 0
                                    ? `${questionContent?.backgroundImg?.left}%`
                                    : 0
                                }
                                top={
                                  stateActs?.currentQuestion?.additionalContent
                                    .length > 0
                                    ? `${questionContent?.backgroundImg?.top}%`
                                    : 0
                                }
                                sx={{
                                  backgroundImage: `url(${PICTURES_DIR}/${questionContent.backgroundImg.img})`,
                                  backgroundSize: "100% 100%",
                                  zIndex: 1000,
                                }}
                                id={`question-box-${questionContent._id}`}
                                className={
                                  stateActs.currentQuestion?.content?.length ==
                                    1 && "fade-in"
                                }
                              >
                                <DisplayingText
                                  sentence={questionContent.text}
                                  level={questionContent.textLevel || "h4"}
                                  textColor={questionContent.textColor}
                                  padding={5}
                                  textAlign={"center"}
                                  marginLeft={`${questionContent.marginLeft}%`}
                                  id={"question-text"}
                                />
                              </Box>

                              {/* Answer content */}
                              <Box
                                id={`answer-box-${questionContent._id}`}
                                width={
                                  stateActs.currentQuestion?.visual
                                    ?.directionAnswer == "row" ||
                                  stateActs?.currentQuestion?.additionalContent
                                    .length > 0
                                    ? "100%"
                                    : `
                                  ${
                                    (0.9 -
                                      questionContent?.backgroundImg?.width) *
                                    100
                                  }%`
                                }
                                height={
                                  stateActs.currentQuestion?.visual
                                    ?.directionAnswer == "row"
                                    ? `${
                                        (0.9 -
                                          questionContent?.backgroundImg
                                            ?.height) *
                                        100
                                      }%`
                                    : "90%"
                                }
                                display={
                                  stateActs.currentQuestion?.content?.length > 1
                                    ? "flex"
                                    : "none"
                                }
                                className={
                                  stateActs.currentQuestion?.content?.length ==
                                    1 && "zoom-in"
                                }
                                sx={{ zIndex: 1000 }}
                              >
                                {answerToDisplay(questionContent)}
                              </Box>

                              {/* additionnal content  */}
                              {stateActs.currentQuestion.additionalContent
                                .length > 0 &&
                                stateActs.currentQuestion.additionalContent.map(
                                  (element) => {
                                    const isVignette = element.img.includes(
                                      "stateUser.secondCharacter.vignette"
                                    );
                                    const img = element.img.replace(
                                      "stateUser.secondCharacter.vignette",
                                      stateUser.secondCharacter.vignette
                                    );
                                    return (
                                      <Box
                                        key={element._id}
                                        position={"absolute"}
                                        width={`${element.scale.width * 100}%`}
                                        height={`${
                                          element.scale.height * 100
                                        }%`}
                                        top={`${element.position.top}%`}
                                        left={`${element.position.left}%`}
                                        display={"flex"}
                                        alignItems={"center"}
                                        sx={{
                                          backgroundImage: `url(${PICTURES_DIR}/${img})`,
                                          backgroundSize: "100% 100%",
                                          borderRadius: isVignette ? 30 : 0,
                                        }}
                                      >
                                        <Typography
                                          level={
                                            element?.textLevel || "title-sm"
                                          }
                                          textAlign={"center"}
                                          padding={"5%"}
                                          sx={{
                                            color:
                                              element?.textColor || "black",
                                          }}
                                        >
                                          <DisplayingText
                                            sentence={element.text}
                                            animated={false}
                                            textAlign={"justify"}
                                            id={"add-content-text"}
                                          />
                                        </Typography>
                                      </Box>
                                    );
                                  }
                                )}
                            </Box>
                          );
                        }
                      )}

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
                          clickMethod={nextPage}
                          textColor={colors.titleBackLight}
                        >
                          Valider
                        </CustomButton>
                      </Box>
                      {openFeedbackModal && modalFeedback()}
                      {openEndModal && endOfAct()}
                      {openScaleModal && scaleModal()}
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
                    <Box position={"absolute"} height={"30%"} width={"10%"}>
                      <ButtonNavScroll
                        id="up-nav-button"
                        color="warning"
                        directionScroll={-1}
                        left={"-60%"}
                        top={"-160%"}
                        height={0.1}
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
                        left={"-60%"}
                        top={"-130%"}
                        height={0.1}
                        idContainer={"proposition-container"}
                        widthMove={200}
                        alignMvnt={"column"}
                      >
                        <TbArrowBigDownFilled />
                      </ButtonNavScroll>
                    </Box>
                  </Box>
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
