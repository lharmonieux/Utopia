/* eslint-disable react/prop-types */
import {Button, Stack} from "@mui/joy";

const Propositions = ({ currentQuestion, handleSelectedProposition }) => {
  return (
    <Stack
      spacing={2}
      justifyContent="space-evenly"
      flexWrap="wrap"
      direction="row"
      useFlexGap
    >
      {currentQuestion?.answers.map((answer) => (
        <Button
          color="neutral"
          key={answer._id}
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
