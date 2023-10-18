import { useContext, useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
import { ActContext } from "./GameContext";

const Act = () => {
  const { acts, dispatch } = useContext(ActContext);
  const [questionsVisible, setQuestionsVisible] = useState([]);
  const [answersVisible, setAnswersVisible] = useState([]);
  const [showInputQuestion, setShowInputQuestion] = useState(false);
  const [showInputAnswer, setShowInputAnswer] = useState(false);

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

  //All the questions form have to be hidden when refreshing the page
  useEffect(() => {
    for (let i = 0; i < acts.length; i++) {
      setQuestionsVisible([...questionsVisible, false]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showQuestions = (act) => {
    //Remove the input that add question
    setShowInputQuestion(false);
    let index = acts.indexOf(act);
    setQuestionsVisible((questionsVisible) => {
      //New table of state within all values equal false
      const newQuestionsVisible = questionsVisible.map(() => false);
      newQuestionsVisible[index] = !questionsVisible[index];
      return newQuestionsVisible;
    });
  };

  const displayInputQuestion = () => setShowInputQuestion(true);

  const handleExistingAct = ({ act, question }) => {
    // Add question with answer
    if (contentQuestion) {
      //First needed answer for the question with type proposition
      const newAnswer = {
        content: contentAnswer,
        score: scoreAnswer,
        feedback: feedbackAnswer,
      };

      const newQuestions = [
        ...act.questions,
        {
          contentQuestion,
          order: act.questions.length + 1,
          image: "image.jpg",
          answerTypeQuestion,
          thematicQuestion,
          answer: newAnswer,
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
      setContentQuestion("");
      setShowInputQuestion(false);
      setShowInputAnswer(false);
    }
    // Juste add answer on one question
    else {
      //First needed answer for the question with type proposition
      const newAnswer = {
        content: contentAnswer,
        score: scoreAnswer,
        feedback: feedbackAnswer,
      };

      //New table without the question where we added the answer
      let newQuestions = [...act.questions.filter((e) => e !== question)];

      //Updating the final table
      question.answers.push(newAnswer);
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
      setContentQuestion("");
      setShowInputQuestion(false);
      setShowInputAnswer(false);
    }
  };

  const displayInputAnswer = () => setShowInputAnswer(true);

  const displayAnswers = (act, question) => {
    setShowInputAnswer(false);
    setShowInputQuestion(false);
    //Initializing all displaying to false
    for (let index = 0; index < question.length; index++) {
      setAnswersVisible([...answersVisible, false]);
    }

    let currentQuestionIndex = act.questions.indexOf(question);
    setAnswersVisible((answersVisible) => {
      const newAnswersVisible = answersVisible.map(() => false);
      newAnswersVisible[currentQuestionIndex] =
        !newAnswersVisible[currentQuestionIndex];
      return newAnswersVisible;
    });
  };


  return (
    <div>
      <div>
        <button>Ajouter un acte</button>
      </div>
      {acts?.map((act) => (
        <div key={act._id}>
          <button onClick={() => showQuestions(act)}>
            Acte {act.chapter} : {act.name}
          </button>

          {/* Displaying of questions  */}
          {questionsVisible[acts?.indexOf(act)] ? (
            <>
              {act?.questions?.map((question) => (
                <div key={question._id}>
                  <div>
                    <button onClick={() => displayAnswers(act, question)}>
                      {question.content}
                    </button>
                  </div>

                  {/* Displaying answers for an question  */}
                  {answersVisible[act?.questions?.indexOf(question)] ? (
                    <>
                      {question.answers?.map((answer) => (
                        <div key={answer._id}>
                          <p>{answer.content}</p>
                        </div>
                      ))}
                      <div>
                        <button onClick={() => displayInputAnswer()}>
                          Ajouter une réponse
                        </button>
                      </div>

                      {/* Adding answer  */}
                      {showInputAnswer ? (
                        <div>
                          <div>
                            <label>Contenu de la réponse</label>
                            <input
                              type="text"
                              className="border"
                              onChange={(e) => setContentAnswer(e.target.value)}
                            />
                          </div>
                          <div>
                            <label>Score</label>
                            <input
                              type="number"
                              className="border"
                              onChange={(e) => setScoreAnswer(e.target.value)}
                            />
                          </div>
                          <div>
                            <label>Feedback</label>
                            <input
                              type="text"
                              className="border"
                              onChange={(e) =>
                                setFeedbackAnswer(e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <button
                              onClick={() =>
                                handleExistingAct({ act, question })
                              }
                            >
                              Enregistrer
                            </button>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    ""
                  )}
                </div>
              ))}
              <div>
                <button onClick={() => displayInputQuestion()}>
                  Ajouter une question
                </button>
              </div>

              {/* Adding questions  */}
              {showInputQuestion ? (
                <div>
                  <div>
                    <label>Contenu</label>
                    <input
                      type="text"
                      className="border"
                      onChange={(e) => setContentQuestion(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Type de réponse</label>
                    <input
                      type="text"
                      className="border"
                      onChange={(e) => setAnswerTypeQuestion(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Thématique</label>
                    <input
                      type="text"
                      className="border"
                      onChange={(e) => setThematicQuestion(e.target.value)}
                    />
                  </div>
                  <button onClick={() => handleExistingAct(act)}>
                    Enregistrer
                  </button>

                  <button onClick={() => displayInputAnswer()}>
                    Ajouter des réponses
                  </button>

                  {/* Adding answers for question  */}
                  {showInputAnswer ? (
                    <div>
                      <div>
                        <label>Contenu de la réponse</label>
                        <input
                          type="text"
                          className="border"
                          onChange={(e) => setContentAnswer(e.target.value)}
                        />
                      </div>
                      <div>
                        <label>Score</label>
                        <input
                          type="number"
                          className="border"
                          onChange={(e) => setScoreAnswer(e.target.value)}
                        />
                      </div>
                      <div>
                        <label>Feedback</label>
                        <input
                          type="text"
                          className="border"
                          onChange={(e) => setFeedbackAnswer(e.target.value)}
                        />
                      </div>
                      <div>
                        <button onClick={() => handleExistingAct({ act })}>
                          Enregistrer
                        </button>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                " "
              )}
            </>
          ) : (
            ""
          )}
        </div>
      ))}
    </div>
  );
};

export default Act;
