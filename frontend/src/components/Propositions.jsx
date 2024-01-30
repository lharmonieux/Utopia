/* eslint-disable react/prop-types */
import { Box, CircularProgress, Stack, Typography } from "@mui/joy";
import { useSelector } from "react-redux";
import { backgroundSize } from "../utils/backgroundSizeProvider";
import { PICTURES_DIR } from "../utils/constants";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { useEffect } from "react";
import DisplayingText from "./DisplayingText";
import { selectionEffect } from "../utils/cssReact";
import { colors } from "../utils/colors";
import { TbArrowBigDownFilled, TbArrowBigUpFilled } from "react-icons/tb";
import ButtonNavScroll from "./ButtonNavScroll";

const Propositions = ({
  handleSelectedProposition,
  orderedAnswer,
  percentAnswers,
  setPercentAnswers,
  questionContent,
}) => {
  const stateActs = useSelector((state) => state.act);
  const domConfig = useSelector((state) => state.dom);
  const [widthBoxAnswer, heightBoxAnswer] = [
    stateActs.currentQuestion?.visual?.boxAnswersImg?.width,
    stateActs.currentQuestion?.visual?.boxAnswersImg?.height,
  ];

  useEffect(() => {
    // Initializing of percent values for propositions
    if (questionContent.answerType.name == "pourcentage") {
      let percentAnswers = new Map();
      for (let answer of stateActs.currentQuestion.answers) {
        percentAnswers.set(answer._id, 0);
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

    //Get all answer where value = 0
    for (let answer of stateActs.currentQuestion.answers) {
      if (answer == selectedAnswer) continue;
      restAnswers.push(answer);
      maxPercentGiven += newPercentAnswers.get(answer._id);
    }

    const answerToUpdate = restAnswers.reduce((acc, curr) => {
      if (newPercentAnswers.get(curr._id) > newPercentAnswers.get(acc._id))
        return curr;
      else return acc;
    }, restAnswers[0]);

    //Control if the new value can pass
    const maxPercentWithAnswer = maxPercentGiven + parseInt(e.target.value);
    if (parseInt(e.target.value) > maxPercent || parseInt(e.target.value) < 0)
      newPercentAnswers.set(
        selectedAnswer._id,
        newPercentAnswers.get(selectedAnswer._id)
      );
    else if (maxPercentWithAnswer > maxPercent) {
      newPercentAnswers.set(selectedAnswer._id, parseInt(e.target.value));

      newPercentAnswers.set(
        answerToUpdate._id,
        newPercentAnswers.get(answerToUpdate._id) -
          (maxPercentWithAnswer - maxPercent)
      );
    } else if (newPercentAnswers.get(answerToUpdate._id) == 0) {
      newPercentAnswers.set(selectedAnswer._id, parseInt(e.target.value));

      newPercentAnswers.set(
        answerToUpdate._id,
        maxPercent - maxPercentWithAnswer
      );
    } else if (maxPercentWithAnswer < maxPercent) {
      newPercentAnswers.set(selectedAnswer._id, parseInt(e.target.value));

      newPercentAnswers.set(
        answerToUpdate._id,
        newPercentAnswers.get(answerToUpdate._id) +
          (maxPercent - maxPercentWithAnswer)
      );
    }

    //Define final answer
    const finalAnswer = stateActs.currentQuestion.answers.reduce(
      (acc, curr) =>
        newPercentAnswers.get(curr._id) > newPercentAnswers.get(acc._id)
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
        return (
          <Typography level="title-lg">
            {orderedAnswer.indexOf(answer._id) + 1 || ""}
          </Typography>
        );

      case "pourcentage":
        return (
          <input
            type="number"
            value={percentAnswers.get(answer._id)}
            onChange={(e) => handlePercentsValue(e, answer)}
            key={`input_${answer._id}`}
            style={{
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              textAlign: "right",
              width: parseInt(domConfig.width * answer?.choiceImg?.img?.width),
              height: parseInt(
                domConfig.height * answer?.choiceImg?.img?.height
              ),
            }}
          />
        );

      case "reponse_double":
        if (answer.selected) return <AiFillLike color="yellow" size={40} />;
        else return <AiFillDislike color="yellow" size={40} />;

      default:
        break;
    }
  };

  return (
    // Waiting of datas
    stateActs.currentQuestion ? (
      <Box
        id="proposition-container"
        width={
          stateActs.currentQuestion?.visual?.boxAnswersImg &&
          parseInt(widthBoxAnswer * domConfig.width)
        }
        height={
          stateActs.currentQuestion?.visual?.boxAnswersImg
            ? parseInt(heightBoxAnswer * domConfig.height)
            : stateActs.currentQuestion?.visual?.directionAnswer == "row"
            ? parseInt(
                domConfig.height * (1 - questionContent?.backgroundImg?.height)
              )
            : parseInt(domConfig.height * 0.9)
        }
        display={"flex"}
        justifyContent={"center"}
        sx={{
          overflow: "scroll",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {" "}
        <Stack
          display={"flex"}
          justifyContent="space-evenly"
          alignItems={"center"}
          flexWrap={
            !stateActs.currentQuestion?.additionalContent.length > 0 && "wrap"
          }
          direction={stateActs.currentQuestion?.visual?.directionAnswer}
          spacing={!stateActs.currentQuestion?.visual?.boxAnswersImg ? 1 : 0}
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
            backgroundSize: backgroundSize(
              domConfig.width * widthBoxAnswer,
              domConfig.height * heightBoxAnswer
            ),
            // overflow: "scroll",
            // scrollbarWidth: "none",
            // msOverflowStyle: "none",
            // "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {stateActs.currentQuestion?.answers.map((answer) => (
            <Box
              key={answer._id}
              width={parseInt(
                domConfig.width *
                  (answer?.content?.img?.width +
                    (answer?.choiceImg ? answer?.choiceImg?.img?.width : 0))
              )}
              height={parseInt(domConfig.height * answer?.content?.img?.height)}
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
                  width={parseInt(
                    domConfig.width * answer?.choiceImg?.img?.width
                  )}
                  height={parseInt(
                    domConfig.height * answer?.choiceImg?.img?.height
                  )}
                  // position={"absolute"}
                  // left={answer.choiceImg.align == "left" ? 0 : "90%"}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  sx={{
                    backgroundImage: `url(${PICTURES_DIR}/${answer.choiceImg.img.name})`,
                    backgroundSize: backgroundSize(
                      domConfig.width * answer?.choiceImg?.img?.width,
                      domConfig.height * answer?.choiceImg?.img?.height
                    ),
                  }}
                >
                  {contentChoice(answer)}
                </Box>
              )}
              {/* Answer Box */}
              <Box
                width={parseInt(domConfig.width * answer?.content?.img?.width)}
                height={parseInt(
                  domConfig.height * answer?.content?.img?.height
                )}
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
                    backgroundSize: backgroundSize(
                      domConfig.width * answer?.content?.img?.width,
                      domConfig.height * answer?.content?.img?.height
                    ),
                  },
                  selectionEffect(answer),
                ]}
              >
                {/* Display text if it isn't hidden */}
                {!answer.content.text.hiddenText && (
                  <DisplayingText
                    marginLeft={`${answer.content.text.position?.marginLeft}%`}
                    marginTop={`${answer.content.text.position?.marginTop}%`}
                    padding={2}
                    sentence={answer.content.text.text}
                    textColor={answer.content.textColor}
                    fontWeight={400}
                    textAlign={"center"}
                    level={
                      stateActs?.currentQuestion?.visual?.textAnswerLevel ||
                      "title-sm"
                    }
                  />
                )}

                {/* Display second text on selection */}
                {answer.content.text.secondText && answer.selected && (
                  <DisplayingText
                    sentence={answer?.content?.text?.secondText}
                    level={"title-lg"}
                    textColor={colors.titleBackLight}
                    textAlign={"center"}
                  />
                )}
              </Box>
            </Box>
          ))}

          {/* additionnal content  */}
          {stateActs.currentQuestion.additionalContent.length > 0 &&
            stateActs.currentQuestion.additionalContent.map((element) => (
              <Box
                key={element._id}
                position={"absolute"}
                width={parseInt(domConfig.width * element.scale.width)}
                height={parseInt(domConfig.height * element.scale.height)}
                top={`${element.position.top}%`}
                left={`${element.position.left}%`}
                display={"flex"}
                // justifyContent={"center"}
                alignItems={"center"}
                sx={{
                  backgroundImage: `url(${PICTURES_DIR}/${element.img})`,
                  backgroundSize: backgroundSize(
                    domConfig.width * element.scale.width,
                    domConfig.height * element.scale.height
                  ),
                  // opacity: 0.2,
                }}
              >
                <Typography
                  level={element?.textLevel || "title-sm"}
                  textAlign={"center"}
                  sx={{
                    color: element?.textColor || "black",
                  }}
                >
                  <DisplayingText sentence={element.text} animated={false} />
                </Typography>{" "}
              </Box>
            ))}
        </Stack>
        <ButtonNavScroll
          id="up-nav-button"
          color="warning"
          directionScroll={-1}
          left={-7}
          top={45}
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
          left={-7}
          top={60}
          height={0.1}
          idContainer={"proposition-container"}
          widthMove={200}
          alignMvnt={"column"}
        >
          <TbArrowBigDownFilled />
        </ButtonNavScroll>
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
