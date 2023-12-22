/* eslint-disable react/prop-types */
import { Box } from "@mui/joy";
import { useSelector } from "react-redux";
import { PICTURES_DIR } from "../utils/constants.js";
import { backgroundSize } from "../utils/backgroundSizeProvider.js";

const TextArea = ({ townName, setTownName }) => {
  const domConfig = useSelector((state) => state.dom);
  const stateActs = useSelector((state) => state.act);
  //Accept just letters
  const handleKeyDown = (e) => {
    const allowedCharacters = /[A-Za-zÀ-ÿ-' ]/;

    if (!allowedCharacters.test(e.key)) e.preventDefault();
  };

  return (
    <Box
      marginBottom={5}
      width={parseInt(domConfig.width * 0.7)}
      height={parseInt(domConfig.height * 0.1)}
      sx={{
        backgroundImage: `url(${PICTURES_DIR}/${stateActs.currentQuestion?.visual?.boxAnswersImg})`,
        backgroundSize: backgroundSize(
          domConfig.width * 0.7,
          domConfig.height * 0.1
        ),
      }}
    >
      <input
        type="text"
        value={townName}
        onChange={(e) => setTownName(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e)}
        style={{
          height: "100%",
          width: "100%",
          border: "none",
          backgroundColor: "transparent",
          outline: "none",
          marginLeft: 10,
          placeholder: "Nom de votre ville...",
        }}
      />
    </Box>
  );
};

export default TextArea;
