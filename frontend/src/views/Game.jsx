import { useContext, useEffect, useState } from "react";
import { AppContext } from "./admin/GameContext.jsx";

const Game = () => {
  const { currentAct, characters } = useContext(AppContext);
  const [currentQuestion, setCurrentQuestion] = useState({});
  let orderQuestion = 0;

  useEffect(() => {
    if (currentAct && currentAct.questions) {
      setCurrentQuestion(currentAct?.questions[orderQuestion]);
    }
  }, [currentAct, orderQuestion]);

  const selectCharacter = () => {

  }

  const answerToDisplay = (answerType) => {
    switch (answerType) {
      case "personnage":
        return (
          <>
            {characters.map((character) => (
              <button key={character._id}>
                <div className="border">
                  <p className="text-xl font-bold">{character.name}</p>
                  <p>{character.caracteristic}</p>
                </div>
              </button>
            ))}
          </>
        );

      default:
        break;
    }
  };

  return (
    <div className="border">
      <h1 className="text-2xl font-bold">Acte {currentAct?.chapter}</h1>
      <h3 className="">{currentAct?.name}</h3>

      <div>
        <p>{currentQuestion?.content}</p>
      </div>
      <>{answerToDisplay(currentQuestion?.answer_type)}</>
      <button className="border">Valider</button>
    </div>
  );
};

export default Game;
