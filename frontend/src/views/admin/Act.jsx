import { useContext, useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
import { AppContext } from "./GameContext.jsx";
import {
  Sheet,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Typography,
  Box,
  List,
  ListItem,
  ListItemButton,
} from "@mui/joy";

const Act = () => {
  const { acts, dispatch } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [actsControl, setActsControl] = useState([]);
  const [showInputQuestion, setShowInputQuestion] = useState(false);
  const [showInputAnswer, setShowInputAnswer] = useState(false);
  const [isDeleteQuestion, setIsDeleteQuestion] = useState(false);
  const [isAddQuestion, setIsAddQuestion] = useState(false);
  const [isUpdateQuestion, setIsUpdateQuestion] = useState(false);
  const [isDeleteAnswer, setIsDeleteAnswer] = useState(false);
  const [isAddAnswer, setIsAddAnswer] = useState(false);
  const [isUpdateAnswer, setIsUpdateAnswer] = useState(false);

  //Questions form state
  const [contentQuestion, setContentQuestion] = useState("");
  const [answerTypeQuestion, setAnswerTypeQuestion] = useState("");
  const [thematicQuestion, setThematicQuestion] = useState("");

  //Answers form state
  const [contentAnswer, setContentAnswer] = useState("");
  const [scoreAnswer, setScoreAnswer] = useState(0);
  const [feedbackAnswer, setFeedbackAnswer] = useState("");

  // const location = useLocation();
  // const acts = location.state ;
  // console.log(acts);

  //Initializing of our table of datas
  useEffect(() => {
    setLoading(true);
    setActsControl(() =>
      acts.map((act) => ({
        act,
        displayQuestion: false,
        questions: act?.questions?.map((question) => ({
          question,
          displayAnswers: false,
        })),
      }))
    );
    //Wait a moment before displaying acts
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [acts]);

  const showQuestions = (act) => {
    //Remove the input that add question
    setShowInputQuestion(false);
    setActsControl((actsControl) => {
      return actsControl.map((actControl) =>
        actControl.act == act
          ? {
              act: actControl.act,
              displayQuestion: !actControl.displayQuestion,
              questions: actControl.questions,
            }
          : {
              act: actControl.act,
              displayQuestion: false,
              questions: actControl.questions,
            }
      );
    });
  };

  //Initializing states of condition
  const initializeStateBool = () => {
    setShowInputQuestion(false);
    setShowInputAnswer(false);
    setIsDeleteQuestion(false);
    setIsAddQuestion(false);
    setIsUpdateQuestion(false);
    setIsDeleteAnswer(false);
    setIsUpdateQuestion(false);
    setContentQuestion("");
    setAnswerTypeQuestion("");
    setThematicQuestion("");
    setContentAnswer("");
    setScoreAnswer(0);
    setFeedbackAnswer("");
  };

  const displayInputQuestion = () => setShowInputQuestion(true);

  const handleExistingAct = ({ act, question }) => {
    // Add question with answer
    if (isAddQuestion) {
      //First needed answer for the question with type proposition
      const newAnswer = [];
      if (contentAnswer && scoreAnswer && feedbackAnswer) {
        newAnswer.push({
          content: contentAnswer,
          score: scoreAnswer,
          feedback: feedbackAnswer,
        });
      }
      console.log(newAnswer);

      const newQuestions = [
        ...act.questions,
        {
          content: contentQuestion,
          order: act?.questions.length + 1,
          image: "image.jpg",
          answer_type: answerTypeQuestion,
          thematic: thematicQuestion,
          answers: newAnswer,
        },
      ];
      let newAct = {
        name: act.name,
        chapter: act.chapter,
        questions: newQuestions,
      };

      //Send the new information for updated the act
      dispatch({
        type: "updated",
        id: act._id,
        newAct,
      });
      initializeStateBool();
    }
    // Delete question
    else if (isDeleteQuestion) {
      const newQuestion = act?.questions
        ?.filter((q) => q != question)
        .map((question) => {
          delete question._id;
          return question;
        });
      const newAct = {
        name: act?.name,
        chapter: act?.chapter,
        questions: newQuestion,
      };

      dispatch({
        type: "updated",
        id: act._id,
        newAct,
      });

      initializeStateBool();
    }
    // Juste add answer in one question
    else if (isAddAnswer) {
      //First needed answer for the question with type proposition
      const newAnswer = {
        content: contentAnswer,
        score: scoreAnswer,
        feedback: feedbackAnswer,
      };

      //New table without the question where we added the answer
      let newQuestions = [...act.questions.filter((e) => e !== question)];

      //Updating the final table
      question?.answers.push(newAnswer);
      newQuestions.push(question);

      //Updated the question
      let newAct = {
        name: act.name,
        chapter: act.chapter,
        questions: newQuestions,
      };

      //Send the new information for updated the act
      dispatch({
        type: "updated",
        id: act._id,
        newAct,
      });

      initializeStateBool();
    }
  };

  const handleActToRemove = (idActToRemove) => {
    dispatch({
      type: "deleted",
      id: idActToRemove,
    });
  };

  const displayInputAnswer = () => setShowInputAnswer(true);

  const displayAnswers = (questions, questionSelected) => {
    setShowInputAnswer(false);
    setShowInputQuestion(false);
    //Initializing all displaying to false
    setActsControl((actsControl) =>
      actsControl.map((actControl) => ({
        act: actControl.act,
        displayQuestion: actControl.displayQuestion,
        questions: questions.map((element) =>
          element.question == questionSelected
            ? {
                question: element.question,
                displayAnswers: !element.displayAnswers,
              }
            : { question: element.question, displayAnswers: false }
        ),
      }))
    );
  };

  return (
    <Stack
      display="flex"
      alignItems={"center"}
      justifyContent={"center"}
      height={"100vh"}
      width={"100wh"}
    >
      <Sheet
        variant="outlined"
        sx={{ height: "90%", width: "90%", borderRadius: 10 }}
      >
        <Typography level="h1" sx={{ textAlign: "center", padding: 2 }}>
          ESPACE ADMIN
        </Typography>
        <Tabs>
          <TabList tabFlex={"auto"}>
            {acts &&
              acts.map((act) => (
                <Tab key={act._id}>
                  Acte {act.chapter} : {act.name}
                </Tab>
              ))}
          </TabList>

          {/* Content of each act */}
          {acts &&
            acts.map((act, index) => (
              <TabPanel key={act._id} value={index}>
                {/* Navigation between questions  */}
                <Tabs>
                  <TabList
                    sx={{ overflow: "auto", scrollSnapType: "x mandatory" }}
                  >
                    {act?.questions &&
                      act?.questions.map((question, index) => (
                        <Tab
                          variant="outlined"
                          key={index}
                          sx={{
                            width: "50%",
                            flex: "none",
                            scrollSnapAlign: "start",
                          }}
                        >
                          {question.content}
                        </Tab>
                      ))}
                  </TabList>

                  {/* Content of each question  */}
                  {act?.questions &&
                    act?.questions.map((question, index) => (
                      <TabPanel key={question._id} value={index}>
                        <List size="md">
                          {Object.keys(question).forEach((key) => {
                            // Select of values to show
                            if (!["content", "answers", "_id"].includes(key)) {
                              return (
                                <ListItem>
                                  <ListItemButton>
                                    {question[key]}
                                  </ListItemButton>
                                </ListItem>
                              );
                            }
                          })}
                        </List>
                      </TabPanel>
                    ))}
                </Tabs>
              </TabPanel>
            ))}
        </Tabs>
      </Sheet>
    </Stack>
    // <div>
    //   {loading ? (
    //     <p>Chargement des données...</p>
    //   ) : (
    //     <>
    //       <div>
    //         <button className="border">Ajouter un acte</button>
    //       </div>
    //       {actsControl?.map((element) => (
    //         <div className="bg-gray-700" key={element.act._id}>
    //           <button onClick={() => showQuestions(element.act)}>
    //             Acte {element.act.chapter} : {element.act.name}
    //           </button>

    //           {/* Displaying of questions  */}
    //           {element.displayQuestion ? (
    //             <>
    //               {element?.questions?.map((e) => (
    //                 <div className="bg-gray-400" key={e.question._id}>
    //                   <div>
    //                     <button
    //                       onClick={() =>
    //                         displayAnswers(element?.questions, e.question)
    //                       }
    //                     >
    //                       {e.question.content}
    //                     </button>
    //                     <button
    //                       className="border"
    //                       onClick={() => {
    //                         setIsDeleteQuestion(true);
    //                         handleExistingAct({
    //                           act: element?.act,
    //                           question: e.question,
    //                         });
    //                       }}
    //                     >
    //                       Supprimer la question
    //                     </button>
    //                   </div>

    //                   {/* Displaying answers for an question  */}
    //                   {e.displayAnswers ? (
    //                     <>
    //                       {e.question?.answers?.map((answer) => (
    //                         <div className="bg-gray-200" key={answer._id}>
    //                           <p>{answer.content}</p>
    //                         </div>
    //                       ))}
    //                       <div>
    //                         <button
    //                           className="border"
    //                           onClick={() => displayInputAnswer()}
    //                         >
    //                           Ajouter une réponse
    //                         </button>
    //                       </div>

    //                       {/* Adding answer  */}
    //                       {showInputAnswer ? (
    //                         <div>
    //                           <div>
    //                             <label>Contenu de la réponse</label>
    //                             <input
    //                               type="text"
    //                               className="border"
    //                               onChange={(e) =>
    //                                 setContentAnswer(e.target.value)
    //                               }
    //                             />
    //                           </div>
    //                           <div>
    //                             <label>Score</label>
    //                             <input
    //                               type="number"
    //                               className="border"
    //                               onChange={(e) =>
    //                                 setScoreAnswer(e.target.value)
    //                               }
    //                             />
    //                           </div>
    //                           <div>
    //                             <label>Feedback</label>
    //                             <input
    //                               type="text"
    //                               className="border"
    //                               onChange={(e) =>
    //                                 setFeedbackAnswer(e.target.value)
    //                               }
    //                             />
    //                           </div>
    //                           <div>
    //                             <button
    //                               className="border"
    //                               onClick={() => {
    //                                 setIsAddAnswer(true);
    //                                 handleExistingAct({
    //                                   act: element?.act,
    //                                   question: e.question,
    //                                 });
    //                               }}
    //                             >
    //                               Enregistrer
    //                             </button>
    //                           </div>
    //                         </div>
    //                       ) : (
    //                         ""
    //                       )}
    //                     </>
    //                   ) : (
    //                     ""
    //                   )}
    //                 </div>
    //               ))}
    //               <div>
    //                 <button
    //                   className="border"
    //                   onClick={() => displayInputQuestion()}
    //                 >
    //                   Ajouter une question
    //                 </button>
    //               </div>

    //               {/* Adding questions  */}
    //               {showInputQuestion ? (
    //                 <div>
    //                   <div>
    //                     <label>Contenu</label>
    //                     <input
    //                       type="text"
    //                       className="border"
    //                       onChange={(e) => setContentQuestion(e.target.value)}
    //                     />
    //                   </div>
    //                   <div>
    //                     <label>Type de réponse</label>
    //                     <input
    //                       type="text"
    //                       className="border"
    //                       onChange={(e) =>
    //                         setAnswerTypeQuestion(e.target.value)
    //                       }
    //                     />
    //                   </div>
    //                   <div>
    //                     <label>Thématique</label>
    //                     <input
    //                       type="text"
    //                       className="border"
    //                       onChange={(e) => setThematicQuestion(e.target.value)}
    //                     />
    //                   </div>
    //                   <button className="border"
    //                     onClick={() => {
    //                       setIsAddQuestion(true);
    //                       handleExistingAct({ act: element?.act });
    //                     }}
    //                   >
    //                     Enregistrer
    //                   </button>

    //                   <button className="border" onClick={() => displayInputAnswer()}>
    //                     Ajouter des réponses
    //                   </button>

    //                   {/* Adding answers for question  */}
    //                   {showInputAnswer ? (
    //                     <div>
    //                       <div>
    //                         <label>Contenu de la réponse</label>
    //                         <input
    //                           type="text"
    //                           className="border"
    //                           onChange={(e) => setContentAnswer(e.target.value)}
    //                         />
    //                       </div>
    //                       <div>
    //                         <label>Score</label>
    //                         <input
    //                           type="number"
    //                           className="border"
    //                           onChange={(e) => setScoreAnswer(e.target.value)}
    //                         />
    //                       </div>
    //                       <div>
    //                         <label>Feedback</label>
    //                         <input
    //                           type="text"
    //                           className="border"
    //                           onChange={(e) =>
    //                             setFeedbackAnswer(e.target.value)
    //                           }
    //                         />
    //                       </div>
    //                       <div>
    //                         <button className="border"
    //                           onClick={() => {
    //                             setIsAddQuestion(true);
    //                             handleExistingAct({ act: element?.act });
    //                           }}
    //                         >
    //                           Enregistrer
    //                         </button>
    //                       </div>
    //                     </div>
    //                   ) : (
    //                     ""
    //                   )}
    //                 </div>
    //               ) : (
    //                 " "
    //               )}
    //             </>
    //           ) : (
    //             ""
    //           )}
    //         </div>
    //       ))}
    //     </>
    //   )}
    // </div>
  );
};

export default Act;
