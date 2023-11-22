/* eslint-disable react/prop-types */
import { Stack, Typography, Box, CssVarsProvider } from "@mui/joy";
import "animate.css";
import { typographyTheme } from "../utils/themeJoy";
import { colors } from "../utils/colors";

const Characters = ({
  characters,
  widthMainContent,
  heightMainContent,
  setIdCharacterSelected,
  idCharacterSelected,
  setStoreAnswer,
}) => {
  const handleSelectedCharacter = (selectedCharacter) => {
    //If selected again
    if (selectedCharacter._id == idCharacterSelected) {
      setIdCharacterSelected("");
      setStoreAnswer([]);
    } else {
      setIdCharacterSelected(selectedCharacter._id);
      setStoreAnswer([selectedCharacter]);
    }

    characters.map((character) => {
      if (character._id == selectedCharacter._id)
        character.selected = !character.selected;
      else character.selected = false;
    });
  };

  return (
    <CssVarsProvider theme={typographyTheme}>
      <Stack
        direction="row"
        height={heightMainContent}
        width={widthMainContent}
        spacing={5}
        sx={{ overflow: "auto", scrollSnapType: "x mandatory" }}
      >
        {/* Carte de personnage  */}
        {characters.map((character) => (
          <Box
            key={character._id}
            height={parseInt(heightMainContent * 0.65)}
            width={parseInt(widthMainContent * 0.3)}
            onClick={() => {
              handleSelectedCharacter(character);
            }}
            position="relative"
            sx={{
              flex: "none",
              scrollSnapAlign: "start",
              backgroundImage: `url(${character.img.toURL()})`,
              border: character.selected ? 3 : 0,
              borderColor: character.selected ? "#0EC586" : "",
              borderRadius: character.selected ? 5 : 0,
            }}
            className={"animate__animated animate__bounceIn"}
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
        ))}
      </Stack>
    </CssVarsProvider>
  );
};

export default Characters;
