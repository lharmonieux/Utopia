/* eslint-disable react/prop-types */
import { Stack, Typography, Box } from "@mui/joy";
import { TbArrowBigRightFilled, TbArrowBigLeftFilled } from "react-icons/tb";
import "animate.css";
import { colors } from "../utils/colors";
import { useDispatch, useSelector } from "react-redux";
import { updateCharactersSelected } from "../utils/redux/characterSlice";
import { backgroundSize } from "../utils/backgroundSizeProvider";
import { PICTURES_DIR } from "../utils/constants";
import { selectionEffect } from "../utils/cssReact";
import ButtonNavScroll from "./ButtonNavScroll";

const Characters = ({
  setObjectCharacterSelected,
  objectSelectedCharacter,
  questionContent,
}) => {
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
    }
  };

  return (
    <Box
      height={parseInt(
        domConfig.height *
          0.95 *
          (0.95 - questionContent?.backgroundImg?.height)
      )}
      width={domConfig.width}
      // sx={{ overflow: "hidden" }}
    >
      <Stack
        id="character-container"
        direction="row"
        spacing={5}
        sx={{
          overflow: "scroll",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": { display: "none" },
          transition: "transform 1s ease",
        }}
      >
        {/* Carte de personnage  */}
        {stateCharacters.characters?.map((character) => {
          if (stateUser.character?._id != character?._id)
            return (
              <Box
                key={character._id}
                height={parseInt(domConfig.height * character.height)}
                width={parseInt(domConfig.width * character.width)}
                onClick={() => {
                  handleSelectedCharacter(character);
                }}
                position="relative"
                zIndex={2}
                sx={[
                  {
                    flex: "none",
                    scrollSnapAlign: "start",
                    backgroundImage: `url(${PICTURES_DIR}/${character.img})`,
                    backgroundSize: backgroundSize(
                      domConfig.width * character.width,
                      domConfig.height * character.height
                    ),
                    cursor: "pointer",
                  },
                  selectionEffect(character),
                ]}
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

      <ButtonNavScroll
        id="left-nav-button"
        left={-7}
        top={40}
        height={0.3}
        directionScroll={-1}
        color="warning"
        idContainer={"character-container"}
        widthMove={200}
        alignMvnt={"row"}
      >
        <TbArrowBigLeftFilled />
      </ButtonNavScroll>
      <ButtonNavScroll
        id="right-nav-button"
        left={100}
        top={40}
        height={0.3}
        directionScroll={1}
        color="warning"
        idContainer={"character-container"}
        widthMove={200}
        alignMvnt={"row"}
      >
        <TbArrowBigRightFilled />
      </ButtonNavScroll>
    </Box>
  );
};

export default Characters;
