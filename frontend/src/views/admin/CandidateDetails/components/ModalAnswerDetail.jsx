/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import {
  Box,
  DialogContent,
  DialogTitle,
  Divider,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
} from "@mui/joy";
import { useEffect, useState } from "react";
import { CgArrowBottomRightR } from "react-icons/cg";
import IconButtonCustom from "../../../../components/IconButtonCustom";
import { colors } from "../../../../utils/colors";
import { useSelector } from "react-redux";

const ModalAnswerDetail = ({ open, setOpen, gamer, save }) => {
  const stateActs = useSelector((state) => state.act);
  const stateTowns = useSelector((state) => state.town);
  //States
  const [displayAnswer, setDisplayAnswer] = useState(new Map());

  useEffect(() => {
    let displayAnswer = new Map();
    for (let content of save.logAnswers) {
      const question = stateActs?.acts[
        save.act.chapterNumber - 1
      ]?.questions?.filter((question) => {
        return question.text.content == content.question;
      });

      displayAnswer.set(content.question, {
        display: false,
        allQuestionAnswers: question[0].answers,
        scoreMaxPossible: content.scoreMaxPossible,
        nbOfAnswersRequired: question[0].nbOfAnswersRequired || 1,
        questionType: question[0].questionType.name,
        nbResidentsMaxPossible: content.nbResidentsMaxPossible,
      });
    }

    setDisplayAnswer(displayAnswer);
  }, [stateActs.acts]);

  const handleCloseModal = () => {
    let openModal = new Map();
    for (let [key, value] of open) {
      if (key == save._id) openModal.set(key, !value);
      else openModal.set(key, false);
    }
    setOpen(openModal);
  };

  const handleDisplayAnswer = (question) => {
    let displayAnswerTmp = new Map(displayAnswer);
    for (let [key, value] of displayAnswer) {
      if (key == question)
        displayAnswerTmp.set(key, { ...value, display: !value.display });
      else displayAnswerTmp.set(key, { ...value, display: false });
    }
    setDisplayAnswer(displayAnswerTmp);
  };

  return (
    <Modal open={open.get(save._id)} onClose={handleCloseModal}>
      <ModalDialog sx={{ width: "70%", height: "80%" }}>
        <ModalClose variant="outlined" />
        <DialogTitle level="h3">
          {`Sommaire des réponses de l'acte ${save.act.chapterNumber} pour ${gamer.lastname} ${gamer.firstname} `}
        </DialogTitle>
        <Divider />
        <DialogContent
          sx={{ width: "100%", display: "flex", alignItems: "center", gap: 3 }}
        >
          {save.logAnswers?.map((content, index) => {
            // define color of global box : red if bad answer ever
            let colorBox = "";
            let totalScoreGot = -1;
            let totalResidentsGot = -1;
            if (
              displayAnswer.get(content.question)?.questionType != "texte" &&
              displayAnswer.get(content.question)?.questionType !=
                "texte_fete" &&
              displayAnswer.get(content.question)?.questionType != "texte_ville"
            ) {
              totalScoreGot = 0;
              totalResidentsGot = 0;
              content.answers.forEach((answer) => {
                totalScoreGot += answer.score;
                totalResidentsGot += answer.nbResidents;
              });
            }

            //Define box color based on residents got
            if (displayAnswer.get(content.question)?.scoreMaxPossible == 0) {
              if (
                displayAnswer.get(content.question)?.nbResidentsMaxPossible == 0
              )
                colorBox = "";
              else if (totalResidentsGot == 0) colorBox = colors.failed;
              else if (
                totalResidentsGot > 0 &&
                totalResidentsGot <
                  displayAnswer.get(content.question)?.nbResidentsMaxPossible
              )
                colorBox = colors.medium;
              else if (
                totalResidentsGot ==
                displayAnswer.get(content.question)?.nbResidentsMaxPossible
              )
                colorBox = colors.success;
            }
            // Define box color based on score
            else if (totalScoreGot == 0) colorBox = colors.failed;
            else if (
              totalScoreGot > 0 &&
              totalScoreGot <
                displayAnswer.get(content.question)?.scoreMaxPossible
            )
              colorBox = colors.medium;
            else if (
              totalScoreGot ==
              displayAnswer.get(content.question)?.scoreMaxPossible
            )
              colorBox = colors.success;

            return (
              <Box
                key={index}
                width={"90%"}
                border={"1px solid gray"}
                borderRadius={5}
                padding={2}
                bgcolor={colorBox}
              >
                {/* Question box */}
                <Box
                  width={"100%"}
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"center"}
                  gap={2}
                  onClick={() => {
                    handleDisplayAnswer(content.question);
                  }}
                >
                  {/* Thematic */}
                  <Box width={"100%"}>
                    <Typography
                      textColor={colors.titleBackLight}
                      width={"15%"}
                      textAlign={"center"}
                      level="h4"
                      border={`4px solid ${colors.titleBackLight}`}
                      borderRadius={5}
                      fontWeight={"bold"}
                      bgcolor={colors.buttonLight}
                    >{`${content.thematic?.name}`}</Typography>
                  </Box>
                  <Typography
                    textAlign={"justify"}
                    level="title-md"
                    width={"100%"}
                  >{`${index + 1}. ${content.question}`}</Typography>
                  <Box width={"30%"}>
                    <IconButtonCustom
                      icon={<CgArrowBottomRightR size={30} />}
                      text={
                        displayAnswer.get(content.question)?.display
                          ? `Masquer les réponses`
                          : `Voir les réponses`
                      }
                      textColor={colors.titleBackDark}
                      bgcolor={colors.buttonDark}
                      hoverColor={colors.buttonDarkHover}
                    />
                  </Box>
                </Box>

                {displayAnswer.get(content.question) && <Divider />}

                {/* Answer box */}
                <Box
                  marginTop={2}
                  display={
                    displayAnswer.get(content.question)?.display
                      ? "flex"
                      : "none"
                  }
                  flexDirection={"row"}
                  justifyContent={"center"}
                  width={"100%"}
                  flexWrap={"wrap"}
                >
                  {/* Left side */}
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    gap={1}
                    width={"49%"}
                  >
                    <Typography
                      level="title-md"
                      textColor={colors.titleBackLight}
                    >
                      REPONSES SOUMISES
                    </Typography>
                    <Divider />
                    {content.answers?.map((answer, index) => {
                      return (
                        <Box
                          key={index}
                          width={"80%"}
                          bgcolor={colors.buttonLight}
                          padding={2}
                          borderRadius={5}
                          display={"flex"}
                          flexDirection={"column"}
                          alignItems={"center"}
                          justifyContent={"space-between"}
                          gap={1}
                          marginLeft={1}
                          boxShadow={"rgba(0, 0, 0, 0.35) 0px 5px 15px"}
                        >
                          <Typography
                            textAlign={"center"}
                            level="title-sm"
                            textColor={colors.titleBackLight}
                            fontWeight={"bold"}
                          >{`${answer.content}`}</Typography>

                          {/* Score and residents displaying  */}
                          <Box display={"flex"} gap={2}>
                            <Typography
                              level="title-md"
                              textColor={colors.titleBackLight}
                              border={`4px solid ${colors.titleBackLight}`}
                              borderRadius={5}
                              padding={0.5}
                            >{`Score: ${answer.score}`}</Typography>

                            <Typography
                              level="title-md"
                              textColor={colors.titleBackLight}
                              border={`4px solid ${colors.titleBackLight}`}
                              borderRadius={5}
                              padding={0.5}
                            >{`Habitants gagnés: ${answer.nbResidents}`}</Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                  {/* Right side */}
                  {(content?.nbResidentsMaxPossible !== 0 ||
                    content?.scoreMaxPossible !== 0) && (
                    <>
                      {" "}
                      <Divider orientation="vertical" />
                      <Box
                        display={"flex"}
                        flexDirection={"column"}
                        gap={1}
                        width={"50%"}
                      >
                        <Typography
                          level="title-md"
                          textColor={colors.titleBackLight}
                        >
                          REPONSES LES MIEUX NOTES
                        </Typography>
                        <Divider />
                        {displayAnswer.get(content.question)?.questionType ==
                        "town"
                          ? stateTowns?.towns?.map((town, index) => {
                              if (
                                town.score ==
                                displayAnswer.get(content.question)
                                  ?.scoreMaxPossible /
                                  displayAnswer.get(content.question)
                                    ?.nbOfAnswersRequired
                              ) {
                                return (
                                  <Box
                                    key={index}
                                    width={"80%"}
                                    bgcolor={colors.success}
                                    padding={2}
                                    borderRadius={5}
                                    display={"flex"}
                                    flexDirection={"column"}
                                    alignItems={"center"}
                                    justifyContent={"space-between"}
                                    gap={1}
                                    marginLeft={1}
                                    boxShadow={
                                      "rgba(0, 0, 0, 0.35) 0px 5px 15px"
                                    }
                                  >
                                    <Typography
                                      textAlign={"center"}
                                      level="title-sm"
                                      textColor={colors.titleBackLight}
                                      fontWeight={"bold"}
                                    >{`${town.name}`}</Typography>

                                    {/* Score and residents displaying  */}
                                    <Box display={"flex"} gap={2}>
                                      <Typography
                                        level="title-md"
                                        textColor={colors.titleBackLight}
                                        border={`4px solid ${colors.titleBackLight}`}
                                        borderRadius={5}
                                        padding={0.5}
                                      >{`Score: ${town.score}`}</Typography>

                                      <Typography
                                        level="title-md"
                                        textColor={colors.titleBackLight}
                                        border={`4px solid ${colors.titleBackLight}`}
                                        borderRadius={5}
                                        padding={0.5}
                                      >{`Habitants gagnés: ${town.givenResidents}`}</Typography>
                                    </Box>
                                  </Box>
                                );
                              }
                            })
                          : displayAnswer
                              .get(content.question)
                              ?.allQuestionAnswers?.map((answer, index) => {
                                // Display the right answer based on score or nb of residents
                                if (
                                  (answer.score ==
                                    displayAnswer.get(content.question)
                                      ?.scoreMaxPossible /
                                      displayAnswer.get(content.question)
                                        ?.nbOfAnswersRequired &&
                                    answer.score > 0) ||
                                  (answer.givenResidents > 0 &&
                                    answer.givenResidents ==
                                      displayAnswer.get(content.question)
                                        ?.nbResidentsMaxPossible)
                                ) {
                                  return (
                                    <Box
                                      key={index}
                                      width={"80%"}
                                      bgcolor={colors.success}
                                      padding={2}
                                      borderRadius={5}
                                      display={"flex"}
                                      flexDirection={"column"}
                                      alignItems={"center"}
                                      justifyContent={"space-between"}
                                      gap={1}
                                      marginLeft={1}
                                      boxShadow={
                                        "rgba(0, 0, 0, 0.35) 0px 5px 15px"
                                      }
                                    >
                                      <Typography
                                        textAlign={"center"}
                                        level="title-sm"
                                        textColor={colors.titleBackLight}
                                        fontWeight={"bold"}
                                      >{`${answer.text.content}`}</Typography>

                                      {/* Score and residents displaying  */}
                                      <Box display={"flex"} gap={2}>
                                        <Typography
                                          level="title-md"
                                          textColor={colors.titleBackLight}
                                          border={`4px solid ${colors.titleBackLight}`}
                                          borderRadius={5}
                                          padding={0.5}
                                        >{`Score: ${answer.score}`}</Typography>

                                        <Typography
                                          level="title-md"
                                          textColor={colors.titleBackLight}
                                          border={`4px solid ${colors.titleBackLight}`}
                                          borderRadius={5}
                                          padding={0.5}
                                        >{`Habitants gagnés: ${answer.givenResidents}`}</Typography>
                                      </Box>
                                    </Box>
                                  );
                                }
                              })}
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
            );
          })}
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default ModalAnswerDetail;
