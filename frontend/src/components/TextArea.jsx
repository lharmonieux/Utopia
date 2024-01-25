/* eslint-disable react/prop-types */
import { Box } from "@mui/joy";
import { useSelector } from "react-redux";
import { PICTURES_DIR } from "../utils/constants.js";
import { backgroundSize } from "../utils/backgroundSizeProvider.js";

const TextArea = ({
  townName,
  setTownName,
  textareaValue,
  setTextareaValue,
  questionContent,
}) => {
  const domConfig = useSelector((state) => state.dom);
  const stateActs = useSelector((state) => state.act);
  const newTextareaValue = new Map(textareaValue);
  //Accept just letters
  const handleKeyDown = (e) => {
    const allowedCharacters = /[A-Za-zÀ-ÿ-' ]/;

    if (!allowedCharacters.test(e.key)) e.preventDefault();
  };

  const handleFormValue = (e) => {
    if (stateActs?.currentQuestion?.answerType?.name == "texte_ville")
      setTownName(e.target.value);
    else {
      newTextareaValue.set(questionContent._id, e.target.value);
      setTextareaValue(newTextareaValue);
    }
  };

  return (
    <Box
      marginBottom={5}
      width={parseInt(
        domConfig.width *
          stateActs.currentQuestion?.visual?.boxAnswersImg?.width
      )}
      height={parseInt(
        domConfig.height *
          stateActs.currentQuestion?.visual?.boxAnswersImg?.height
      )}
      sx={{
        backgroundImage: `url(${PICTURES_DIR}/${stateActs.currentQuestion?.visual?.boxAnswersImg?.img})`,
        backgroundSize: backgroundSize(
          domConfig.width *
            stateActs.currentQuestion?.visual?.boxAnswersImg?.width,
          domConfig.height *
            stateActs.currentQuestion?.visual?.boxAnswersImg?.height
        ),
      }}
    >
      <textarea
        value={
          stateActs?.currentQuestion?.answerType?.name == "texte_ville"
            ? townName
            : textareaValue.get(questionContent)
        }
        onChange={(e) => handleFormValue(e)}
        onKeyDown={(e) =>
          stateActs?.currentQuestion?.answerType?.name == "texte_ville" &&
          handleKeyDown(e)
        }
        style={{
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
