import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "./admin/GameContext.jsx";
import { Box, Stack, Button, Typography, CssVarsProvider, CircularProgress } from "@mui/joy";
import cloudinary from "../utils/cloudinary.js";
import { scale } from "@cloudinary/url-gen/actions/resize";
import "animate.css";
import { AdvancedImage, responsive } from "@cloudinary/react";
import { typographyTheme } from "../utils/themeJoy.js";
import { colors } from "../utils/colors.js";

const Home = () => {
  const [backgroundImg, setBackgroundImg] = useState("");
  const [containerMainContent, setContainerMainContent] = useState();
  const [widthMainContent, setWidthMainContent] = useState(0);
  const [heightMainContent, setHeightMainContent] = useState(0);
  const [imgPresentation, setImgPresentation] = useState("");
  const [logo, setLogo] = useState("");
  const [decoration, setDecoration] = useState("");
  const { loading } = useContext(AppContext);

  //Read Images
  useEffect(() => {
    setImgPresentation(
      cloudinary.image("exploria/1_p8okvj").quality("auto:best").format("png")
    );
    setLogo(cloudinary.image("exploria/Logo_-_couleurs_blanc_qhtptz"));
    setDecoration(
      cloudinary
        .image("exploria/Déco_-_Charte_triangle_fbnblh")
        .quality("auto:best")
        .format("png")
    );
    setBackgroundImg(
      cloudinary.image(
        "exploria/snowy-mountain-peak-starry-galaxy-majesty-generative-ai_f7ureo"
      )
    );

    //Get main DOM element
    setContainerMainContent(document.querySelector("#main-content"));
  }, [loading]);

  useEffect(() => {
    //Update sizes's states
    if (containerMainContent) {
      // Main content sizes
      setWidthMainContent(containerMainContent.clientWidth);
      setHeightMainContent(containerMainContent.clientHeight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerMainContent]);

  return (
    <div>
      {loading ? (
        <CircularProgress variant="soft" color="success"/>
      ) : backgroundImg && imgPresentation && logo && decoration ? (
        <CssVarsProvider theme={typographyTheme}>
          <Stack
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            height={"97vh"}
            width={"99vw"}
          >
            {/* main content  */}
            <Box height={"100%"} width={"70%"} id={"main-content"}>
              {widthMainContent && heightMainContent ? (
                <Box
                  height={heightMainContent}
                  width={widthMainContent}
                  position={"relative"}
                  sx={{
                    borderRadius: 3,
                    padding: 0,
                    backgroundImage: `url(${backgroundImg
                      .resize(
                        scale()
                          .width(widthMainContent)
                          .height(heightMainContent)
                      )
                      .toURL()})`,
                  }}
                  className={"animate__animated animate__zoomIn animate__slow"}
                >
                  <Box
                    height={heightMainContent}
                    width={widthMainContent}
                    display={"flex"}
                    flexDirection={"row"}
                    justifyContent={"space-evenly"}
                    alignItems={"center"}
                  >
                    {/* Welcome part  */}
                    <Box
                      width={parseInt(widthMainContent * 0.4)}
                      height={parseInt(heightMainContent * 0.7)}
                      sx={{
                        backgroundImage: `url(${imgPresentation
                          .resize(
                            scale()
                              .width(parseInt(widthMainContent * 0.4))
                              .height(parseInt(heightMainContent * 0.7))
                          )
                          .toURL()})`,
                      }}
                    >
                      <Box
                        width={parseInt(widthMainContent * 0.4)}
                        height={parseInt(heightMainContent * 0.7)}
                        display={"flex"}
                        flexDirection={"column"}
                        marginTop={5}
                      >
                        <Typography
                          textColor={colors.titleBackDark}
                          level="h2"
                          textAlign={"center"}
                        >
                          Bienvenue cher visiteur !
                        </Typography>
                        <Typography
                        padding={3}
                          textColor={"white"}
                          level="body-sm"
                          textAlign={"center"}
                        >
                          {`Vous allez être plongés dans une aventure extraordinaire, dans
                laquelle vous incarnerez un héros en proie à des choix décisifs
                pour le futur. Vous aurez besoin d'une heure environ pour aller
                au bout du récit. Des pauses sont toutefois possibles… à l'issue
                de chaque « acte » !`}
                          <br />
                          <br />
                          {` À la fin, vous en saurez davantage sur vos
                réflexes naturels…`}
                        </Typography>
                        <br />
                        <Typography
                          textColor={colors.titleBackDark}
                          level="h3"
                          textAlign={"center"}
                        >
                          Vous êtes prêts ?
                        </Typography>
                      </Box>
                    </Box>

                    {/* Login part  */}
                    <Box
                      sx={{
                        height: "100%",
                        width: "40%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <AdvancedImage cldImg={logo} />
                      <Link to="acts">
                        <Button>Administrer les actes</Button>
                      </Link>
                      <Link to="game">
                        <Button>Accéder à la démo</Button>
                      </Link>
                    </Box>
                  </Box>

                  {/* Decoration  */}
                  <Box sx={{ position: "absolute", bottom: -4, right: 0 }}>
                    <AdvancedImage
                      cldImg={decoration.resize(
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
          </Stack>
        </CssVarsProvider>
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
    </div>
  );
};

export default Home;
