/* eslint-disable react/prop-types */
import { Box, CircularProgress, Slider, Stack, Typography } from "@mui/joy";
import { useEffect, useState } from "react";
import cloudinary from "../utils/cloudinary";
import { scale } from "@cloudinary/url-gen/actions/resize";

const ScaleProposition = ({
  currentQuestion,
  setScaleAnswers,
  widthMainContent,
  heightMainContent,
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

  // Updating of scales tab
  const handleScaleAnswers = (e, idAnswer) => {
    setScaleAnswers((scaleAnswers) =>
      scaleAnswers.set(idAnswer, e.target.value)
    );
  };

  return heightMainContent && widthMainContent ? (
    currentQuestion &&
    answerImg?.resize(
      scale()
        .width(parseInt(widthMainContent * 0.2))
        .height(parseInt(heightMainContent * 0.3))
    ) ? (
      <Stack
        justifyContent="space-evenly"
        flexWrap="wrap"
        direction="row"
        marginBottom={5}
        spacing={2}
        useFlexGap
      >
        {currentQuestion?.answers.map((answer) => {
          return (
            <Box
            width={parseInt(widthMainContent * 0.2)}
            height={parseInt(heightMainContent * 0.3)}
              key={answer._id}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: 'center',
                borderRadius: 10,
                backgroundImage: `url(${answerImg.toURL()})`
              }}
            >
              <Typography fontWeight={400} textColor={"white"} marginTop={"40%"}>
                {answer.content}
              </Typography>
              <Slider
                defaultValue={1}
                min={1}
                max={10}
                valueLabelDisplay="auto"
                onChange={(e) => handleScaleAnswers(e, answer._id)}
                color="warning"
              />
            </Box>
          );
        })}
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

export default ScaleProposition;
