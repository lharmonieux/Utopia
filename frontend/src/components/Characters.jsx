/* eslint-disable react/prop-types */
import * as Joy from "@mui/joy";

const Characters = ({
  characters,
  handleSelectedCharacter,
  setOpenCaracteristic,
  setCaracteristicToDisplay,
  openCaracteristic,
  caracteristicToDisplay,
}) => {
  return (
    <Joy.Stack
      direction="row"
      spacing={2}
      flexWrap="wrap"
      justifyContent="space-evenly"
      useFlexGap
    >
      {/* Carte de personnage  */}
      {characters.map((character) => (
        <Joy.Stack spacing={0} key={character._id} direction="column">
          <Joy.Button
            value={character._id}
            onClick={() => {
              handleSelectedCharacter(character._id);
            }}
            variant="soft"
            sx={{
              padding: 5,
              backgroundColor: character.selected ? "#0EC586" : "",
            }}
          >
            <Joy.Typography
              level="title-md"
              sx={{
                fontWeight: "bold",
              }}
            >
              {character.name}
            </Joy.Typography>
          </Joy.Button>

          {/* Button voir display Modal  */}
          <Joy.Button
            variant="soft"
            sx={{ border: 1, borderRadius: 5 }}
            onClick={() => {
              setOpenCaracteristic(true);
              setCaracteristicToDisplay(character.caracteristic);
            }}
          >
            Details
          </Joy.Button>

          {/* Content of Modal */}
          <Joy.Modal
            open={openCaracteristic}
            onClose={() => setOpenCaracteristic(false)}
          >
            <Joy.ModalDialog>
              <Joy.ModalClose variant="outlined" />

              <Joy.DialogTitle>Caractéristiques du personnage</Joy.DialogTitle>

              <Joy.Typography level="title-md">
                {caracteristicToDisplay}
              </Joy.Typography>
            </Joy.ModalDialog>
          </Joy.Modal>
        </Joy.Stack>
      ))}
    </Joy.Stack>
  );
};

export default Characters;
