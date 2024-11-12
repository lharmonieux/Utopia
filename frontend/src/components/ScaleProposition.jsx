/* eslint-disable react/prop-types */
import { Box, CircularProgress, Slider, Stack, Typography } from "@mui/joy";
import { useSelector } from "react-redux";
import { PICTURES_DIR } from "../utils/constants";

const ScaleProposition = ({ setScaleAnswers, scaleAnswers, question }) => {
  const stateActs = useSelector((state) => state.act);
  // Updating of scales tab
  const handleScaleAnswers = (e, idAnswer) => {
    const newScaleAnswers = new Map(scaleAnswers);
    newScaleAnswers.set(idAnswer, e.target.value);
    setScaleAnswers(newScaleAnswers);
  };

  return stateActs.currentQuestion ? (
    <Stack
      width={"100%"}
      height={`${(1 - question?.backgroundImg?.height) * 100}%`}
      justifyContent="space-evenly"
      flexWrap="wrap"
      direction="row"
      spacing={2}
      useFlexGap
    >
      {stateActs.currentQuestion?.answers?.map((answer) => {
        return (
          <Box
            width={`${answer?.bgImg?.width * 100}%`}
            height={`${answer?.bgImg?.height * 100}%`}
            key={answer._id}
            position={answer.text.position && "absolute"}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              backgroundImage: `url(${PICTURES_DIR}/${answer?.bgImg?.name})`,
              backgroundSize: "100% 100%",
            }}
          >
            <Typography
              fontWeight={400}
              textColor={answer.text.textColor}
              textAlign={"center"}
              level="title-md"
              id={"answer-scale-text"}
            >
              {answer.text.content}
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
  );
};

export default ScaleProposition;
