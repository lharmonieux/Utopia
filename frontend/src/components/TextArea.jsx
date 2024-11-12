/* eslint-disable react/prop-types */
import { Box } from "@mui/joy";
import { PICTURES_DIR } from "../utils/constants.js";
import { textAreaStyle } from "../utils/cssReact.js";

const TextArea = ({ textareaValue, setTextareaValue, question }) => {
  const newTextareaValue = new Map(textareaValue);
  //Accept just letters
  const handleKeyDown = (e) => {
    const allowedCharacters = /[A-Za-zÀ-ÿ-' ]/;

    if (!allowedCharacters.test(e.key)) e.preventDefault();
  };

  const handleFormValue = (e) => {
    newTextareaValue.set(question.text.content, {
      answerText: e.target.value,
      questionType: question.questionType.name,
    });
    setTextareaValue(newTextareaValue);
  };

  return (
    <Box
      width={"100%"}
      height={"100%"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Box
        width={`${question?.textArea?.width * 100}%`}
        height={`${question?.textArea?.height * 100}%`}
        sx={{
          backgroundImage: `url(${PICTURES_DIR}/${question?.textArea?.img})`,
          backgroundSize: "100% 100%",
        }}
      >
        <textarea
          value={textareaValue.get(question?.text.content)?.answerText}
          onChange={(e) => handleFormValue(e)}
          onKeyDown={(e) =>
            question?.questionType?.name == "texte_ville" &&
            handleKeyDown(e)
          }
          style={textAreaStyle}
        />
      </Box>
    </Box>
  );
};

export default TextArea;
