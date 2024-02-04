/* eslint-disable react/prop-types */
import { Box } from "@mui/joy";
import { useSelector } from "react-redux";
import { PICTURES_DIR } from "../utils/constants.js";
import { textAreaStyle } from "../utils/cssReact.js";

const TextArea = ({ textareaValue, setTextareaValue, questionContent }) => {
  const domConfig = useSelector((state) => state.dom);
  const newTextareaValue = new Map(textareaValue);
  //Accept just letters
  const handleKeyDown = (e) => {
    const allowedCharacters = /[A-Za-zÀ-ÿ-' ]/;

    if (!allowedCharacters.test(e.key)) e.preventDefault();
  };

  const handleFormValue = (e) => {
    newTextareaValue.set(questionContent.text, {
      answerText: e.target.value,
      answerType: questionContent.answerType.name,
    });
    setTextareaValue(newTextareaValue);
  };

  return (
    <Box
      width={parseInt(domConfig.width * questionContent?.textArea?.width)}
      height={parseInt(domConfig.height * questionContent?.textArea?.height)}
      sx={{
        backgroundImage: `url(${PICTURES_DIR}/${questionContent?.textArea?.img})`,
        backgroundSize: "100% 100%",
      }}
    >
      <textarea
        value={textareaValue.get(questionContent.text)?.answerText}
        onChange={(e) => handleFormValue(e)}
        onKeyDown={(e) =>
          questionContent.answerType?.name == "texte_ville" && handleKeyDown(e)
        }
        style={textAreaStyle}
      />
    </Box>
  );
};

export default TextArea;
