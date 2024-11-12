/* eslint-disable react/prop-types */
import { Box, Stack, Typography } from "@mui/joy";
import { useSelector } from "react-redux";
import { PICTURES_DIR } from "../utils/constants";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { useEffect } from "react";
import DisplayingText from "./DisplayingText";
import { selectionEffect } from "../utils/cssReact";
import CustomButton from "./CustomButton";
import { GrPowerReset } from "react-icons/gr";
import "animate.css";
import Loading from "../views/Loading";

const Propositions = ({
  handleSelectedProposition,
  orderedAnswers,
  setOrderedAnswers,
  percentAnswers,
  setPercentAnswers,
  question,
  storeAnswer,
  objectPropositionSelected,
  setObjectPropositionSelected,
  feedback,
  setFeedback,
  setContainsFeedback,
  booleanAnswerSelected,
  setBooleanAnswerSelected,
}) => {
  const stateActs = useSelector((state) => state.act);

  useEffect(() => {
    // Initializing of percent values for propositions
    if (question.questionType.name == "pourcentage") {
      let percentAnswers = new Map();
      for (let answer of stateActs.currentQuestion.answers) {
        percentAnswers.set(answer, 0);
      }
      setPercentAnswers(percentAnswers);
    } else if (question.questionType.name == "reponse_double") {
      let booleanAnswers = new Map();
      for (let answer of stateActs.currentQuestion.answers) {
        booleanAnswers.set(answer, false);
      }
      setBooleanAnswerSelected(booleanAnswers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswer = (e, selectedAnswer) => {
    if (question.questionType.name == "proposition") {
      handleSelectedSingleProposition(selectedAnswer);
    } else if (
      question.questionType.name == "classement" ||
      question.questionType.name == "classement_symbol"
    ) {
      handleOrderedAnswer(selectedAnswer);
    } else if (question.questionType.name == "reponse_double") {
      handleBooleanAnswer(selectedAnswer);
    } else {
      handleSelectedProposition(
        selectedAnswer,
        question?.questionType?.name,
        ""
      );
    }
  };
  const handleOrderedAnswer = (selectedAnswer) => {
    let newOrderedAnswers = [...orderedAnswers];
    if (orderedAnswers.length > 0) {
      if (orderedAnswers.includes(selectedAnswer)) {
        newOrderedAnswers = newOrderedAnswers.filter(
          (e) => e._id != selectedAnswer._id
        );
        setOrderedAnswers(newOrderedAnswers);
      } else {
        newOrderedAnswers.push(selectedAnswer);
        setOrderedAnswers(newOrderedAnswers);
      }
    } else {
      newOrderedAnswers.push(selectedAnswer);
      setOrderedAnswers(newOrderedAnswers);
    }
  };

  const handlePercentsValue = (e, selectedAnswer) => {
    const newPercentAnswers = new Map(percentAnswers);
    let maxPercentGiven = 0;
    let maxPercent = 100;
    let restAnswers = [];
    let givenValue = 0;

    // If last value was 0, replace this value automacatily by the new one
    if (newPercentAnswers.get(selectedAnswer) == 0) {
      if (parseInt(e.target.value % 10) == 0)
        givenValue = parseInt(e.target.value) / 10;
      else givenValue = parseInt(e.target.value);
    }
    // If we already have not null value
    else givenValue = parseInt(e.target.value);

    //Get all answer where value = 0
    for (let answer of stateActs.currentQuestion.answers) {
      if (answer == selectedAnswer) continue;
      restAnswers.push(answer);
      maxPercentGiven += newPercentAnswers.get(answer);
    }

    //Sort all values that exist in order
    restAnswers.sort(
      (a, b) => newPercentAnswers.get(b) - newPercentAnswers.get(a)
    );

    //Control if the new value can pass
    const maxPercentWithAnswer = maxPercentGiven + parseInt(givenValue);
    if (parseInt(givenValue) > maxPercent || parseInt(givenValue) < 0)
      newPercentAnswers.set(
        selectedAnswer,
        newPercentAnswers.get(selectedAnswer)
      );
    else if (maxPercentWithAnswer > maxPercent) {
      newPercentAnswers.set(selectedAnswer, parseInt(givenValue));

      //Distribution off values for avoid negatives possibilities
      const valToDeduce = maxPercentWithAnswer - maxPercent;
      let firstNewPercent = 0;
      let secondNewPercent = 0;
      if (newPercentAnswers.get(restAnswers[0]) < valToDeduce) {
        secondNewPercent =
          newPercentAnswers.get(restAnswers[1]) -
          parseInt(valToDeduce - newPercentAnswers.get(restAnswers[0]));
      } else {
        firstNewPercent = parseInt(
          newPercentAnswers.get(restAnswers[0]) - valToDeduce
        );
      }

      newPercentAnswers.set(restAnswers[0], firstNewPercent);
      secondNewPercent &&
        newPercentAnswers.set(restAnswers[1], secondNewPercent);
    } else if (newPercentAnswers.get(restAnswers[0]) == 0) {
      newPercentAnswers.set(selectedAnswer, parseInt(givenValue));

      newPercentAnswers.set(restAnswers[0], maxPercent - maxPercentWithAnswer);
    } else if (maxPercentWithAnswer < maxPercent) {
      newPercentAnswers.set(selectedAnswer, parseInt(givenValue));

      newPercentAnswers.set(
        restAnswers[0],
        newPercentAnswers.get(restAnswers[0]) +
          (maxPercent - maxPercentWithAnswer)
      );
    }

    setPercentAnswers(newPercentAnswers);
  };

  const handleBooleanAnswer = (selectedAnswer) => {
    const newBooleanAnswers = new Map(booleanAnswerSelected);
    newBooleanAnswers.set(
      selectedAnswer,
      !booleanAnswerSelected.get(selectedAnswer)
    );
    setBooleanAnswerSelected(newBooleanAnswers);
  };

  const contentChoice = (answer) => {
    switch (question.questionType.name) {
      case "proposition_multiple":
        if (storeAnswer?.find((e) => e._id == answer._id))
          return <IoIosCheckmarkCircle color="green" size={25} />;
        break;

      case "classement":
      case "classement_symbol":
        return (
          <Typography level="title-lg">
            {orderedAnswers.indexOf(answer) + 1 || ""}
          </Typography>
        );

      case "pourcentage":
        return (
          <Box
            width={"100%"}
            height={"100%"}
            display={"flex"}
            flexDirection={"row"}
            position={"relative"}
          >
            <input
              type="number"
              value={percentAnswers.get(answer) || 0}
              onChange={(e) => handlePercentsValue(e, answer)}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/^0+/, ""); // Enlève les zéros en début
              }}
              key={`input_${answer._id}`}
              style={{
                border: "none",
                outline: "none",
                backgroundColor: "transparent",
                textAlign: "center",
                width: "90%",
                height: "100%",
                fontSize:
                  window.innerWidth >= 1024 && window.innerWidth <= 1439
                    ? "1em"
                    : window.innerWidth >= 1920 && window.innerWidth <= 2559
                    ? "1.6em"
                    : window.innerWidth >= 800 && window.innerWidth <= 1023
                    ? "0.75em"
                    : window.innerWidth >= 601 && window.innerWidth <= 799
                    ? "0.6em"
                    : "1.3em",
              }}
            />
            <CustomButton
              height={"50%"}
              width={"40%"}
              style={{
                marginLeft: "110%",
                marginTop: "20%",
                position: "absolute",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              clickMethod={() =>
                handlePercentsValue({ target: { value: 0 } }, answer)
              }
            >
              <GrPowerReset />
            </CustomButton>
          </Box>
        );

      case "reponse_double":
        if (booleanAnswerSelected.get(answer))
          return (
            <Box
              width={"100%"}
              height={"100%"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              marginLeft={"25%"}
            >
              <AiFillLike
                color="yellow"
                size={
                  window.innerWidth >= 1024 && window.innerWidth <= 1439
                    ? 25
                    : window.innerWidth >= 1440 && window.innerWidth <= 1910
                    ? 30
                    : window.innerWidth >= 1920
                    ? 40
                    : 15
                }
              />
            </Box>
          );
        else
          return (
            <Box
              width={"100%"}
              height={"100%"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              marginLeft={"25%"}
            >
              <AiFillDislike
                color="yellow"
                size={
                  window.innerWidth >= 1024 && window.innerWidth <= 1439
                    ? 25
                    : window.innerWidth >= 1440 && window.innerWidth <= 1910
                    ? 30
                    : window.innerWidth >= 1920
                    ? 40
                    : 15
                }
              />
            </Box>
          );

      default:
        break;
    }
  };

  const handleSelectedSingleProposition = (selectedProposition) => {
    //If selected again
    if (selectedProposition._id == objectPropositionSelected?._id) {
      setObjectPropositionSelected(null);
    } else {
      setObjectPropositionSelected(selectedProposition);
    }

    if (selectedProposition?.feedback?.text) {
      // If answer selected again
      if (feedback?.content == selectedProposition.feedback.text) {
        setFeedback({
          content: "",
          title: "",
          hasQuestion: false,
          img: "",
        });
        setContainsFeedback(false);
      } else {
        setFeedback({
          content: selectedProposition.feedback.text,
          title: "",
          hasQuestion: selectedProposition?.feedbackHasQuestion,
          img: selectedProposition?.feedback.img,
        });
        setContainsFeedback(true);
      }
    } else setContainsFeedback(false);
  };

  return (
    // Waiting of datas
    stateActs.currentQuestion ? (
      <Box
        width={"100%"}
        height={"100%"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        id={"proposition-container"}
        sx={{
          overflow: "scroll",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Stack
          width={"100%"}
          height={"100%"}
          display={"flex"}
          justifyContent="space-evenly"
          alignItems={"center"}
          flexWrap={
            !stateActs.currentQuestion?.additionalContent.length > 0 && "wrap"
          }
          direction={stateActs.currentQuestion?.directionAnswer}
          useFlexGap
          gap={3}
          // left={
          //   stateActs.currentQuestion?.additionalContent.length > 0 &&
          //   stateActs.currentQuestion?.visual?.boxAnswersImg &&
          //   `${stateActs.currentQuestion?.visual?.boxAnswersImg?.left}%`
          // }
          // top={
          //   stateActs.currentQuestion?.additionalContent.length > 0 &&
          //   stateActs.currentQuestion?.visual?.boxAnswersImg &&
          //   `${stateActs.currentQuestion?.visual?.boxAnswersImg?.top}%`
          // }
          // sx={{
          //   backgroundImage: `url(${PICTURES_DIR}/${stateActs.currentQuestion?.visual?.boxAnswersImg?.img})`,
          //   backgroundSize: "100% 100%",
          //   gap: "1%",
          // }}
        >
          {stateActs.currentQuestion?.answers.map((answer) => (
            <Box
              key={answer._id}
              width={`${
                (answer?.bgImg?.width +
                  (answer?.selectionImg?.img?.width || 0)) *
                100
              }%`}
              height={`${answer?.bgImg?.height * 100}%`}
              display={"flex"}
              flexDirection={
                answer.selectionImg && answer.selectionImg.align == "left"
                  ? "row"
                  : "row-reverse"
              }
              justifyContent={"space-evenly"}
              alignItems={"center"}
              position={
                stateActs?.currentQuestion?.additionalContent.length > 0
                  ? "absolute"
                  : "relative"
              }
              left={
                stateActs?.currentQuestion?.additionalContent.length > 0
                  ? `${answer.bgImg.left}%`
                  : 0
              }
              top={
                stateActs?.currentQuestion?.additionalContent.length > 0
                  ? `${answer.bgImg.top}%`
                  : 0
              }
              zIndex={1}
            >
              {/* Box choice visual/area */}
              {answer.selectionImg && (
                <Box
                  width={`15%`}
                  height={`60%`}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  sx={{
                    backgroundImage: `url(${PICTURES_DIR}/${answer.selectionImg.img.name})`,
                    backgroundSize: "100% 100%",
                    "@media screen and (min-width: 601px) and (max-width: 799px)":
                      {
                        height: "30%",
                      },
                    "@media screen and (min-width: 800px) and (max-width: 1023px)":
                      {
                        height: "35%",
                      },
                    "@media screen and (min-width: 1024px) and (max-width: 1439px)":
                      {
                        height: "40%",
                      },
                    "@media screen and (min-width: 1536px) and (max-width: 1919px)":
                      {
                        height: `40%`,
                      },
                    "@media screen and (min-width: 1920px) and (max-width: 2559px)":
                      {
                        height: `50%`,
                      },
                  }}
                >
                  {contentChoice(answer)}
                </Box>
              )}
              {/* Answer Box */}
              <Box
                width={answer.selectionImg ? `80%` : "100%"}
                height={`100%`}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                onClick={(e) => handleAnswer(e, answer)}
                sx={[
                  {
                    cursor:
                      question.questionType.name != "pourcentage" && "pointer",
                    backgroundImage: `url(${PICTURES_DIR}/${answer?.bgImg?.name})`,
                    backgroundSize: "100% 100%",
                  },
                  (storeAnswer?.find((a) => a._id == answer._id) ||
                    objectPropositionSelected?._id == answer._id) &&
                    selectionEffect(answer),
                ]}
              >
                <DisplayingText
                  marginLeft={`${answer.text?.position?.marginLeft}%`}
                  marginTop={`${answer.text?.position?.marginTop}%`}
                  // Display primary or alternatifText
                  sentence={
                    storeAnswer.find((e) => e._id == answer._id)?.alternatifText
                      ?.content &&
                    !storeAnswer[
                      storeAnswer.findIndex((e) => e._id == answer._id)
                    ]?.alternatifText?.hidden
                      ? answer?.alternatifText?.content
                      : answer.text?.hidden
                      ? ""
                      : answer.text.content
                  }
                  textColor={
                    storeAnswer.find((e) => e._id == answer._id)?.alternatifText
                      ?.content &&
                    !storeAnswer[
                      storeAnswer.findIndex((e) => e._id == answer._id)
                    ]?.alternatifText?.hidden
                      ? answer?.alternatifText?.textColor || "black"
                      : answer.text.textColor
                  }
                  fontWeight={600}
                  textAlign={"center"}
                  // backgroundText={answer.content.text.textBackground}
                  padding={"10%"}
                  level={
                    stateActs?.currentQuestion?.visual?.textAnswerLevel ||
                    "title-md"
                  }
                  id={"answer-proposition-text"}
                  style={{
                    backgroundColor: answer?.text?.textBGColor,
                    "@media screen and (min-width: 1024px) and (max-width: 1439px)":
                      {
                        marginTop: `${answer.text?.position?.marginTop - 5}%`,
                      },
                    "@media screen and (min-width: 1920px) and (max-width: 2559px)":
                      {
                        marginTop: `${answer.text?.position?.marginTop - 3}%`,
                      },
                    "@media screen and (min-width: 800px) and (max-width: 1023px)":
                      {
                        marginTop: `${answer.text?.position?.marginTop - 15}%`,
                      },
                    "@media screen and (min-width: 601px) and (max-width: 799px)":
                      {
                        marginTop: `${answer.text?.position?.marginTop - 25}%`,
                      },
                  }}
                />
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    ) : (
      <Loading />
    )
  );
};

export default Propositions;
