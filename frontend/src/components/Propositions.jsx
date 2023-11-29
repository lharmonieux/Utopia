/* eslint-disable react/prop-types */
import { Box, CircularProgress, Stack, Typography } from "@mui/joy";
import { useEffect, useState } from "react";
import cloudinary from "../utils/cloudinary";
import { scale } from "@cloudinary/url-gen/actions/resize";
import { colors } from "../utils/colors";

const Propositions = ({
  currentQuestion,
  handleSelectedProposition,
  heightMainContent,
  widthMainContent,
}) => {
  const [answerImg, setAnswerImg] = useState();

  useEffect(() => {
    setAnswerImg(
      cloudinary
        .image(`exploria/${currentQuestion?.visual?.answerImg}`)
        .quality("auto:best")
        .format("png")
    );
  }, [currentQuestion]);

  return heightMainContent && widthMainContent ? (
    // Waiting of datas
    currentQuestion &&
    answerImg &&
    answerImg.resize(
      scale()
        .width(
          currentQuestion?.visual?.directionAnswer == "column"
            ? parseInt(widthMainContent * 0.4)
            : parseInt(widthMainContent * 0.3)
        )
        .height(
          currentQuestion?.visual?.directionAnswer == "column"
            ? parseInt(heightMainContent * 0.05)
            : parseInt(heightMainContent * 0.4)
        )
    ) ? (
      <Stack
        justifyContent="space-evenly"
        flexWrap="wrap"
        direction={currentQuestion?.visual?.directionAnswer}
        spacing={2}
        useFlexGap
      >
        {currentQuestion?.answers.map((answer) => (
          <Box
            width={
              currentQuestion?.visual?.directionAnswer == "column"
                ? parseInt(widthMainContent * 0.4)
                : parseInt(widthMainContent * 0.3)
            }
            height={
              currentQuestion?.visual?.directionAnswer == "column"
                ? parseInt(heightMainContent * 0.05)
                : parseInt(heightMainContent * 0.4)
            }
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            key={answer._id}
            onClick={() =>
              handleSelectedProposition(answer, currentQuestion?.answerType, "")
            }
            sx={{
              cursor: "pointer",
              backgroundImage: `url(${answerImg.toURL()})`,
              border: answer?.selected && 2,
              borderColor: answer?.selected && colors.borderDescMap,
            }}
          >
            <Typography
              textColor={answer.content.textColor}
              fontWeight={400}
              padding={2}
              textAlign={"center"}
            >
              {answer.content.text}
            </Typography>
          </Box>
        ))}
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

export default Propositions;
