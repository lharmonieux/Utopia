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
import { backgroundSize } from "../../utils/backgroundSizeProvider.js";
import {
  setMotto,
  setPartyName,
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
  const dispatch = useDispatch();

  // State
  // const [currentQuestion, setCurrentQuestion] = useState();
  const [objectCharacterSelected, setObjectCharacterSelected] = useState(null);
  const [containsFeedback, setContainsFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  // const [orderQuestion, setOrderQuestion] = useState(1);
  const [storeAnswer, setStoreAnswer] = useState([]);
  const [openEndModal, setOpenEndModal] = useState(false);
  const [scoresThematic, setScoresThematic] = useState(new Map());
  const [showAlertNoAnswer, setShowAlertNoAnswer] = useState(false);
  const [showAlertBadAnswerNumber, setShowAlertBadAnswerNumber] =
    useState(false);
  const [textareaValue, setTextareaValue] = useState(new Map());
  const [rankUserText, setRankUserText] = useState("");

  // const [showDrawer, setShowDrawer] = useState(false);
  // const [showSummary, setShowSummary] = useState(false);
  const [showActPresentation, setShowActPresentation] = useState(true);
  const [showMainContent, setShowMainContent] = useState(false);
  const [scaleAnswers, setScaleAnswers] = useState(new Map());
  const [openScaleModal, setOpenScaleModal] = useState(false);
  const [fullContentBox, setFullContentBox] = useState();
  const [orderedAnswers, setOrderedAnswers] = useState([]);
  const [percentAnswers, setPercentAnswers] = useState(new Map());
  const [answerModal, setAnswerModal] = useState("");
  const [percentFinalAnswer, setPercentFinalAnswer] = useState({});

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
          // For manage multi-form
          for (let content of stateActs.currentQuestion.content)
            if (
              content?.answerType?.name == "texte" ||
              content?.answerType?.name == "texte_ville"
            ) {
              const allTextareas = new Map();
              for (let questionContent of stateActs.currentQuestion.content) {
                allTextareas.set(questionContent._id, "");
              }
              setTextareaValue(allTextareas);
            } else setTextareaValue(new Map());

          //Loading of question's datas
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
      return;
    }

    // Add Answer selected
    if (answerType == "proposition_multiple" || answerType == "classement")
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
    else if (answerType == "classement") {
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
    const secondCharacterName = stateUser?.secondCharacter?.name;
    let feedbackText = feedback.content;
    feedbackText = feedbackText.replace(
      "secondCharacterName",
      secondCharacterName
    );
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
                  animated={true}
                />
              </Typography>

              {/* Text area for some answers */}
              {feedback.hasQuestion && (
                <textarea
                  value={answerModal}
                  onChange={(e) => setAnswerModal(e.target.value)}
                  rows={6}
                  cols={45}
                />
              )}

              <Button
                onClick={() =>
                  animateOut(
                    openFeedbackModal,
                    "#modal-feedback-content",
                    () => {
                      setOpenFeedbackModal(false);
                      //Display end modal to summarize act
                      if (stateActs.questionOrder == actQuestionsLength - 1)
                        setOpenEndModal(true);
                      else initializingState();
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
    const copyScoresThematic = new Map(scoresThematic);
    const totalResidents = copyScoresThematic.get("residents");
    copyScoresThematic.delete("residents");
    const logScores = Object.fromEntries(copyScoresThematic);
    let resolutionText = stateActs.currentAct.resolution.text;

    resolutionText = resolutionText.replace("totalResidents", totalResidents);

    let saves = [...stateUser.saves];
    saves.push({
      logScores,
      logAnswers: [],
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
    // .then((response) => {
    //   // dispatch(setToken({ token: response.accessToken, error: null }));
    // })
    // .catch((error) => {
    //   console.log(error);
    // });

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
            height: parseInt(domConfig.height * 0.9),
            width: parseInt(domConfig.width * 0.9),
            backgroundImage: `url(${bgEndActImg})`,
            backgroundSize: backgroundSize(
              domConfig.width * 0.9,
              domConfig.height * 0.9
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
                width={"40%"}
                height={"100%"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                sx={{
                  backgroundImage: `url(${titleEndActImg})`,
                  backgroundSize: backgroundSize(
                    domConfig.width * 0.9 * 0.4,
                    domConfig.height * 0.9 * 0.9
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
                width={"58%"}
                height={"90%"}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <DisplayingText
                  level={stateActs.currentAct?.resolution?.textStyle?.size}
                  textColor={stateActs.currentAct?.resolution?.textStyle?.color}
                  fontWeight={
                    stateActs.currentAct?.resolution?.textStyle?.weight
                  }
                  sentence={resolutionText}
                  animated={true}
                />
                <DisplayingText
                  level={stateActs.currentAct?.resolution?.textStyle?.size}
                  textColor={stateActs.currentAct?.resolution?.textStyle?.color}
                  fontWeight={
                    stateActs.currentAct?.resolution?.textStyle?.weight
                  }
                  sentence={rankUserText}
                />
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
              <Button
                onClick={() => {
                  animateOut(openEndModal, "#modal-end", () => {
                    setOpenEndModal(false);
                    window.location.href = "/summary";
                    initializingState();
                  });
                }}
              >
                Next
              </Button>
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
          if (!tmpValue) {
            setShowAlertNoAnswer(true);
            return;
          }
        }

        // Store townName
        for (let content of stateActs.currentQuestion.content) {
          if (content.answerType.name == "texte_ville")
            dispatch(storeTownName(textareaValue.get(content._id)));
          else if (content.answerType.name == "texte_fete")
            dispatch(setPartyName(textareaValue.get(content._id)));
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
        stateActs?.currentQuestion?.content[0]?.answerType?.name ==
          "classement" &&
        storeAnswer.length < stateActs?.currentQuestion?.answers?.length
      ) {
        setShowAlertBadAnswerNumber(true);
        return;
      }
      if (
        stateActs?.currentQuestion?.content[0]?.answerType?.name ==
        "reponse_double"
      ) {
        // Store score for double answer
        storeScore(
          stateActs?.currentQuestion?.content[0]?.answerType?.name,
          null,
          stateActs.currentQuestion?.answers
        );
      }
      // If answer has a feedback
      if (containsFeedback) {
        setOpenFeedbackModal(true);
        return;
      }

      //Display end modal to summarize act
      if (stateActs.questionOrder == actQuestionsLength - 1) {
        setOpenEndModal(true);
        return;
      }
      //Display next page of act
      else {
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
                {choosenMotto && choosenMotto[0]?.content?.text?.text}
              </Typography>
            </Typography>

            <Button
              onClick={() =>
                animateOut(openScaleModal, "#modal-scale", () => {
                  setShowAlertNoAnswer(false);
                  setOpenScaleModal(false);
                })
              }
            >
              Retour au choix
            </Button>
            <Button
              onClick={() =>
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
                          {stateActs.currentQuestion?.content?.map(
                            (questionContent, index) => {
                              return (
                                <Box
                                  key={index}
                                  height={parseInt(domConfig.height * 0.95)}
                                  width={parseInt(domConfig.width)}
                                  display={"flex"}
                                  flexDirection={
                                    stateActs.currentQuestion?.visual
                                      ?.directionAnswer == "column"
                                      ? "row"
                                      : "column"
                                  }
                                  position={"relative"}
                                  justifyContent={
                                    questionContent?.justifyContent
                                  }
                                  alignItems={"center"}
                                >
                                  {/* Question's content  */}
                                  <Box
                                    width={parseInt(
                                      domConfig.width *
                                        questionContent?.backgroundImg?.width
                                    )}
                                    height={parseInt(
                                      domConfig.height *
                                        questionContent?.backgroundImg?.height
                                    )}
                                    display={"flex"}
                                    justifyContent={"center"}
                                    alignItems={
                                      !stateActs.currentQuestion.visual
                                        .boxAnswersImg
                                        ? "center"
                                        : "flex-start"
                                    }
                                    position={
                                      stateActs?.currentQuestion
                                        ?.additionalContent.length > 0
                                        ? "absolute"
                                        : "static"
                                    }
                                    left={
                                      stateActs?.currentQuestion
                                        ?.additionalContent.length > 0
                                        ? `${questionContent?.backgroundImg?.left}%`
                                        : 0
                                    }
                                    top={
                                      stateActs?.currentQuestion
                                        ?.additionalContent.length > 0
                                        ? `${questionContent?.backgroundImg?.top}%`
                                        : 0
                                    }
                                    zIndex={1}
                                    sx={{
                                      // bgcolor: "red",
                                      marginBottom: 1,
                                      backgroundImage: `url(${PICTURES_DIR}/${questionContent.backgroundImg.img})`,
                                      backgroundSize: backgroundSize(
                                        domConfig.width *
                                          questionContent?.backgroundImg?.width,
                                        domConfig.height *
                                          questionContent?.backgroundImg?.height
                                      ),
                                    }}
                                  >
                                    <DisplayingText
                                      sentence={questionContent.text}
                                      level={
                                        questionContent.textLevel || "title-md"
                                      }
                                      textColor={questionContent.textColor}
                                      padding={2}
                                      textAlign={"center"}
                                      marginLeft={`${questionContent.marginLeft}%`}
                                      animated={true}
                                    />
                                  </Box>
                                  {answerToDisplay(questionContent)}
                                </Box>
                              );
                            }
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
