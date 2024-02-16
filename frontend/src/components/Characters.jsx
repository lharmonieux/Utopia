/* eslint-disable react/prop-types */
import { Stack, Typography, Box } from "@mui/joy";
import { TbArrowBigRightFilled, TbArrowBigLeftFilled } from "react-icons/tb";
import "animate.css";
import { colors } from "../utils/colors";
import { useDispatch, useSelector } from "react-redux";
import { updateCharactersSelected } from "../utils/redux/characterSlice";
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

  const handleSelectedCharacter = (selectedCharacter) => {
    //If selected again
    if (selectedCharacter._id == objectSelectedCharacter?._id) {
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
  };

  return (
    <Box
      height={`${(0.95 - questionContent?.backgroundImg?.height) * 100}%`}
      width={"100%"}
      sx={{
        "@media screen and (min-width: 1440px) and (max-width: 2559px) and (min-height: 858px)":
          {
            height: `${(0.75 - questionContent?.backgroundImg?.height) * 100}%`,
          },
        "@media screen and (min-width: 1440px) and (max-width: 2559px) and (min-height: 680px) and (max-height: 857px)":
          {
            height: `${(0.9 - questionContent?.backgroundImg?.height) * 100}%`,
          },
        "@media screen and (min-width: 1024px) and (max-width: 1439px) and (min-height: 858px)":
          {
            height: `${(0.8 - questionContent?.backgroundImg?.height) * 100}%`,
          },
        "@media screen and (min-width: 1024px) and (max-width: 1439px) and (min-height: 578px) and (max-height: 857px)":
          {
            height: `${(0.8 - questionContent?.backgroundImg?.height) * 100}%`,
          },
      }}
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
          if (stateUser.character?._id != character?._id)
            return (
              <Box
                key={character._id}
                height={`100%`}
                width={`${character.width * 100}%`}
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
                    backgroundSize: "100% 100%",
                    cursor: "pointer",
                  },
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
                    sx={{
                      lineHeight: 1,
                      "@media screen and (min-width: 1440px) and (max-width: 2559px) and (min-height: 680px) and (max-height: 857px)":
                        {
                          fontSize: "130%",
                        },
                      "@media screen and (min-width: 1024px) and (max-width: 1439px) and (min-height: 578px) and (max-height: 857px)":
                        {
                          fontSize: "100%",
                        },
                    }}
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
                    sx={{
                      "@media screen and (min-width: 1440px) and (max-width: 2559px) and (min-height: 680px) and (max-height: 857px)":
                        {
                          fontSize: "120%",
                        },
                        "@media screen and (min-width: 1024px) and (max-width: 1439px) and (min-height: 858px)":
                        {
                          fontSize: "110%",
                        },
                      "@media screen and (min-width: 1024px) and (max-width: 1439px) and (min-height: 578px) and (max-height: 857px)":
                        {
                          fontSize: "100%",
                        },
                    }}
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
                    padding={2}
                    sx={{
                      "@media screen and (min-width: 1440px) and (max-width: 2559px) and (min-height: 680px) and (max-height: 857px)":
                        {
                          fontSize: "95%",
                        },
                        "@media screen and (min-width: 1024px) and (max-width: 1439px) and (min-height: 858px)":
                        {
                          fontSize: "80%",
                        },
                      "@media screen and (min-width: 1024px) and (max-width: 1439px) and (min-height: 578px) and (max-height: 857px)":
                        {
                          fontSize: "65%",
                        },
                    }}
                  >
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
