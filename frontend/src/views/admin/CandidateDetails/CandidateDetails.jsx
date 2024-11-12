/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Typography } from "@mui/joy";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ModalAnswerDetail from "./components/ModalAnswerDetail";
import { BiSolidDetail } from "react-icons/bi";
import IconButtonCustom from "../../../components/IconButtonCustom";
import { colors } from "../../../utils/colors";
import FormattedPageAdmin from "../FormattedPageAdmin";

const CandidateDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { gamer, currentProject } = location.state;

  const stateActs = useSelector((state) => state.act);

  //States
  const [notPlayed, setNotPlayed] = useState(true);
  const [openAnswerDetailModal, setOpenAnswerDetailModal] = useState(new Map());

  useEffect(() => {
    if (!gamer?.firstname || !currentProject?.name) {
      navigate("/admin/candidates");
    }

    if (gamer?.saves?.length !== 0) {
      setNotPlayed(false);
    }
  }, [gamer.saves]);

  useEffect(() => {
    let openAnswerDetailModalTmp = new Map();
    gamer?.saves?.forEach((save) => {
      openAnswerDetailModalTmp.set(save._id, false);
    });

    setOpenAnswerDetailModal(openAnswerDetailModalTmp);
  }, []);

  return (
    <FormattedPageAdmin
      headerTitle={`${gamer.lastname} ${gamer.firstname}`}
      justifyContent={notPlayed ? "flex-start" : "center"}
      backPage={{ pathname: "/admin/candidates", state: { currentProject } }}
      gap={2}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"space-evenly"}
        width={"100%"}
        height={"100%"}
        gap={2}
      >
        <Typography level="h2">
          {`Actes restants à jouer: ${
            stateActs?.acts?.length - gamer?.saves?.length
          }`}
        </Typography>
        <Box
          display={"flex"}
          gap={2}
          alignItems={"center"}
          justifyContent={"center"}
          width={"100%"}
          height={"80%"}
          flexWrap={"wrap"}
        >
          {!notPlayed ? (
            gamer?.saves?.map((save) => {
              let maxActScorePossible = 0;
              let maxActScoreGot = 0;

              save.logAnswers.forEach((e) => {
                maxActScorePossible += e.scoreMaxPossible;
                if (e.answers.length > 1) {
                  e.answers.forEach((answer) => {
                    maxActScoreGot += answer.score;
                  });
                } else {
                  maxActScoreGot += e.answers[0].score;
                }
              });

              const successRate =
                Math.floor((maxActScoreGot / maxActScorePossible) * 10000) /
                100;

              return (
                <Box
                  width={"20%"}
                  height={"45%"}
                  key={save._id}
                  bgcolor={successRate > 50 ? colors.success : colors.failed}
                  sx={{ cursor: "pointer" }}
                  display={"flex"}
                  flexDirection={"column"}
                  flexWrap={"wrap"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  borderRadius={10}
                  gap={3}
                >
                  <Typography
                    level="title-md"
                    textColor={"black"}
                    fontWeight={"bold"}
                  >
                    {`Acte ${save.act.chapterNumber}`}
                  </Typography>
                  <Typography
                    level="title-md"
                    textAlign={"center"}
                    textColor={"black"}
                    fontWeight={"bold"}
                  >
                    {`Taux de réussite : ${successRate}%`}
                  </Typography>

                  <Box width={"70%"} height={"10%"}>
                    <IconButtonCustom
                      bgcolor={colors.buttonLight}
                      hoverColor={colors.buttonLightHover}
                      textColor={colors.titleBackLight}
                      icon={<BiSolidDetail size={20} />}
                      text={"Détails"}
                      border={"none"}
                      onClick={() => {
                        let openAnswerDetailModalTmp = new Map();
                        for (let [key, value] of openAnswerDetailModal) {
                          key == save._id
                            ? openAnswerDetailModalTmp.set(key, !value)
                            : openAnswerDetailModalTmp.set(key, false);
                        }
                        setOpenAnswerDetailModal(openAnswerDetailModalTmp);
                      }}
                    />
                  </Box>

                  {openAnswerDetailModal?.get(save._id) && (
                    <ModalAnswerDetail
                      open={openAnswerDetailModal}
                      setOpen={setOpenAnswerDetailModal}
                      gamer={gamer}
                      save={save}
                    />
                  )}
                </Box>
              );
            })
          ) : (
            <Typography level="h2" textAlign={"center"}>
              {`Le joueur n'a fini aucun acte`}
            </Typography>
          )}
        </Box>
      </Box>
    </FormattedPageAdmin>
  );
};

export default CandidateDetails;
