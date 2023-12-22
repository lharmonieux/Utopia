/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Stack,
  Button,
  Typography,
  CssVarsProvider,
  CircularProgress,
  Alert,
} from "@mui/joy";
import "animate.css";
import { typographyTheme } from "../utils/themeJoy.js";
import { colors } from "../utils/colors.js";
import Register from "../components/Register.jsx";
import { PICTURES_DIR } from "../utils/constants.js";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../api/authAPI.js";
import GlobalContainer from "../components/GlobalContainer.jsx";
import { backgroundSize } from "../utils/backgroundSizeProvider.js";

const Home = () => {
  const [backgroundImg, setBackgroundImg] = useState("");
  const [containerMainContent, setContainerMainContent] = useState();
  const [widthMainContent, setWidthMainContent] = useState(0);
  const [heightMainContent, setHeightMainContent] = useState(0);
  const [imgPresentation, setImgPresentation] = useState("");
  const [logo, setLogo] = useState("");
  const [decoration, setDecoration] = useState("");
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const stateUser = useSelector((state) => state.user);
  const navigate = useNavigate();

  console.log(stateUser);

  //Read Images
  useEffect(() => {
    setImgPresentation(PICTURES_DIR + "/home/1.svg");
    setLogo(PICTURES_DIR + "/Logo - couleurs + blanc.svg");
    setDecoration(PICTURES_DIR + "/Déco - Charte triangle.svg");
    setBackgroundImg(
      PICTURES_DIR +
        "/home/snowy-mountain-peak-starry-galaxy-majesty-generative-ai.jpg"
    );

    //Get main DOM element
    setContainerMainContent(document.querySelector("#main-content"));
  }, []);

  useEffect(() => {
    if (authState.token) navigate("/user/home");

    //Update sizes's states
    if (containerMainContent) {
      // Main content sizes
      setWidthMainContent(containerMainContent.clientWidth);
      setHeightMainContent(containerMainContent.clientHeight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerMainContent, authState]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // send to auth API
    login({ email, password }, dispatch);
  };

  return (
    <div>
      <CssVarsProvider theme={typographyTheme}>
        <GlobalContainer>
          {/* main content  */}
          <Box height={"100%"} width={"70%"} id={"main-content"}>
            {widthMainContent && heightMainContent ? (
              backgroundImg && imgPresentation && logo && decoration ? (
                <Box
                  height={heightMainContent}
                  width={widthMainContent}
                  position={"relative"}
                  sx={{
                    borderRadius: 3,
                    padding: 0,
                    backgroundImage: `url(${backgroundImg})`,
                    backgroundSize: `${widthMainContent}px ${heightMainContent}px`,
                    backgroundRepeat: "no-repeat",
                  }}
                  className={"animate__animated animate__zoomIn animate__slow"}
                >
                  {stateUser.error && (
                    <Alert color="danger">{stateUser.error}</Alert>
                  )}
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
                        backgroundImage: `url(${imgPresentation})`,
                        backgroundSize: `${widthMainContent * 0.4}px ${
                          heightMainContent * 0.7
                        }px`,
                        backgroundRepeat: "no-repeat",
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
                      <img src={logo} alt="logo" />
                      {/* <Link to="acts">
                        <Button>Administrer les actes</Button>
                      </Link> */}

                      {/* Login form  */}
                      <Stack
                        width={"100%"}
                        height={"100%"}
                        display={"flex"}
                        direction={"column"}
                        marginTop={"20%"}
                        spacing={1}
                      >
                        <Typography
                          level="h3"
                          textColor={"white"}
                          fontWeight={400}
                        >
                          Se connecter
                        </Typography>
                        <form onSubmit={handleSubmit}>
                          <Stack spacing={1}>
                            <Box
                              width={parseInt(widthMainContent * 0.4)}
                              height={parseInt(heightMainContent * 0.07)}
                              sx={{
                                backgroundImage: `url(${PICTURES_DIR}/textarea.svg)`,
                                backgroundSize: backgroundSize(
                                  widthMainContent * 0.4,
                                  heightMainContent * 0.07
                                ),
                              }}
                            >
                              <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                style={{
                                  placeholder: "Email...",
                                  width: "100%",
                                  height: "100%",
                                  border: "none",
                                  backgroundColor: "transparent",
                                  outline: "none",
                                  fontSize: 20,
                                  marginLeft: 10,
                                }}
                              />
                            </Box>

                            <Box
                              width={parseInt(widthMainContent * 0.4)}
                              height={parseInt(heightMainContent * 0.07)}
                              sx={{
                                backgroundImage: `url(${PICTURES_DIR}/textarea.svg)`,
                                backgroundSize: backgroundSize(
                                  widthMainContent * 0.4,
                                  heightMainContent * 0.07
                                ),
                              }}
                            >
                              <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                style={{
                                  placeholder: "Mot de passe...",
                                  width: "100%",
                                  height: "100%",
                                  border: "none",
                                  backgroundColor: "transparent",
                                  outline: "none",
                                  fontSize: 20,
                                  marginLeft: 10,
                                }}
                              />
                            </Box>
                            <Button
                              sx={{
                                backgroundColor: colors.buttonDark,
                                "&:hover": {
                                  backgroundColor: colors.buttonDarkHover,
                                },
                              }}
                              type="submit"
                            >
                              Soumettre
                            </Button>
                          </Stack>
                        </form>

                        <Typography textColor={"white"} fontWeight={500}>
                          Pas encore de compte ? Créez le{" "}
                          <Typography
                            sx={{
                              cursor: "pointer",
                              "&:hover": {
                                backgroundColor: colors.buttonDarkHover,
                              },
                            }}
                            onClick={() => setOpenRegisterModal(true)}
                          >
                            ici
                          </Typography>{" "}
                        </Typography>

                        {authState.error && (
                          <Alert color="danger">{authState.error}</Alert>
                        )}
                      </Stack>
                    </Box>
                  </Box>

                  {/* Decoration  */}
                  <Box
                    width={"15%"}
                    height={"20%"}
                    sx={{ position: "absolute", bottom: 0, right: 0 }}
                  >
                    <img
                      src={decoration}
                      alt="decoration image"
                      height={"100%"}
                      width={"100%"}
                    />
                  </Box>

                  {openRegisterModal && (
                    <Register
                      openRegisterModal={openRegisterModal}
                      setOpenRegisterModal={setOpenRegisterModal}
                    />
                  )}
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
              )
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
        </GlobalContainer>
      </CssVarsProvider>
    </div>
  );
};

export default Home;
