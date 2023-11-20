/* eslint-disable react/prop-types */
import { Box, CircularProgress, CssVarsProvider, Typography } from "@mui/joy";
import "animate.css";
import { useEffect, useState } from "react";
import { scale } from "@cloudinary/url-gen/actions/resize";
import { AdvancedImage, responsive } from "@cloudinary/react";
import { typographyTheme } from "../utils/themeJoy";
import { colors } from "../utils/colors";
import { byAngle } from "@cloudinary/url-gen/actions/rotate";

const ActPresentation = ({
  act,
  setShowActPresentation,
  setShowMainContent,
  actPresentationImg,
  decorationImg,
  titleActImg,
  logoAppImg,
  reversedDecorationImg,
}) => {
  const [widthMainContent, setWidthMainContent] = useState(0);
  const [heightMainContent, setHeightMainContent] = useState(0);
  const [actPresentationBox, setActPresentationBox] = useState();

  useEffect(() => {
    setActPresentationBox(document.querySelector("#act-presentation-box"));
    if (actPresentationBox) {
      //Size DOM Container
      setWidthMainContent(actPresentationBox.clientWidth);
      setHeightMainContent(actPresentationBox.clientHeight);

      const delay = setTimeout(() => {
        actPresentationBox.classList.add(
          "animate__animated",
          "animate__fadeOut"
        );
        actPresentationBox.addEventListener("animationend", () => {
          setShowActPresentation(false);
          setShowMainContent(true);
        });
      }, 4000);

      return () => clearTimeout(delay);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actPresentationBox]);

  return (
    <CssVarsProvider theme={typographyTheme}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems={"center"}
        height="97vh"
        width="99vw"
      >
        <Box height={"100%"} width={"70%"} id={"act-presentation-box"}>
          {heightMainContent && widthMainContent ? (
            <Box
              height={heightMainContent}
              width={widthMainContent}
              position={"relative"}
              sx={{
                borderRadius: 5,
                backgroundImage: `url(${actPresentationImg
                  .resize(
                    scale().height(heightMainContent).width(widthMainContent)
                  )
                  .format("png")
                  .toURL()})`,
              }}
              className={`animate__animated animate__fadeIn`}
            >
              {/* Main content flex*/}
              <Box
                height={heightMainContent}
                width={widthMainContent}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                {/* logo */}
                <Box
                  marginTop={7}
                  height={parseInt(heightMainContent * 0.3)}
                  width={parseInt(widthMainContent * 0.45)}
                >
                  <AdvancedImage
                    cldImg={logoAppImg.resize(
                      scale()
                        .height(parseInt(heightMainContent * 0.3))
                        .width(parseInt(widthMainContent * 0.45))
                    )}
                  />
                </Box>

                {/* title */}
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  height={parseInt(heightMainContent * 0.1)}
                  width={parseInt(widthMainContent * 0.25)}
                  sx={{
                    backgroundImage: `url(${titleActImg
                      .resize(
                        scale()
                          .height(parseInt(heightMainContent * 0.1))
                          .width(parseInt(widthMainContent * 0.25))
                      )
                      .toURL()})`,
                  }}
                >
                  <Typography
                    level="h2"
                    textColor={colors.titleBackLight}
                    fontWeight={400}
                  >
                    ACTE {act?.chapter}
                  </Typography>
                </Box>

                <Typography level="h1" textColor={"white"} fontWeight={400}>
                  {act?.name}
                </Typography>
              </Box>

              {/* Decoration  */}
              <Box position={"absolute"} top={0} left={0}>
                <AdvancedImage
                  cldImg={reversedDecorationImg.rotate(byAngle(180)).resize(
                    scale()
                      .width(parseInt(widthMainContent * 0.35))
                      .height(parseInt(heightMainContent * 0.48))
                  )}
                  plugins={[responsive({ steps: 200 })]}
                />
              </Box>

              <Box position={"absolute"} bottom={-4} right={0}>
                <AdvancedImage
                  cldImg={decorationImg.resize(
                    scale()
                      .width(parseInt(widthMainContent * 0.15))
                      .height(parseInt(heightMainContent * 0.3))
                  )}
                  plugins={[responsive({ steps: 200 })]}
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
      </Box>
    </CssVarsProvider>
  );
};

export default ActPresentation;
