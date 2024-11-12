import { Box, Modal, ModalClose, ModalDialog, Typography } from "@mui/joy";
import apiRequest from "../../../../api/requestAPI";
import { createUserError } from "../../../../utils/redux/userSlice";
import { PICTURES_DIR } from "../../../../utils/constants";
import { IoInformationCircle } from "react-icons/io5";
import { textAreaStyle } from "../../../../utils/cssReact";
import CustomButton from "../../../../components/CustomButton";
import { colors } from "../../../../utils/colors";

/* eslint-disable react/prop-types */
export const ModalComments = ({
  commentsAnswer,
  setCommentsAnswer,
  stateUser,
  authState,
  dispatch,
  navigate,
  stateComments,
  openModalComments,
  setOpenModalComments,
}) => {
  const handleTextArea = (e, comment) => {
    let newcommentsAnswer = new Map(commentsAnswer);
    newcommentsAnswer.set(comment, {
      answer: e.target.value,
      noAnswer: false,
    });
    setCommentsAnswer(newcommentsAnswer);
  };

  const handleFormError = () => {
    //Check if all textarea contain text
    const itrcommentsAnswer = new Map(commentsAnswer);
    const iterator = itrcommentsAnswer.entries();
    let hasError = false;

    for (let i = 0; i < itrcommentsAnswer.size; i++) {
      let objAnswer = iterator.next().value;
      if (!objAnswer[1].answer) {
        itrcommentsAnswer.set(objAnswer[0], {
          ...objAnswer[1],
          noAnswer: true,
        });
        hasError = true;
      } else {
        itrcommentsAnswer.set(objAnswer[0], {
          ...objAnswer[1],
          noAnswer: false,
        });
      }
    }

    setCommentsAnswer(itrcommentsAnswer);
    return hasError;
  };

  const submitComments = () => {
    const formError = handleFormError();
    if (formError) return;

    //Formatting comments answers to save
    let commentsAnswerToSave = [];
    for (let [key, value] of commentsAnswer) {
      commentsAnswerToSave.push({ question: key._id, answer: value.answer });
    }

    //Save comments answers
    const userToSave = {
      comments: commentsAnswerToSave,
    };

    apiRequest("users/update", "patch", authState.token, {
      data: { userToSave, idUser: stateUser.idUser },
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
    <Modal open={openModalComments} onClose={() => setOpenModalComments(false)}>
      <ModalDialog
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          padding: 0,
          width: "70%",
          height: "70%",
        }}
        id={"recap-modal"}
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
          style={{ position: "absolute" }}
        >
          <source
            src={`${PICTURES_DIR}/background_videos/vecteezy_exo-planet-with-rings-animation-4k_25272383_367.mp4`}
            type="video/mp4"
          />
        </video>

        <Box
          paddingTop={"5%"}
          gap={2}
          display={"flex"}
          flexDirection={"column"}
          height={"80%"}
          width={"100%"}
          flexWrap={"wrap"}
          position={"relative"}
          zIndex={10}
        >
          {/* Bravo Box */}
          <Box
            height={"25%"}
            width={"50%"}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Typography level="h3" fontWeight={600} textColor={"white"}>
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

          {/* Question and Answers */}
          {stateComments?.comments?.map((comment, index) => (
            <Box
              key={index}
              height={"27%"}
              width={"45%"}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              {" "}
              <Typography
                level="title-md"
                textColor={"white"}
                fontWeight={500}
                paddingLeft={"10%"}
                paddingRight={"10%"}
                borderRadius={10}
                sx={{
                  bgcolor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                {comment.question}
              </Typography>
              {/* textarea */}
              <Box
                height={"100%"}
                width={"80%"}
                sx={{
                  backgroundImage: `url(${PICTURES_DIR}/textarea_end.svg)`,
                  backgroundSize: "100% 100%",
                  border: commentsAnswer.get(comment).noAnswer && "solid 2px",
                  borderColor: commentsAnswer.get(comment).noAnswer && "red",
                  borderRadius: commentsAnswer.get(comment).noAnswer && "15%",
                }}
              >
                <textarea
                  style={{ ...textAreaStyle, width: "90%" }}
                  value={commentsAnswer.get(comment).answer}
                  onChange={(e) => handleTextArea(e, comment)}
                  placeholder="Entrez votre réponse..."
                />
                {commentsAnswer.get(comment).noAnswer && (
                  <Typography
                    marginTop={"-2%"}
                    level="body-xs"
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
        </Box>

        {/* Submit Button */}
        <CustomButton
          width={"15%"}
          height={"10%"}
          clickMethod={submitComments}
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
