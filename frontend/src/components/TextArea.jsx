/* eslint-disable react/prop-types */
import { Box } from "@mui/joy";
import { useSelector } from "react-redux";
import { PICTURES_DIR } from "../utils/constants.js";
import { backgroundSize } from "../utils/backgroundSizeProvider.js";

const TextArea = ({ textareaValue, setTextareaValue, questionContent }) => {
  const domConfig = useSelector((state) => state.dom);
  const newTextareaValue = new Map(textareaValue);
  //Accept just letters
  const handleKeyDown = (e) => {
    const allowedCharacters = /[A-Za-zÀ-ÿ-' ]/;

    if (!allowedCharacters.test(e.key)) e.preventDefault();
  };

  const handleFormValue = (e) => {
    newTextareaValue.set(questionContent._id, e.target.value);
    setTextareaValue(newTextareaValue);
  };

  return (
    <Box
      width={parseInt(domConfig.width * questionContent?.textArea?.width)}
      height={parseInt(domConfig.height * questionContent?.textArea?.height)}
      sx={{
        backgroundImage: `url(${PICTURES_DIR}/${questionContent?.textArea?.img})`,
        backgroundSize: backgroundSize(
          domConfig.width * questionContent?.textArea?.width,
          domConfig.height * questionContent?.textArea?.height
        ),
      }}
    >
      <textarea
        value={textareaValue.get(questionContent)}
        onChange={(e) => handleFormValue(e)}
        onKeyDown={(e) =>
          questionContent.answerType?.name == "texte_ville" && handleKeyDown(e)
        }
        style={{
          padding: 5,
          height: "100%",
          width: "100%",
          border: "none",
          backgroundColor: "transparent",
          outline: "none",
          marginLeft: 10,
        }}
      />
    </Box>
  );
};

export default TextArea;
