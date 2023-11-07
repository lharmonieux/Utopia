/* eslint-disable react/prop-types */
import { Button, Stack } from "@mui/joy";

const Propositions = ({ currentQuestion, handleSelectedProposition }) => {
  return (
    <Stack
      justifyContent="space-evenly"
      flexWrap="wrap"
      direction="row"
      spacing={2}
      useFlexGap
    >
      {currentQuestion?.answers.map((answer) => (
        <Button
          key={answer._id}
          color="neutral"
          onClick={() =>
            handleSelectedProposition(answer, currentQuestion?.answerType)
          }
          sx={{
            backgroundColor: answer.selected ? "#0EC586" : null,
            width: "30%",
          }}
        >
          {answer.content}
        </Button>
      ))}
    </Stack>
  );
};

export default Propositions;
