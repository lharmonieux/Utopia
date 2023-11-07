/* eslint-disable react/prop-types */
import { Sheet, Slider, Stack, Typography } from "@mui/joy";

const ScaleProposition = ({
  currentQuestion,
  setScaleAnswers,
}) => {
  // Updating of scales tab
  const handleScaleAnswers = (e, idAnswer) => {
    setScaleAnswers((scaleAnswers) =>
      scaleAnswers.set(idAnswer, e.target.value)
    );
  };

  return (
    <Stack
      justifyContent="space-evenly"
      flexWrap="wrap"
      direction="row"
      spacing={2}
      useFlexGap
    >
      {currentQuestion?.answers.map((answer) => {
        return (
          <Sheet
            key={answer._id}
            variant="outlined"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: 5,
              borderRadius: 10,
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>
              {answer.content}
            </Typography>
            <Slider
              defaultValue={1}
              min={1}
              max={10}
              valueLabelDisplay="auto"
              onChange={(e) => handleScaleAnswers(e, answer._id)}
            />
          </Sheet>
        );
      })}
    </Stack>
  );
};

export default ScaleProposition;
