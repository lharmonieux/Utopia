/* eslint-disable react/prop-types */
import * as Joy from "@mui/joy";

const Propositions = ({currentQuestion, handleSelectedProposition}) => {
  return (
    <Joy.Stack
            spacing={2}
            justifyContent="space-evenly"
            flexWrap="wrap"
            useFlexGap
          >
            {currentQuestion?.answers.map((answer) => (
              <Joy.Button
                color="neutral"
                key={answer._id}
                onClick={() => handleSelectedProposition(answer)}
                sx={{ backgroundColor: answer.selected ? "#0EC586" : null }}
              >
                {answer.content}
              </Joy.Button>
            ))}
          </Joy.Stack>
  )
}

export default Propositions