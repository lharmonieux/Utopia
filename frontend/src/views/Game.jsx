import { useContext, useEffect, useState } from "react";
import { AppContext } from "./admin/GameContext.jsx";
import { CssVarsProvider } from "@mui/joy/styles";
import * as Joy from "@mui/joy";

const Game = () => {
  const { currentAct, characters } = useContext(AppContext);
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [idCharacterSelected, setIdCharacterSelected] = useState("")
  let orderQuestion = 0;

  useEffect(() => {
    if (currentAct && currentAct.questions) {
      setCurrentQuestion(currentAct?.questions[orderQuestion]);
    }
  }, [currentAct, orderQuestion]);

  const selectCharacter = () => {};

  const answerToDisplay = (answerType) => {
    switch (answerType) {
      //Affichage du choix des persos
      case "personnage":
        return (
          <>
            {characters.map((character) => (
              <Joy.ToggleButtonGroup key={character._id}>
                <Joy.Button>
                  <Joy.Typography level="title-md">{character.name}</Joy.Typography>
                  <Joy.Typography level="title-sm">{character.caracteristic}</Joy.Typography>
                </Joy.Button>
              </Joy.ToggleButtonGroup>
            ))}
          </>
        );

      default:
        break;
    }
  };

  return (
    <CssVarsProvider>
      <Joy.Stack justifyContent="center" alignItems="center">
        <Joy.Sheet variant="soft" sx={{ maxWidth: "60%" }}>
          <Joy.Typography level="h2">
            Acte {currentAct?.chapter}: {currentAct?.name}
          </Joy.Typography>

          <Joy.Sheet variant="soft" sx={{ padding: "40PX" }}>
            <Joy.Typography level="title-lg">
              {currentQuestion?.content}
            </Joy.Typography>
          </Joy.Sheet>
          <>{answerToDisplay(currentQuestion?.answer_type)}</>
          <Joy.Button>Valider</Joy.Button>
        </Joy.Sheet>
      </Joy.Stack>
    </CssVarsProvider>
  );
};

export default Game;
