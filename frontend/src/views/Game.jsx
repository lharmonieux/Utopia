import { useContext, useEffect, useState } from "react";
import { AppContext } from "./admin/GameContext.jsx";
import { CssVarsProvider } from "@mui/joy/styles";
import * as Joy from "@mui/joy";

const Game = () => {
  const { currentAct, characters } = useContext(AppContext);
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [idCharacterSelected, setIdCharacterSelected] = useState("");
  const [openCaracteristic, setOpenCaracteristic] = useState(false);
  const [caracteristicToDisplay, setCaracteristicToDisplay] = useState("");

  let orderQuestion = 0;

  useEffect(() => {
    if (currentAct && currentAct.questions) {
      setCurrentQuestion(currentAct?.questions[orderQuestion]);
    }
  }, [currentAct, orderQuestion]);

  const handleSelectedCharacter = (idCharacter) => {
    characters.map(character => {
      if(character._id == idCharacter) character.selected = true;
      else character.selected = false;
    })
  }

  const answerToDisplay = (answerType) => {
    switch (answerType) {
      //Affichage du choix des persos
      case "personnage":
        return (
          <Joy.Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="space-evenly" useFlexGap>
            {/* Carte de personnage  */}
            {characters.map((character) => (
              <Joy.Stack spacing={0} key={character._id} direction="column">
                <Joy.Button
                  
                  value={character._id}
                  onClick={() => {
                    setIdCharacterSelected(character._id);
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

                    <Joy.DialogTitle>
                      Caractéristiques du personnage
                    </Joy.DialogTitle>

                    <Joy.Typography level="title-md">
                      {caracteristicToDisplay}
                    </Joy.Typography>
                  </Joy.ModalDialog>
                </Joy.Modal>
              </Joy.Stack>
            ))}
          </Joy.Stack>
        );

      default:
        break;
    }
  };

  return (
    <CssVarsProvider>
      <Joy.Stack justifyContent="center" alignItems="center">
        <Joy.Sheet
          variant="soft"
          sx={{ width: "60%", justifyContent: "center", alignItems: "center" }}
        >
          <Joy.Typography level="h3">
            Acte {currentAct?.chapter}: {currentAct?.name}
          </Joy.Typography>

          <Joy.Sheet variant="soft" sx={{ padding: "30px" }}>
            <Joy.Typography level="title-md" sx={{ textAlign: "center" }}>
              {currentQuestion?.content}
            </Joy.Typography>
          </Joy.Sheet>
          <>{answerToDisplay(currentQuestion?.answer_type)}</>

          <Joy.Sheet
            variant="soft"
            sx={{ marginTop: "10px", textAlign: "center" }}
          >
            <Joy.Button size="lg">Valider</Joy.Button>
          </Joy.Sheet>
        </Joy.Sheet>
      </Joy.Stack>
    </CssVarsProvider>
  );
};

export default Game;
