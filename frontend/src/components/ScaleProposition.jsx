/* eslint-disable react/prop-types */
import { Box, CircularProgress, Slider, Stack, Typography } from "@mui/joy";
import { useSelector } from "react-redux";
import { backgroundSize } from "../utils/backgroundSizeProvider";
import { PICTURES_DIR } from "../utils/constants";

const ScaleProposition = ({ setScaleAnswers, scaleAnswers }) => {
  const stateActs = useSelector((state) => state.act);
  const domConfig = useSelector((state) => state.dom);

  // Updating of scales tab
  const handleScaleAnswers = (e, idAnswer) => {
    const newScaleAnswers = new Map(scaleAnswers);
    newScaleAnswers.set(idAnswer, e.target.value);
    setScaleAnswers(newScaleAnswers);
  };

  return stateActs.currentQuestion ? (
    <Stack
      justifyContent="space-evenly"
      flexWrap="wrap"
      direction="row"
      marginBottom={5}
      spacing={2}
      useFlexGap
    >
      {stateActs.currentQuestion?.answers?.map((answer) => {
        return (
          <Box
            width={parseInt(domConfig.width * answer?.content?.img?.width)}
            height={parseInt(domConfig.height * answer?.content?.img?.height)}
            key={answer._id}
            position={answer.content.position && "absolute"}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 10,
              backgroundImage: `url(${PICTURES_DIR}/${answer?.content?.img?.name})`,
              backgroundSize: backgroundSize(
                domConfig.width * answer?.content?.img?.width,
                domConfig.height * answer?.content?.img?.height
              ),
            }}
          >
            <Typography
              fontWeight={400}
              textColor={answer.content.textColor}
              marginTop={"30%"}
              textAlign={"center"}
            >
              {answer.content.text.text}
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
