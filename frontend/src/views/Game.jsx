import { useContext, useEffect, useState } from "react";
import { AppContext } from "./admin/GameContext.jsx";

const Game = () => {
  const { currentAct } = useContext(AppContext);
  const [currentQuestion, setCurrentQuestion] = useState({});
  let orderQuestion = 0;
  console.log(currentAct);
  
  useEffect(()=>{
    if(currentAct != null && currentAct != undefined){
        setCurrentQuestion(currentAct?.questions[orderQuestion])
    } 
  }, [currentAct, orderQuestion])

  return (
    <div className="border">
      <h1 className="text-2xl font-bold">Acte {currentAct?.chapter}</h1>
      <h3 className="">{currentAct?.name}</h3>

      <p>{currentQuestion?.content}</p>
    </div>
  );
};

export default Game;
