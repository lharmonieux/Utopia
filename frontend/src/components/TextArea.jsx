/* eslint-disable react/prop-types */
import { Box, CircularProgress, Input } from "@mui/joy";

const TextArea = ({
  townName,
  setTownName,
  widthMainContent,
  heightMainContent,
}) => {
  //Accept just letters
  const handleKeyDown = (e) => {
    const allowedCharacters = /[A-Za-zÀ-ÿ-' ]/;

    if (!allowedCharacters.test(e.key)) e.preventDefault();
  };

  return heightMainContent && widthMainContent ? (
    <Box
      marginBottom={5}
      width={parseInt(widthMainContent * 0.7)}
      height={parseInt(heightMainContent * 0.1)}
    >
      <Input
        placeholder="Nom de votre ville..."
        value={townName}
        onChange={(e) => setTownName(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e)}
      />
    </Box>
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

export default TextArea;
