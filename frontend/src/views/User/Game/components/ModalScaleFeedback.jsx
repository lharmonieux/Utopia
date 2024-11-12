/* eslint-disable react/prop-types */
import { Box, Modal, ModalClose, ModalDialog, Typography } from "@mui/joy";
import { animateOut } from "../../../../middlewares/Animation";
import { PICTURES_DIR } from "../../../../utils/constants";
import { colors } from "../../../../utils/colors";
import CustomButton from "../../../../components/CustomButton";
import { storeMotto } from "../../../../utils/redux/userSlice";

export default function ModalScaleFeedback({
  scaleAnswers,
  setOpenScaleModal,
  setShowAlertNoAnswer,
  stateActs,
  openScaleModal,
  dispatch,
  setIsModalFeedbackPassed,
  setObjectMottoSelected,
}) {
  let choosenMotto;
  let animationModalIn = "animate__animated animate__zoomIn animate__fast";

  if (scaleAnswers) {
    let idChoosenMotto = null;
    let score = 0;

    // Get id of max scored motto
    scaleAnswers.forEach((value, key) => {
      if (value > score) {
        score = value;
        idChoosenMotto = key;
      }
    });

    // Alert if no answer
    if (score == 1) {
      setOpenScaleModal(false);
      setShowAlertNoAnswer(true);
    }

    //Result : choosen motto
    choosenMotto = stateActs.currentQuestion?.answers?.filter(
      (answer) => answer._id == idChoosenMotto
    );
  }

  return (
    <Modal
      open={openScaleModal}
      onClose={() =>
        animateOut(openScaleModal, "#modal-scale", () =>
          setOpenScaleModal(false)
        )
      }
      className={animationModalIn}
      id={"modal-scale"}
    >
      <ModalDialog
        sx={{
          width: "30%",
          height: "70%",
          position: "relative",
          backgroundImage: `url(${PICTURES_DIR}/${stateActs.currentQuestion?.answers[0]?.feedback?.img})`,
          backgroundSize: "100% 100%",
        }}
      >
        <ModalClose variant="outlined" />

        {/* Title */}
        <Box
          position={"absolute"}
          top={"15%"}
          left={"40%"}
          id={"modal-scale-feedback-title"}
        >
          <Typography level="h3" textColor={colors.titleBackLight}>
            Votre devise
          </Typography>
        </Box>

        {/* Main content */}
        <Box
          width={"100%"}
          height={"60%"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"space-evenly"}
          alignItems={"center"}
          marginTop={"30%"}
        >
          <Typography
            textAlign={"justify"}
            id={"modal-scale-feedback-text"}
            width={"80%"}
            level="title-md"
          >
            En se basant sur vos notes, la devise qui vous convient le mieux est
            :{" "}
          </Typography>
          <Typography fontWeight={"bold"} fontStyle={"italic"} level="title-md">
            {choosenMotto && choosenMotto[0]?.text?.content}
          </Typography>

          <Box
            width={"100%"}
            height={"15%"}
            display={"flex"}
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"space-evenly"}
          >
            {/* Left button */}
            <CustomButton
              backgroundColor={colors.buttonLight}
              hoverColor={colors.buttonLightHover}
              height={"100%"}
              textColor={colors.titleBackLight}
              clickMethod={() =>
                animateOut(openScaleModal, "#modal-scale", () => {
                  setShowAlertNoAnswer(false);
                  setOpenScaleModal(false);
                })
              }
            >
              Retour au choix
            </CustomButton>

            {/* Right button */}
            <CustomButton
              backgroundColor={colors.buttonLight}
              hoverColor={colors.buttonLightHover}
              height={"100%"}
              textColor={colors.titleBackLight}
              clickMethod={() => {
                animateOut(openScaleModal, "#modal-scale", () => {
                  setOpenScaleModal(false);
                  dispatch(storeMotto(choosenMotto[0]?.text?.content));
                  setObjectMottoSelected(choosenMotto[0]);
                  setIsModalFeedbackPassed(true);
                });
              }}
            >
              Continuer
            </CustomButton>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
