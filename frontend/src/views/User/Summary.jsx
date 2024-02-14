import {
  Box,
  CircularProgress,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
  Typography,
} from "@mui/joy";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PICTURES_DIR } from "../../utils/constants";
import { colors } from "../../utils/colors";
import { useEffect, useState } from "react";
import { textAreaStyle } from "../../utils/cssReact";
import "animate.css";
import { IoInformationCircle } from "react-icons/io5";
import apiRequest from "../../api/requestAPI";
import { createUserError } from "../../utils/redux/userSlice";
import CustomButton from "../../components/CustomButton";

const Summary = () => {
  const stateActs = useSelector((state) => state.act);
  const stateUser = useSelector((state) => state.user);
  const authState = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openModalFeelings, setOpenModalFeelings] = useState(false);
  const [feelingsAnswer, setFeelingsAnswer] = useState(new Map());

  //Questions for the user when he will finish all the act's game
  let questions = [
    "Qu'est-ce que cette aventure me révèle sur moi ?",
    "Où me suis-je senti le plus à l'aise ? Moins à l'aise ?",
    "Des choix ont-ils été difficiles à effectuer ? Comment le comprendre ?",
    "Qu'est-ce que cela vous évoque dans l'exercice de votre métier ?",
    "Au final, que retenez-vous de cette aventure ?",
  ];

  useEffect(() => {
    if (
      !stateUser.feelings &&
      stateUser.saves?.length == stateActs.acts?.length
    ) {
      //Data structure for save feelings answers with textarea content
      const newFeelingsAnswer = new Map();
      for (let question of questions) {
        newFeelingsAnswer.set(question, { answer: "", noAnswer: false });
      }
      setFeelingsAnswer(newFeelingsAnswer);
      setOpenModalFeelings(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateUser, stateActs]);

  const modalFeelings = () => {
    const handleTextArea = (e, question) => {
      let newFeelingsAnswer = new Map(feelingsAnswer);
      newFeelingsAnswer.set(question, {
        answer: e.target.value,
        noAnswer: false,
      });
      setFeelingsAnswer(newFeelingsAnswer);
    };

    const handleFormError = () => {
      //Check if all textarea contain text
      const itrFeelingsAnswer = new Map(feelingsAnswer);
      const iterator = itrFeelingsAnswer.entries();
      let hasError = false;

      for (let i = 0; i < itrFeelingsAnswer.size; i++) {
        let objAnswer = iterator.next().value;
        if (!objAnswer[1].answer) {
          itrFeelingsAnswer.set(objAnswer[0], {
            ...objAnswer[1],
            noAnswer: true,
          });
          hasError = true;
        } else {
          itrFeelingsAnswer.set(objAnswer[0], {
            ...objAnswer[1],
            noAnswer: false,
          });
        }
      }

      setFeelingsAnswer(itrFeelingsAnswer);
      return hasError;
    };

    const submitFeelings = () => {
      const formError = handleFormError();
      if (formError) return;

      //Save feelings answers
      const userToSave = {
        firstname: stateUser.firstname,
        lastname: stateUser.lastname,
        role: "JOUEUR",
        character: stateUser.character,
        secondCharacter: stateUser.secondCharacter,
        motto: stateUser.motto,
        town: stateUser.town,
        townName: stateUser.townName,
        townStatus: stateUser.townStatus,
        partyName: stateUser.partyName,
        feelings: Object.fromEntries(feelingsAnswer),
        saves: stateUser.saves,
      };

      apiRequest("users/update", "put", authState.token, {
        data: { ...userToSave, idUser: stateUser.idUser },
      })
        .then(() => {
          window.location.href = "/summary";
        })
        .catch((err) => {
          dispatch(createUserError(err.message));
          navigate("/user");
          console.log(err);
        });
    };

    return (
      <Modal
        open={openModalFeelings}
        onClose={() => setOpenModalFeelings(false)}
      >
        <ModalDialog
          sx={{
            width: "90%",
            height: "90%",
            position: "relative",
            display: "flex",
            alignItems: "center",
            padding: 0,
          }}
          className="animate__animated animate__zoomIn"
        >
          <ModalClose variant="outlined" sx={{ zIndex: 1000 }} />

          {/* Background */}
          <video
            autoPlay
            muted
            loop
            width={"100%"}
            height={"100%"}
            style={{ position: "fixed" }}
          >
            <source
              src={`${PICTURES_DIR}/background_videos/vecteezy_exo-planet-with-rings-animation-4k_25272383_367.mp4`}
              type="video/mp4"
            />
          </video>

          <Stack
            paddingTop={"4%"}
            spacing={2}
            direction={"column"}
            height={"85%"}
            width={"90%"}
            flexWrap={"wrap"}
            position={"relative"}
            zIndex={1}
            useFlexGap
            sx={{
              "@media screen and (min-width: 1920px)": {
                width: "80%",
                height: "90%",
              },
            }}
          >
            {/* Bravo Box */}
            <Box
              height={"25%"}
              width={"50%"}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems={"center"}
              zIndex={1}
            >
              <Typography
                level="h3"
                fontWeight={600}
                textColor={"white"}
                sx={{
                  "@media screen and (min-width: 1920px)": {
                    fontSize: "1.8em",
                  },
                }}
              >
                BRAVO,
              </Typography>
              <Typography
                level="title-md"
                fontWeight={400}
                textColor={"white"}
                textAlign={"center"}
                sx={{
                  "@media screen and (min-width: 1920px)": {
                    fontSize: "1.2em",
                  },
                }}
              >
                {"vous venez de vivre l'aventure Exploria."} <br />{" "}
                {"Alors, qu'en retenez-vous ?"}
              </Typography>
            </Box>

            {/* Question Answers */}
            {questions.map((question, index) => (
              <Box
                key={index}
                height={"30%"}
                width={"50%"}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                zIndex={1}
              >
                {" "}
                <Typography
                  level="title-md"
                  textColor={"white"}
                  fontWeight={500}
                  paddingLeft={"10%"}
                  paddingRight={"10%"}
                  sx={{
                    "@media screen and (min-width: 1920px)": {
                      fontSize: "1.1em",
                    },
                  }}
                >
                  {question}
                </Typography>
                {/* textarea */}
                <Box
                  height={"70%"}
                  width={"80%"}
                  sx={{
                    backgroundImage: `url(${PICTURES_DIR}/textarea_end.svg)`,
                    backgroundSize: "100% 100%",
                    border:
                      feelingsAnswer.get(question).noAnswer && "solid 2px",
                    borderColor: feelingsAnswer.get(question).noAnswer && "red",
                    borderRadius:
                      feelingsAnswer.get(question).noAnswer && "15%",
                  }}
                >
                  <textarea
                    style={textAreaStyle}
                    value={feelingsAnswer.get(question).answer}
                    onChange={(e) => handleTextArea(e, question)}
                    placeholder="Entrez votre réponse..."
                  />
                  {feelingsAnswer.get(question).noAnswer && (
                    <Typography
                      marginTop={"-2%"}
                      level="body-sm"
                      fontWeight={600}
                      textColor={"red"}
                      startDecorator={<IoInformationCircle />}
                    >
                      Une réponse est requise
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Stack>

          {/* Submit Button */}
          <CustomButton
            width={"15%"}
            height={"15%"}
            clickMethod={submitFeelings}
            backgroundColor={colors.buttonLight}
            hoverColor={colors.buttonLightHover}
            textColor={colors.titleBackLight}
            style={{ zIndex: 1000 }}
          >
            Soumettre
          </CustomButton>
        </ModalDialog>
      </Modal>
    );
  };

  return (
    <>
      {stateActs.acts ? (
        <Stack
          spacing={1}
          width={"100%"}
          height={"100%"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          position={"relative"}
          sx={{
            backgroundImage: `url(${PICTURES_DIR}/sommaire_bg.jpg)`,
            backgroundSize: "100% 100%",
          }}
        >
          {stateActs?.acts?.map((act) => {
            let actRowImg = "";
            switch (act.status) {
              case "IN PROGRESS":
                actRowImg = `${PICTURES_DIR}/acte_non_valide.svg`;
                break;
              case "DONE":
                actRowImg = `${PICTURES_DIR}/acte_valide.svg`;
                break;
              case "NOT DONE":
                actRowImg = `${PICTURES_DIR}/acte_pas_atteint.svg`;
                break;

              default:
                break;
            }
            return (
              <Stack
                key={act._id}
                spacing={2}
                direction={"row"}
                alignItems={"center"}
                justifyContent={"center"}
                width={"100%"}
              >
                <Box
                  width={"60%"}
                  height={"10vh"}
                  display={"flex"}
                  alignItems={"center"}
                  sx={{
                    backgroundImage: `url(${actRowImg})`,
                    backgroundSize: "100% 100%",
                  }}
                >
                  <Typography
                    level="title-lg"
                    textColor={"white"}
                    fontWeight={400}
                    marginLeft={"8%"}
                    sx={{
                      "@media screen and (min-width: 1920px)": {
                        fontSize: "2em",
                        marginLeft: "5%",
                      },
                    }}
                  >
                    {`ACTE ${act.chapter}`}
                  </Typography>

                  <Typography
                    level="title-lg"
                    textColor={
                      act.status == "DONE"
                        ? colors.titleBackLight
                        : colors.titleBackDark
                    }
                    fontWeight={400}
                    marginLeft={"15%"}
                    sx={{
                      "@media screen and (min-width: 1920px)": {
                        fontSize: "2em",
                        marginLeft: "8%",
                      },
                    }}
                  >
                    {`${act.name}`}
                  </Typography>
                </Box>

                {/* Play button */}
                {act.status == "IN PROGRESS" && (
                  <Box height={"5vh"} width={"18%"}>
                    <CustomButton
                      width={"100%"}
                      height={"100%"}
                      clickMethod={() => navigate("/game")}
                      backgroundColor={colors.buttonLight}
                      hoverColor={colors.buttonLightHover}
                    >
                      {act.chapter == 1
                        ? "Commencer à jouer"
                        : "Continuer l'aventure"}
                    </CustomButton>
                  </Box>
                )}
              </Stack>
            );
          })}

          {/* logo */}
          <Box
            top={"-4%"}
            left={"15%"}
            position={"absolute"}
            width={"45%"}
            height={"30%"}
          >
            <img
              src={`${PICTURES_DIR}/Logo - couleurs + blanc.svg`}
              width={"100%"}
              height={"100%"}
            />
          </Box>

          {/* decoration  */}
          <Box
            position={"absolute"}
            top={"-1.5%"}
            left={0}
            width={"15%"}
            height={"20%"}
          >
            <img
              src={`${PICTURES_DIR}/Déco - Charte triangle.svg`}
              height={"100%"}
              width={"100%"}
              style={{ transform: "rotate(180deg)" }}
            />
          </Box>

          <Box
            position={"absolute"}
            bottom={0}
            left={"85%"}
            width={"15%"}
            height={"30%"}
          >
            <img
              src={`${PICTURES_DIR}/Déco - Charte triangle.svg`}
              height={"100%"}
              width={"100%"}
            />
          </Box>
        </Stack>
      ) : (
        <Box
          width={"100%"}
          height={"100%"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <CircularProgress variant="outlined" />
        </Box>
      )}
      {openModalFeelings && modalFeelings()}
    </>
  );
};

export default Summary;
