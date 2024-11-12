/* eslint-disable react/prop-types */
import {
  Box,
  DialogContent,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
} from "@mui/joy";
import { PICTURES_DIR } from "../../../../utils/constants";

export const ModalDesc = ({
  openModal,
  setOpenModal,
  thematicToDesc,
  logScores,
}) => {
  return (
    <Modal
      open={openModal}
      onClose={() => setOpenModal(false)}
      className="animate__animated animate__zoomIn"
    >
      <ModalDialog
        sx={{
          backgroundImage: `url(${PICTURES_DIR}/background_images/bg_result_page.jpg)`,
          backgroundSize: "100% 100%",
          height: "80%",
          width: "60%",
        }}
      >
        <ModalClose variant="outlined" sx={{ zIndex: 10 }} />
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            // marginTop: "10%",
            height: "90%",
            width: "100%",
            gap: 10,
          }}
        >
          {/* Header */}
          <Box display={"flex"} alignItems={"center"} width={"100%"} gap={2}>
            {/* Title */}
            <Typography textColor={"white"} level="h2">
              {thematicToDesc.name}
            </Typography>
            {/* Gauge score  */}
            <Box
              height={"100%"}
              width={`70%`}
              position={"relative"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              {/* Gauge bar */}
              <img
                src={`${PICTURES_DIR}/results/Couleur_${thematicToDesc?.name}.svg`}
                height={"100%"}
                width={`${thematicToDesc.convertedScore * 10}%`}
                style={{ position: "absolute", left: 0 }}
              />
              <Typography
                level="title-lg"
                textColor={"white"}
                fontWeight={400}
                sx={{ zIndex: 100 }}
              >{`${thematicToDesc.convertedScore}/10`}</Typography>
            </Box>
          </Box>

          {/* Main content */}
          <Box
            width={"60%"}
            height={"70%"}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"space-between"}
            sx={{
              backgroundImage: `url(${PICTURES_DIR}/results/bg_detail.svg)`,
              backgroundSize: "100% 100%",
            }}
          >
            {/* Title */}
            <Typography level="h4" marginTop={"10%"}>
              {thematicToDesc?.convertedScore < 5
                ? logScores.get(thematicToDesc?.name)?.evaluation.weak.title
                : thematicToDesc?.convertedScore >= 5 &&
                  thematicToDesc?.convertedScore < 7
                ? logScores.get(thematicToDesc?.name)?.evaluation.medium.title
                : logScores.get(thematicToDesc?.name)?.evaluation.excellent
                    .title}
            </Typography>

            {/* Content */}
            <Typography level="body-md" textAlign={"center"} padding={"5%"}>
              {thematicToDesc?.convertedScore < 5
                ? logScores.get(thematicToDesc?.name)?.evaluation.weak.content
                : thematicToDesc?.convertedScore >= 5 &&
                  thematicToDesc?.convertedScore < 7
                ? logScores.get(thematicToDesc?.name)?.evaluation.medium.content
                : logScores.get(thematicToDesc?.name)?.evaluation.excellent
                    .content}
            </Typography>

            {/* Footer */}
            <Typography level="h4" textAlign={"center"} marginBottom={"10%"}>
              {thematicToDesc?.convertedScore < 5
                ? logScores.get(thematicToDesc?.name)?.evaluation.weak.footer
                : thematicToDesc?.convertedScore >= 5 &&
                  thematicToDesc?.convertedScore < 7
                ? logScores.get(thematicToDesc?.name)?.evaluation.medium.footer
                : logScores.get(thematicToDesc?.name)?.evaluation.excellent
                    .footer}
            </Typography>
          </Box>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};
