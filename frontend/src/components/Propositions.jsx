/* eslint-disable react/prop-types */
import { Box, CircularProgress, Stack, Typography } from "@mui/joy";
import { colors } from "../utils/colors";
import { useSelector } from "react-redux";
import { backgroundSize } from "../utils/backgroundSizeProvider";
import { PICTURES_DIR } from "../utils/constants";
import { ImCross } from "react-icons/im";

const Propositions = ({ handleSelectedProposition }) => {
  const stateActs = useSelector((state) => state.act);
  const domConfig = useSelector((state) => state.dom);
  const [widthBoxAnswer, heightBoxAnswer] = [
    parseInt(stateActs.currentQuestion?.visual?.boxAnswersImg.width),
    parseInt(stateActs.currentQuestion?.visual?.boxAnswersImg.height),
  ];

  const contentChoice = (answer) => {
    switch (stateActs.currentQuestion.answerType) {
      case "proposition_multiple":
        if (answer.selected) return <ImCross />;

        break;

      default:
        break;
    }
  };

  return (
    // Waiting of datas
    stateActs.currentQuestion ? (
      <Stack
        justifyContent="space-evenly"
        flexWrap={!stateActs.currentQuestion?.visual?.boxAnswersImg && "wrap"}
        direction={
          !stateActs.currentQuestion?.visual?.boxAnswersImg &&
          stateActs.currentQuestion?.visual?.directionAnswer
        }
        spacing={!stateActs.currentQuestion?.visual?.boxAnswersImg && 2}
        useFlexGap
        position={
          stateActs.currentQuestion?.visual?.boxAnswersImg && "absolute"
        }
        left={
          stateActs.currentQuestion?.visual?.boxAnswersImg &&
          `${stateActs.currentQuestion?.visual?.boxAnswersImg.left}%`
        }
        top={
          stateActs.currentQuestion?.visual?.boxAnswersImg &&
          `${stateActs.currentQuestion?.visual?.boxAnswersImg.top}%`
        }
        width={
          stateActs.currentQuestion?.visual?.boxAnswersImg
            ? `${widthBoxAnswer}%`
            : stateActs.currentQuestion?.visual?.directionAnswer == "row"
            ? "100%"
            : "45%"
        }
        height={
          stateActs.currentQuestion?.visual?.boxAnswersImg
            ? `${heightBoxAnswer}%`
            : stateActs.currentQuestion?.visual?.directionAnswer == "row"
            ? "70%"
            : "60%"
        }
        sx={{
          backgroundImage: `url(${PICTURES_DIR}/${stateActs.currentQuestion?.visual?.boxAnswersImg.img})`,
          backgroundSize: backgroundSize(
            (domConfig.width * widthBoxAnswer) / 100,
            (domConfig.height * heightBoxAnswer) / 100
          ),
        }}
      >
        {stateActs.currentQuestion?.answers.map((answer) => (
          <Box
            key={answer._id}
            width={
              !answer.content.position
                ? stateActs.currentQuestion?.visual?.directionAnswer == "column"
                  ? parseInt(domConfig.width * 0.45)
                  : parseInt(domConfig.width * 0.3)
                : parseInt(
                    domConfig.width *
                      (widthBoxAnswer / 100) *
                      (parseInt(answer.content.position.width) / 100)
                  )
            }
            height={
              !answer.content.position
                ? stateActs.currentQuestion?.visual?.directionAnswer == "column"
                  ? parseInt(domConfig.height * 0.05)
                  : parseInt(domConfig.height * 0.4)
                : parseInt(
                    domConfig.height *
                      (heightBoxAnswer / 100) *
                      (parseInt(answer.content.position.height) / 100)
                  )
            }
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            position={answer.content.position ? "absolute" : "relative"}
            left={answer.content.position && `${answer.content.position.left}%`}
            top={answer.content.position && `${answer.content.position.top}%`}
          >
            {/* Box choice visual/area */}
            {answer.choiceImg && (
              <Box
                width={parseInt(domConfig.width * 0.05)}
                height={parseInt(domConfig.height * 0.05)}
                position={"absolute"}
                left={answer.choiceImg.align == "left" ? 0 : "88%"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                sx={{
                  backgroundImage: `url(${PICTURES_DIR}/${answer.choiceImg.img})`,
                  backgroundSize: backgroundSize(
                    domConfig.width * 0.05,
                    domConfig.height * 0.05
                  ),
                }}
              >
                {contentChoice(answer)}
              </Box>
            )}
            {/* Answer Box */}
            <Box
              width={
                !answer.content.position
                  ? stateActs.currentQuestion?.visual?.directionAnswer ==
                    "column"
                    ? parseInt(domConfig.width * 0.4)
                    : parseInt(domConfig.width * 0.3)
                  : "100%"
              }
              height={
                !answer.content.position
                  ? stateActs.currentQuestion?.visual?.directionAnswer ==
                    "column"
                    ? parseInt(domConfig.height * 0.05)
                    : parseInt(domConfig.height * 0.4)
                  : "100%"
              }
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              position={answer.choiceImg && "absolute"}
              left={
                answer.choiceImg && answer.choiceImg.align == "left" ? "12%" : 0
              }
              onClick={() =>
                handleSelectedProposition(
                  answer,
                  stateActs.currentQuestion?.answerType,
                  ""
                )
              }
              sx={{
                cursor: "pointer",
                backgroundImage: `url(${PICTURES_DIR}/${answer.img})`,
                backgroundSize: !answer.content.position
                  ? stateActs.currentQuestion?.visual?.directionAnswer ==
                    "column"
                    ? backgroundSize(
                        domConfig.width * 0.4,
                        domConfig.height * 0.05
                      )
                    : backgroundSize(
                        domConfig.width * 0.3,
                        domConfig.height * 0.4
                      )
                  : backgroundSize(
                      parseInt(domConfig.width * (widthBoxAnswer / 100) * 0.6),
                      parseInt(domConfig.height * (heightBoxAnswer / 100) * 0.2)
                    ),
                border: !answer.choiceImg && answer?.selected && 2,
                borderColor:
                  !answer.choiceImg && answer?.selected && colors.borderDescMap,
              }}
            >
              <Typography
                textColor={answer.content.textColor}
                fontWeight={400}
                padding={2}
                textAlign={"center"}
                level="title-xs"
              >
                {answer.content.text.text}
              </Typography>
            </Box>
          </Box>
        ))}

        {/* additionnal content  */}
        {stateActs.currentQuestion.additionalContent && (
          <Box
            position={"absolute"}
            width={parseInt(
              (domConfig.width *
                parseInt(
                  stateActs.currentQuestion.additionalContent.scale.width
                )) /
                100
            )}
            height={parseInt(
              (domConfig.height *
                parseInt(
                  stateActs.currentQuestion.additionalContent.scale.height
                )) /
                100
            )}
            top={`${stateActs.currentQuestion.additionalContent.position.top}%`}
            left={`${stateActs.currentQuestion.additionalContent.position.left}%`}
            display={"flex"}
            // justifyContent={"center"}
            alignItems={"center"}
            sx={{
              backgroundImage: `url(${PICTURES_DIR}/${stateActs.currentQuestion.additionalContent.img})`,
              backgroundSize: backgroundSize(
                (domConfig.width *
                  parseInt(
                    stateActs.currentQuestion.additionalContent.scale.width
                  )) /
                  100,
                (domConfig.height *
                  parseInt(
                    stateActs.currentQuestion.additionalContent.scale.height
                  )) /
                  100
              ),
            }}
          >
            <Typography level="title-xs" textAlign={"center"}>
              {stateActs.currentQuestion.additionalContent.text}
            </Typography>{" "}
          </Box>
        )}
      </Stack>
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
