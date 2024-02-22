/* eslint-disable react/prop-types */
import { Box, CircularProgress, Stack, Typography } from "@mui/joy";
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

const Propositions = ({
  handleSelectedProposition,
  orderedAnswer,
  percentAnswers,
  setPercentAnswers,
  questionContent,
}) => {
  const stateActs = useSelector((state) => state.act);

  useEffect(() => {
    // Initializing of percent values for propositions
    if (questionContent.answerType.name == "pourcentage") {
      let percentAnswers = new Map();
      for (let answer of stateActs.currentQuestion.answers) {
        percentAnswers.set(answer.content.text.text, 0);
      }
      setPercentAnswers(percentAnswers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePercentsValue = (e, selectedAnswer) => {
    const newPercentAnswers = new Map(percentAnswers);
    let maxPercentGiven = 0;
    let maxPercent = 100;
    let restAnswers = [];
    let givenValue = 0;

    // If last value was 0, replace this value automacatily by the new one
    if (newPercentAnswers.get(selectedAnswer.content.text.text) == 0) {
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
      maxPercentGiven += newPercentAnswers.get(answer.content.text.text);
    }

    //Sort all values that exist in order
    restAnswers.sort(
      (a, b) =>
        newPercentAnswers.get(b.content.text.text) -
        newPercentAnswers.get(a.content.text.text)
    );

    //Control if the new value can pass
    const maxPercentWithAnswer = maxPercentGiven + parseInt(givenValue);
    if (parseInt(givenValue) > maxPercent || parseInt(givenValue) < 0)
      newPercentAnswers.set(
        selectedAnswer.content.text.text,
        newPercentAnswers.get(selectedAnswer.content.text.text)
      );
    else if (maxPercentWithAnswer > maxPercent) {
      newPercentAnswers.set(
        selectedAnswer.content.text.text,
        parseInt(givenValue)
      );

      //Distribution off values for avoid negatives possibilities
      const valToDeduce = maxPercentWithAnswer - maxPercent;
      let firstNewPercent = 0;
      let secondNewPercent = 0;
      if (
        newPercentAnswers.get(restAnswers[0].content.text.text) < valToDeduce
      ) {
        secondNewPercent =
          newPercentAnswers.get(restAnswers[1].content.text.text) -
          parseInt(
            valToDeduce -
              newPercentAnswers.get(restAnswers[0].content.text.text)
          );
      } else {
        firstNewPercent = parseInt(
          newPercentAnswers.get(restAnswers[0].content.text.text) - valToDeduce
        );
      }

      newPercentAnswers.set(restAnswers[0].content.text.text, firstNewPercent);
      secondNewPercent &&
        newPercentAnswers.set(
          restAnswers[1].content.text.text,
          secondNewPercent
        );
    } else if (newPercentAnswers.get(restAnswers[0].content.text.text) == 0) {
      newPercentAnswers.set(
        selectedAnswer.content.text.text,
        parseInt(givenValue)
      );

      newPercentAnswers.set(
        restAnswers[0].content.text.text,
        maxPercent - maxPercentWithAnswer
      );
    } else if (maxPercentWithAnswer < maxPercent) {
      newPercentAnswers.set(
        selectedAnswer.content.text.text,
        parseInt(givenValue)
      );

      newPercentAnswers.set(
        restAnswers[0].content.text.text,
        newPercentAnswers.get(restAnswers[0].content.text.text) +
          (maxPercent - maxPercentWithAnswer)
      );
    }

    //Define final answer
    const finalAnswer = stateActs.currentQuestion.answers.reduce(
      (acc, curr) =>
        newPercentAnswers.get(curr.content.text.text) >
        newPercentAnswers.get(acc.content.text.text)
          ? curr
          : acc,
      stateActs.currentQuestion.answers[0]
    );

    handleSelectedProposition(finalAnswer, questionContent.answerType.name, "");

    setPercentAnswers(newPercentAnswers);
  };

  const contentChoice = (answer) => {
    switch (questionContent.answerType.name) {
      case "proposition_multiple":
        if (answer.selected)
          return <IoIosCheckmarkCircle color="green" size={25} />;
        break;

      case "classement":
      case "classement_symbol":
        return (
          <Typography level="title-lg">
            {orderedAnswer.indexOf(answer._id) + 1 || ""}
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
              value={percentAnswers.get(answer.content.text.text) || 0}
              onChange={(e) => handlePercentsValue(e, answer)}
              key={`input_${answer._id}`}
              style={{
                border: "none",
                outline: "none",
                backgroundColor: "transparent",
                textAlign: "center",
                width: "90%",
                height: "100%",
                fontSize:
                  window.innerWidth >= 1440 && window.innerWidth <= 2559
                    ? "1.1em"
                    : "0.9em",
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
        if (answer.selected)
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
                    : window.innerWidth >= 1920
                    ? 40
                    : 30
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
                    : window.innerWidth >= 1920
                    ? 40
                    : 30
                }
              />
            </Box>
          );

      default:
        break;
    }
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
            direction={stateActs.currentQuestion?.visual?.directionAnswer}
            useFlexGap
            left={
              stateActs.currentQuestion?.additionalContent.length > 0 &&
              stateActs.currentQuestion?.visual?.boxAnswersImg &&
              `${stateActs.currentQuestion?.visual?.boxAnswersImg?.left}%`
            }
            top={
              stateActs.currentQuestion?.additionalContent.length > 0 &&
              stateActs.currentQuestion?.visual?.boxAnswersImg &&
              `${stateActs.currentQuestion?.visual?.boxAnswersImg?.top}%`
            }
            sx={{
              backgroundImage: `url(${PICTURES_DIR}/${stateActs.currentQuestion?.visual?.boxAnswersImg?.img})`,
              backgroundSize: "100% 100%",
              gap: "1%",
            }}
          >
            {stateActs.currentQuestion?.answers.map((answer) => (
              <Box
                key={answer._id}
                width={`${
                  (answer?.content?.img?.width +
                    (answer?.choiceImg?.img?.width || 0)) *
                  100
                }%`}
                height={`${answer?.content?.img?.height * 100}%`}
                display={"flex"}
                flexDirection={
                  answer.choiceImg && answer.choiceImg.align == "left"
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
                    ? `${answer.content.img.left}%`
                    : 0
                }
                top={
                  stateActs?.currentQuestion?.additionalContent.length > 0
                    ? `${answer.content.img.top}%`
                    : 0
                }
                zIndex={1}
              >
                {/* Box choice visual/area */}
                {answer.choiceImg && (
                  <Box
                    width={`15%`}
                    height={`60%`}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    sx={{
                      backgroundImage: `url(${PICTURES_DIR}/${answer.choiceImg.img.name})`,
                      backgroundSize: "100% 100%",
                      "@media screen and (min-width: 1024px) and (max-width: 1439px) and (min-height: 858px)":
                        {
                          height: "45%",
                        },
                      "@media screen and (min-width: 1024px) and (max-width: 1439px) and (min-height: 578px) and (max-height: 857px)":
                        {
                          height: "45%",
                        },
                    }}
                  >
                    {contentChoice(answer)}
                  </Box>
                )}
                {/* Answer Box */}
                <Box
                  width={answer.choiceImg ? `80%` : "100%"}
                  height={`100%`}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  onClick={() =>
                    questionContent.answerType.name != "pourcentage" &&
                    handleSelectedProposition(
                      answer,
                      questionContent?.answerType?.name,
                      ""
                    )
                  }
                  sx={[
                    {
                      cursor:
                        questionContent.answerType.name != "pourcentage" &&
                        "pointer",
                      backgroundImage: `url(${PICTURES_DIR}/${answer?.content?.img?.name})`,
                      backgroundSize: "100% 100%",
                    },
                    selectionEffect(answer),
                  ]}
                >
                  {/* Display text if it isn't hidden */}
                  {!answer.content.text.hiddenText && (
                    <DisplayingText
                      marginLeft={`${answer.content.text.position?.marginLeft}%`}
                      marginTop={`${answer.content.text.position?.marginTop}%`}
                      sentence={answer.content.text.text}
                      textColor={answer.content.textColor}
                      fontWeight={600}
                      textAlign={"center"}
                      backgroundText={answer.content.text.textBackground}
                      padding={"5%"}
                      level={
                        stateActs?.currentQuestion?.visual?.textAnswerLevel ||
                        "title-md"
                      }
                      id={"answer-proposition-text"}
                    />
                  )}

                  {/* Display second text on selection */}
                  {answer.content.text.secondText && answer.selected && (
                    <DisplayingText
                      sentence={answer?.content?.text?.secondText}
                      level={"title-lg"}
                      textColor={
                        answer?.content?.text?.secondTextColor || "black"
                      }
                      textAlign={"center"}
                      padding={"30%"}
                    />
                  )}
                </Box>
              </Box>
            ))}
          </Stack>
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
  );
};

export default Propositions;
