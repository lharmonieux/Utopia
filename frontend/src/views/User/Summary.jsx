import {
  Box,
  Button,
  CircularProgress,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
  Typography,
} from "@mui/joy";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PICTURES_DIR } from "../../utils/constants";
import { backgroundSize } from "../../utils/backgroundSizeProvider";
import { colors } from "../../utils/colors";
import { useEffect, useState } from "react";

const Summary = () => {
  const stateActs = useSelector((state) => state.act);
  const stateUser = useSelector((state) => state.user);
  const domConfig = useSelector((state) => state.dom);
  const navigate = useNavigate();
  const [openModalFeelings, setOpenModalFeelings] = useState(false);

  useEffect(() => {
    if (
      stateUser.feelings?.length == 0 &&
      stateUser.saves?.length == stateActs.acts?.length
    ) {
      setOpenModalFeelings(true);
    }
  }, [stateUser, stateActs]);

  const modalFeelings = () => {
    return (
      <Modal
        open={openModalFeelings}
        onClose={() => setOpenModalFeelings(false)}
      >
        <ModalDialog
          sx={{
            width: parseInt(domConfig.width),
            height: parseInt(domConfig.height * 0.9),
            position: "relative",
            padding: 0,
          }}
        >
          <ModalClose variant="outlined" />

          {/* Background */}
          <video
            autoPlay
            muted
            loop
            width={"100%"}
            height={"100%"}
            style={{ zIndex: -1000, position: "fixed" }}
          >
            <source
              src={`${PICTURES_DIR}/background_videos/vecteezy_exo-planet-with-rings-animation-4k_25272383_367.mp4`}
              type="video/mp4"
            />
          </video>

          <Stack
            paddingTop={"5%"}
            spacing={2}
            direction={"column"}
            height={"100%"}
            width={"100%"}
            flexWrap={"wrap"}
            useFlexGap
            position={"relative"}
            zIndex={1}
          >
            {/* Bravo Box */}
            <Box
              height={"30%"}
              width={"50%"}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems={"center"}
              zIndex={1}
            >
              <Typography level="h3" fontWeight={600} textColor={"white"}>
                BRAVO,
              </Typography>
              <Typography
                level="title-md"
                fontWeight={400}
                textColor={"white"}
                textAlign={"center"}
              >
                {"vous venez de vivre l'aventure Exploria."} <br />{" "}
                {"Alors, qu'en retenez-vous ?"}
              </Typography>
            </Box>
          </Stack>
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
          sx={{
            backgroundImage: `url(${PICTURES_DIR}/sommaire_bg.jpg)`,
            backgroundSize: backgroundSize(domConfig.width, domConfig.height),
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
              <Stack key={act._id} spacing={2} direction={"row"}>
                <Box
                  width={parseInt(domConfig.width * 0.6)}
                  height={parseInt(domConfig.height * 0.1)}
                  display={"flex"}
                  alignItems={"center"}
                  sx={{
                    backgroundImage: `url(${actRowImg})`,
                    backgroundSize: backgroundSize(
                      domConfig.width * 0.6,
                      domConfig.height * 0.1
                    ),
                  }}
                >
                  <Typography
                    level="title-lg"
                    textColor={"white"}
                    fontWeight={400}
                    marginLeft={"8%"}
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
                  >
                    {`${act.name}`}
                  </Typography>
                </Box>

                {/* Play button */}
                {act.status == "IN PROGRESS" && (
                  <Button
                    onClick={() => navigate("/game")}
                    sx={{
                      bgcolor: colors.buttonLight,
                      "&:hover": { bgcolor: colors.buttonLightHover },
                    }}
                  >
                    {"Continuer l'aventure"}
                  </Button>
                )}
              </Stack>
            );
          })}
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

      {/* logo */}
      <Box top={"0%"} left={"15%"} position={"absolute"}>
        <img
          src={`${PICTURES_DIR}/Logo - couleurs + blanc.svg`}
          width={domConfig.width * 0.45}
          height={domConfig.height * 0.3}
        />
      </Box>

      {/* decoration  */}
      <Box position={"absolute"} top={0} left={0}>
        <img
          src={`${PICTURES_DIR}/Déco - Charte triangle.svg`}
          height={domConfig.height * 0.2}
          width={domConfig.width * 0.15}
          style={{ transform: "rotate(180deg)" }}
        />
      </Box>

      <Box position={"absolute"} bottom={-4} right={0}>
        <img
          src={`${PICTURES_DIR}/Déco - Charte triangle.svg`}
          height={domConfig.height * 0.3}
          width={domConfig.width * 0.15}
        />
      </Box>

      {openModalFeelings && modalFeelings()}
    </>
  );
};

export default Summary;
