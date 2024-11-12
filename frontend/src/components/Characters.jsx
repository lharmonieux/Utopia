/* eslint-disable react/prop-types */
import { Stack, Typography, Box } from "@mui/joy";
import { TbArrowBigRightFilled, TbArrowBigLeftFilled } from "react-icons/tb";
import { colors } from "../utils/colors";
import { useSelector } from "react-redux";
import { PICTURES_DIR } from "../utils/constants";
import { selectionEffect } from "../utils/cssReact";
import ButtonNavScroll from "./ButtonNavScroll";
import "../assets/css/fullHD.css";

const Characters = ({
  setObjectCharacterSelected,
  objectSelectedCharacter,
}) => {
  const stateCharacters = useSelector((state) => state.character);
  const stateUser = useSelector((state) => state.user);

  const handleSelectedCharacter = (selectedCharacter) => {
    //If selected again
    if (selectedCharacter._id == objectSelectedCharacter?._id) {
      setObjectCharacterSelected(null);
    } else {
      setObjectCharacterSelected(selectedCharacter);
    }
  };

  return (
    <Box
      height={`100%`}
      width={"100%"}
      position={"relative"}
    >
      <Stack
        height={"100%"}
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
          if (stateUser.character != character?._id) {
            return (
              <Box
                key={character._id}
                height={`90%`}
                width={`${character.width * 100}%`}
                onClick={() => {
                  handleSelectedCharacter(character);
                }}
                position="relative"
                zIndex={100}
                sx={[
                  {
                    flex: "none",
                    scrollSnapAlign: "start",
                    backgroundImage: `url(${PICTURES_DIR}/${character.img})`,
                    backgroundSize: "100% 100%",
                    cursor: "pointer",
                  },
                  character._id == objectSelectedCharacter?._id &&
                    selectionEffect(character),
                ]}
              >
                {/* Character's name */}
                <Box
                  position="absolute"
                  right={"3%"}
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
                    id={"character-name-text"}
                  >
                    {character.name}
                  </Typography>
                </Box>

                {/* Character caracteristics title*/}
                <Box position={"absolute"} top={"50%"} width={"90%"}>
                  <Typography
                    textAlign={"center"}
                    level={"h4"}
                    textColor={colors.titleBackDark}
                    fontWeight={400}
                    id={"character-char-name"}
                    
                  >
                    Caractéristiques
                  </Typography>
                </Box>

                {/* Character's caracteristics content */}
                <Box
                  position={"absolute"}
                  top={"54%"}
                  width={"90%"}
                  height={"50%"}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"start"}
                >
                  <Typography
                    level={"body-sm"}
                    textAlign={"center"}
                    textColor={"white"}
                    padding={"5%"}
                    id={"character-char-detail"}
                  >
                    {character.caracteristic}
                  </Typography>
                </Box>
              </Box>
            );
          }
        })}
      </Stack>

      <ButtonNavScroll
        id="left-nav-button"
        left={"-10%"}
        top={"30%"}
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
        left={"100%"}
        top={"30%"}
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
