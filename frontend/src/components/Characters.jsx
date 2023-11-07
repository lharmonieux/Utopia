/* eslint-disable react/prop-types */
import {
  Stack,
  Button,
  Typography,
  Modal,
  ModalDialog,
  ModalClose,
  DialogTitle,
} from "@mui/joy";
import "animate.css";
import { animateOut } from "../middlewares/Animation";

const Characters = ({
  characters,
  handleSelectedCharacter,
  setOpenCaracteristic,
  setCaracteristicToDisplay,
  openCaracteristic,
  caracteristicToDisplay,
}) => {
  return (
    <Stack
      direction="row"
      spacing={2}
      flexWrap="wrap"
      justifyContent="space-evenly"
      useFlexGap
    >
      {/* Carte de personnage  */}
      {characters.map((character) => (
        <Stack spacing={0} key={character._id} direction="column">
          <Button
            value={character._id}
            onClick={() => {
              handleSelectedCharacter(character);
            }}
            variant="soft"
            sx={{
              padding: 5,
              backgroundColor: character.selected ? "#0EC586" : "",
            }}
          >
            <Typography
              level="title-md"
              sx={{
                fontWeight: "bold",
              }}
            >
              {character.name}
            </Typography>
          </Button>

          {/* Button voir display Modal  */}
          <Button
            variant="soft"
            sx={{ border: 1, borderRadius: 5 }}
            onClick={() => {
              setOpenCaracteristic(true);
              setCaracteristicToDisplay(character.caracteristic);
            }}
          >
            Découvrir
          </Button>

          {/* Content of Modal */}
          <Modal
            open={openCaracteristic}
            onClose={() =>
              animateOut(openCaracteristic, "#modal-caracteristic", () =>
                setOpenCaracteristic(false)
              )
            }
            className={`animate__animated animate__zoomIn`}
            id={"modal-caracteristic"}
          >
            <ModalDialog>
              <ModalClose variant="outlined" />

              <DialogTitle>Caractéristiques du personnage</DialogTitle>

              <Typography level="title-md">{caracteristicToDisplay}</Typography>
            </ModalDialog>
          </Modal>
        </Stack>
      ))}
    </Stack>
  );
};

export default Characters;
