import "../../../assets/css/fullHD.css";
import { Box, Stack, Typography } from "@mui/joy";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PICTURES_DIR } from "../../../utils/constants";
import { colors } from "../../../utils/colors";
import { useEffect, useState } from "react";
import "animate.css";
import CustomButton from "../../../components/CustomButton";
import "../../../assets/css/1024screen.css";
import "../../../assets/css/800screen.css";
import { ModalComments } from "./components/ModalComments";
// import { jwtDecode } from "jwt-decode";
import Loading from "../../Loading";
import FormattedPageUser from "../FormattedPageUser";

const Summary = () => {
  const stateActs = useSelector((state) => state.act);
  const stateUser = useSelector((state) => state.user);
  const stateComments = useSelector((state) => state.comment);
  const authState = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openModalComments, setOpenModalComments] = useState(false);
  const [commentsAnswer, setCommentsAnswer] = useState(new Map());

  useEffect(() => {
    if (
      stateUser.comments.length == 0 &&
      stateUser.saves?.length == stateActs.acts?.length
    ) {
      //Data structure for save feelings answers with textarea content
      const newCommentsAnswer = new Map();
      for (let comment of stateComments.comments) {
        newCommentsAnswer.set(comment, { answer: "", noAnswer: false });
      }
      setCommentsAnswer(newCommentsAnswer);
      setOpenModalComments(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateUser.comments, stateActs.acts]);

  return (
    <>
      {stateActs.acts ? (
        <FormattedPageUser
          headerTitle={"Sommaire"}
          backPage={{ pathname: "/user", state: {} }}
        >
          <Box
            width={"100%"}
            height={"100%"}
            position={"relative"}
            borderRadius={10}
            sx={{
              backgroundImage: `url(${PICTURES_DIR}/sommaire_bg.jpg)`,
              backgroundSize: "100% 100%",
            }}
          >
            {/* Main content */}
            <Box
              width={"100%"}
              height={"100%"}
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              gap={2}
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
                        level="h4"
                        textColor={"white"}
                        fontWeight={600}
                        marginLeft={"8%"}
                        id={"summary-title-act"}
                      >
                        {`ACTE ${act.chapterNumber}`}
                      </Typography>

                      <Typography
                        level="h4"
                        textColor={
                          act.status == "DONE"
                            ? colors.titleBackLight
                            : colors.titleBackDark
                        }
                        fontWeight={400}
                        marginLeft={"7%"}
                        id={"summary-text-act"}
                      >
                        {`${act.name}`}
                      </Typography>
                    </Box>

                    {/* Play button */}
                    {act.status == "IN PROGRESS" && (
                      <Box height={"6vh"} width={"22%"} id={"summary-button"}>
                        <CustomButton
                          width={"100%"}
                          height={"100%"}
                          clickMethod={() => navigate("/game")}
                          backgroundColor={colors.buttonLight}
                          hoverColor={colors.buttonLightHover}
                        >
                          {act.chapterNumber == 1
                            ? "Commencer à jouer"
                            : "Continuer l'aventure"}
                        </CustomButton>
                      </Box>
                    )}
                  </Stack>
                );
              })}

              {/* See recap */}
              {stateUser.nbOfSaves == stateActs.acts.length && (
                <Box height={"5%"}>
                  <CustomButton
                    height={"100%"}
                    clickMethod={() => navigate("/result")}
                  >
                    Voir les résultats
                  </CustomButton>
                </Box>
              )}
            </Box>

            {/* decoration  */}
            <Box
              position={"absolute"}
              top={"0%"}
              left={"0%"}
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

            {openModalComments && (
              <ModalComments
                commentsAnswer={commentsAnswer}
                setCommentsAnswer={setCommentsAnswer}
                stateUser={stateUser}
                authState={authState}
                dispatch={dispatch}
                navigate={navigate}
                stateComments={stateComments}
                openModalComments={openModalComments}
                setOpenModalComments={setOpenModalComments}
              />
            )}
          </Box>
        </FormattedPageUser>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Summary;
