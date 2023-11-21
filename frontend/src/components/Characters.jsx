/* eslint-disable react/prop-types */
import {
  Stack,
  Button,
  Typography,
  Modal,
  ModalDialog,
  ModalClose,
  DialogTitle,
  Box,
  CssVarsProvider,
} from "@mui/joy";
import "animate.css";
import { animateOut } from "../middlewares/Animation";
import { useEffect } from "react";
import { scale } from "@cloudinary/url-gen/actions/resize";
import { typographyTheme } from "../utils/themeJoy";

const Characters = ({
  characters,
  widthMainContent,
  heightMainContent,
  setIdCharacterSelected,
  idCharacterSelected,
  setStoreAnswer,
  setOpenCaracteristic,
  setCaracteristicToDisplay,
  openCaracteristic,
  caracteristicToDisplay,
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
        {characters &&
          characters.map((character) => (
            <Box
              key={character._id}
              height={parseInt(heightMainContent * 0.55)}
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
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
              >
                <Typography
                  level="h4"
                  textAlign='center'
                  fontWeight={400}
                  textColor={'white'}
                  sx={{lineHeight: 1}}
                >
                  {character.name}
                </Typography>
              </Box>
            </Box>
          ))}
      </Stack>
    </CssVarsProvider>
  );
};

export default Characters;
