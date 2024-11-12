/* eslint-disable react/prop-types */
import { Box, Modal, ModalClose, ModalDialog, Typography } from "@mui/joy";
import { animateOut } from "../../../../middlewares/Animation";
import "animate.css";
import { colors } from "../../../../utils/colors";
import { PICTURES_DIR } from "../../../../utils/constants";
import DisplayingText from "../../../../components/DisplayingText";
import { IoInformationCircle } from "react-icons/io5";
import CustomButton from "../../../../components/CustomButton";
import { useEffect } from "react";

export const ModalFeedback = ({
  feedback,
  logAnswerModal,
  setLogAnswerModal,
  openFeedbackModal,
  stateActs,
  setOpenEndModal,
  actQuestionsLength,
  setOpenFeedbackModal,
  setIsModalFeedbackPassed,
}) => {
  useEffect(() => {
    let logAnswerModal = {
      text: { content: "" },
    };
    setLogAnswerModal(logAnswerModal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = () => {
    if (feedback.hasQuestion && !logAnswerModal.text.content) {
      setLogAnswerModal({ text: { content: "" } });
      return;
    }

    animateOut(openFeedbackModal, "#modal-feedback-content", () => {
      //Display end modal to summarize act
      if (stateActs.questionOrder == actQuestionsLength - 1) {
        setOpenEndModal(true);
        setOpenFeedbackModal(false);
      } else {
        setOpenFeedbackModal(false);
        setIsModalFeedbackPassed(true);
      }
    });
  };

  // Modal for feedbacks
  return (
    <Modal
      open={openFeedbackModal}
      onClose={() => handleSubmit()}
      className={"animate__animated animate__zoomIn animate__fast"}
      id={"modal-feedback-content"}
      sx={{ zIndex: 1000 }}
    >
      <ModalDialog
        sx={{
          width: "50%",
          height: "85%",
          backgroundImage: `url(${PICTURES_DIR}/${feedback?.img})`,
          backgroundSize: "100% 100%",
          position: "relative",
          paddingTop: "5%",
        }}
        id={"modal-feedback-box"}
      >
        <ModalClose variant="outlined" />
        <Box
          position={"absolute"}
          width={"85%"}
          height={"10%"}
          left={"14%"}
          top={"12%"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography
            level="h3"
            textColor={colors.titleBackLight}
            fontWeight={600}
            id={"modal-title"}
          >
            {feedback.title}
          </Typography>
        </Box>
        <Box
          width={"100%"}
          height={"100%"}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
          marginTop={"5%"}
        >
          <DisplayingText
            sentence={feedback.content}
            level="h4"
            textColor={"black"}
            animated={true}
            textAlign={"justify"}
            id={"modal-text"}
            padding={"5%"}
            style={{ width: "80%" }}
          />

          {/* Text area for some answers */}
          {feedback.hasQuestion && (
            <Box
              width={"80%"}
              display={"flex"}
              flexDirection={"column"}
              gap={3}
            >
              <textarea
                value={logAnswerModal.text.content}
                onChange={(e) =>
                  setLogAnswerModal({
                    text: { content: e.target.value },
                  })
                }
                rows={6}
                cols={40}
                style={{
                  resize: "none",
                  fontSize: window.innerWidth >= 1920 ? "1.7em" : "1em",
                }}
              />

              {!logAnswerModal.text.content && (
                <Typography
                  level="body-sm"
                  fontWeight={600}
                  textColor={"red"}
                  startDecorator={<IoInformationCircle />}
                >
                  Une réponse est requise
                </Typography>
              )}
            </Box>
          )}

          <Box width={"25%"} height={"8%"}>
            <CustomButton
              backgroundColor={colors.buttonLight}
              hoverColor={colors.buttonLightHover}
              width={"100%"}
              height={"100%"}
              clickMethod={handleSubmit}
              textColor={colors.titleBackLight}
            >
              Continuer
            </CustomButton>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
};
