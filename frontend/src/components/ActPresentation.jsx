/* eslint-disable react/prop-types */
import { Box, CircularProgress, Typography } from "@mui/joy";
import "animate.css";
import { useEffect, useState } from "react";
import { colors } from "../utils/colors";
import { useSelector } from "react-redux";

const ActPresentation = ({
  setShowActPresentation,
  setShowMainContent,
  actPresentationImg,
  decorationImg,
  titleActImg,
  logoAppImg,
}) => {
  const stateActs = useSelector((state) => state.act);
  const [actPresentationBox, setActPresentationBox] = useState();

  useEffect(() => {
    setActPresentationBox(document.querySelector("#act-presentation-box"));
    if (actPresentationBox) {
      const delay = setTimeout(() => {
        actPresentationBox.classList.add(
          "animate__animated",
          "animate__fadeOut"
        );
        actPresentationBox.addEventListener("animationend", () => {
          setShowActPresentation(false);
          setShowMainContent(false);
        });
      }, 4000);

      return () => clearTimeout(delay);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actPresentationBox]);

  return (
    <Box height={"100%"} width={"100%"} id={"act-presentation-box"}>
      {actPresentationImg && logoAppImg && titleActImg && decorationImg ? (
        <Box
          height={"100%"}
          width={"100%"}
          position={"relative"}
          sx={{
            borderRadius: 5,
            backgroundImage: `url(${actPresentationImg})`,
            backgroundSize: "100% 100%",
          }}
          className={`animate__animated animate__fadeIn`}
        >
          {/* Main content flex*/}
          <Box
            height={"100%"}
            width={"100%"}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            {/* logo */}
            <Box marginTop={7} height={"30%"} width={"45%"}>
              <img src={logoAppImg} width={"100%"} height={"100%"} />
            </Box>

            {/* title */}
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              height={"10%"}
              width={"25%"}
              sx={{
                backgroundImage: `url(${titleActImg})`,
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
              }}
            >
              <Typography
                level="h2"
                textColor={colors.titleBackLight}
                fontWeight={400}
              >
                ACTE {stateActs.currentAct?.chapter}
              </Typography>
            </Box>

            <Typography level="h1" textColor={"white"} fontWeight={400}>
              {stateActs.currentAct?.name}
            </Typography>
          </Box>

          {/* Decoration  */}
          <Box
            position={"absolute"}
            top={"-1.5%"}
            left={0}
            width={"35%"}
            height={"48%"}
          >
            <img
              src={decorationImg}
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
            <img src={decorationImg} height={"100%"} width={"100%"} />
          </Box>
        </Box>
      ) : (
        <Box
          height={"100%"}
          width={"100%"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <CircularProgress variant="soft" color="success" />
        </Box>
      )}
    </Box>
  );
};

export default ActPresentation;
