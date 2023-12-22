/* eslint-disable react/prop-types */
import { Stack, Typography, Box } from "@mui/joy";
import "animate.css";
import { colors } from "../utils/colors";
import { useDispatch, useSelector } from "react-redux";
import { updateCharactersSelected } from "../utils/redux/characterSlice";
import { backgroundSize } from "../utils/backgroundSizeProvider";
import { PICTURES_DIR } from "../utils/constants";

const Characters = ({ setObjectCharacterSelected, objectSelectedCharacter }) => {
  const stateCharacters = useSelector((state) => state.character);
  const stateUser = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const domConfig = useSelector((state) => state.dom);

  const handleSelectedCharacter = (selectedCharacter) => {
    if (stateUser.character) {
      //If selected again
      if (selectedCharacter == objectSelectedCharacter) {
        setObjectCharacterSelected(null);
      } else {
        setObjectCharacterSelected(selectedCharacter);
      }

      dispatch(
        updateCharactersSelected({
          characters: stateCharacters.characters,
          selectedCharacter,
        })
      );
    } else {
      //If selected again
      if (selectedCharacter._id == objectSelectedCharacter) {
        setObjectCharacterSelected("");
      } else {
        setObjectCharacterSelected(selectedCharacter._id);
      }

      dispatch(
        updateCharactersSelected({
          characters: stateCharacters.characters,
          selectedCharacter,
        })
      );
    }
  };

  return (
    <Stack
      direction="row"
      height={domConfig.height}
      width={domConfig.width}
      spacing={5}
      sx={{ overflow: "auto", scrollSnapType: "x mandatory" }}
    >
      {/* Carte de personnage  */}
      {stateCharacters.characters?.map((character) => {
        if (stateUser.character != character)
          return (
            <Box
              key={character._id}
              height={parseInt(domConfig.height * 0.65)}
              width={parseInt(domConfig.width * 0.3)}
              onClick={() => {
                handleSelectedCharacter(character);
              }}
              position="relative"
              sx={{
                flex: "none",
                scrollSnapAlign: "start",
                backgroundImage: `url(${PICTURES_DIR}/${character.img})`,
                backgroundSize: backgroundSize(
                  domConfig.width * 0.3,
                  domConfig.height * 0.65
                ),
                border: character.selected ? 3 : 0,
                borderColor: character.selected ? "#0EC586" : "",
                borderRadius: character.selected ? 5 : 0,
                cursor: "pointer",
              }}
              className={`animate__animated animate__bounceIn`}
            >
              {/* Character's name */}
              <Box
                position="absolute"
                right={5}
                top={"34%"}
                width={"70%"}
                height={"13%"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Typography
                  level="h4"
                  textAlign="center"
                  fontWeight={400}
                  textColor={"white"}
                  sx={{ lineHeight: 1 }}
                >
                  {character.name}
                </Typography>
              </Box>

              {/* Character caracteristics title*/}
              <Box position={"absolute"} top={"49%"} width={"85%"}>
                <Typography
                  textAlign={"center"}
                  level={"h4"}
                  textColor={colors.titleBackDark}
                  fontWeight={400}
                >
                  Caractéristiques
                </Typography>
              </Box>

              {/* Character's caracteristics content */}
              <Box position={"absolute"} top={"55%"} width={"85%"}>
                <Typography level={"body-sm"} textColor={"white"} padding={2}>
                  {character.caracteristic}
                </Typography>
              </Box>
            </Box>
          );
      })}
    </Stack>
  );
};

export default Characters;
