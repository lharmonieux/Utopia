/* eslint-disable react/prop-types */
import { Box, CircularProgress, Typography } from "@mui/joy";
import "animate.css";
import { useEffect, useState } from "react";
import { colors } from "../utils/colors";
import { useSelector } from "react-redux";
import { backgroundSize } from "../utils/backgroundSizeProvider";

const ActPresentation = ({
  setShowActPresentation,
  setShowMainContent,
  actPresentationImg,
  decorationImg,
  titleActImg,
  logoAppImg,
}) => {
  const stateActs = useSelector((state) => state.act);
  const domConfig = useSelector((state) => state.dom);
  const [actPresentationBox, setActPresentationBox] = useState();

  useEffect(() => {
    setActPresentationBox(document.querySelector("#act-presentation-box"));
    if (actPresentationBox) {
      //Size DOM Container
      // setWidthMainContent(actPresentationBox.clientWidth);
      // setHeightMainContent(actPresentationBox.clientHeight);

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
          height={domConfig.height}
          width={domConfig.width}
          position={"relative"}
          sx={{
            borderRadius: 5,
            backgroundImage: `url(${actPresentationImg})`,
            backgroundSize: backgroundSize(domConfig.width, domConfig.height),
          }}
          className={`animate__animated animate__fadeIn`}
        >
          {/* Main content flex*/}
          <Box
            height={domConfig.height}
            width={domConfig.width}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            {/* logo */}
            <Box
              marginTop={7}
              height={parseInt(domConfig.height * 0.3)}
              width={parseInt(domConfig.width * 0.45)}
            >
              <img
                src={logoAppImg}
                width={domConfig.width * 0.45}
                height={domConfig.height * 0.3}
              />
            </Box>

            {/* title */}
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              height={parseInt(domConfig.height * 0.1)}
              width={parseInt(domConfig.width * 0.25)}
              sx={{
                backgroundImage: `url(${titleActImg})`,
                backgroundSize: backgroundSize(
                  domConfig.width * 0.25,
                  domConfig.height * 0.1
                ),
                backgroundRepeat: 'no-repeat'
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
          <Box position={"absolute"} top={0} left={0}>
            <img
              src={decorationImg}
              height={domConfig.height * 0.48}
              width={domConfig.width * 0.35}
              style={{transform: 'rotate(180deg)'}}
            />
          </Box>

          <Box position={"absolute"} bottom={-4} right={0}>
            <img
              src={decorationImg}
              height={domConfig.height * 0.3}
              width={domConfig.width * 0.15}
            />
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
