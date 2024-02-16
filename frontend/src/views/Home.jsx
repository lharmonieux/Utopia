/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  Box,
  Stack,
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
import { createUserError } from "../utils/redux/userSlice.js";
import { loginFail, setToken } from "../utils/redux/authSlice.js";
import apiRequest from "../api/requestAPI.js";
import { textAreaStyle } from "../utils/cssReact.js";
import CustomButton from "../components/CustomButton.jsx";

const Home = () => {
  const [backgroundImg, setBackgroundImg] = useState("");
  // const [containerMainContent, setContainerMainContent] = useState();
  const [imgPresentation, setImgPresentation] = useState("");
  const [logo, setLogo] = useState("");
  const [decoration, setDecoration] = useState("");
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const stateUser = useSelector((state) => state.user);

  //Read Images
  useEffect(() => {
    setImgPresentation(PICTURES_DIR + "/home/1.svg");
    setLogo(PICTURES_DIR + "/Logo - couleurs + blanc.svg");
    setDecoration(PICTURES_DIR + "/Déco - Charte triangle.svg");
    setBackgroundImg(
      PICTURES_DIR +
        "/home/snowy-mountain-peak-starry-galaxy-majesty-generative-ai.jpg"
    );

    // //Get main DOM element
    // setContainerMainContent(document.querySelector("#main-content"));
  }, []);

  useEffect(() => {
    // Refresh Token
    if (!authState.token && !stateUser.successLogin) {
      apiRequest("auth/refresh", "get", authState.token, {})
        .then((response) => {
          if (response.response) {
            dispatch(
              setToken({
                token: response?.response?.data?.accessToken,
                error: null,
              })
            );
          }
        })
        .catch((error) => {
          console.log(error);
          window.location.href = "/";
        });
    }

    // Token valid then redirect to app
    if (authState.token) {
      dispatch(createUserError(null));
      window.location.href = "/user";
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // send to auth API
    const result = login({ email, password });
    result
      .then((response) => {
        if (response)
          dispatch(setToken({ token: response.data.accessToken, error: null }));
        setLoading(false);
      })
      .catch((error) => {
        dispatch(
          loginFail({ error: error?.response?.data?.message, token: null })
        );
        setLoading(false);
      });
  };

  return (
    <div>
      <CssVarsProvider theme={typographyTheme}>
        <GlobalContainer>
          {/* main content  */}
          <Box
            height={"100%"}
            width={"70%"}
            id={"main-content"}
            position={"relative"}
            sx={{
              borderRadius: 3,
              padding: 0,
              backgroundImage: `url(${backgroundImg})`,
              backgroundSize: "100% 100%",
            }}
            className={"animate__animated animate__zoomIn animate__slow"}
          >
            {stateUser.error && <Alert color="danger">{stateUser.error}</Alert>}
            <Box
              height={"100%"}
              width={"100%"}
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"space-evenly"}
              alignItems={"center"}
            >
              {/* Welcome part  */}
              <Box
                width={"40%"}
                height={"70%"}
                sx={{
                  backgroundImage: `url(${imgPresentation})`,
                  backgroundSize: `100% 100%`,
                }}
              >
                {/* Text part */}
                <Box
                  width={"100%"}
                  height={"100%"}
                  display={"flex"}
                  flexDirection={"column"}
                  sx={{
                    marginTop: "15%",
                  }}
                >
                  <Typography
                    textColor={colors.titleBackDark}
                    level="h2"
                    textAlign={"center"}
                    sx={{
                      "@media screen and (min-width: 2560px) and (min-height: 1906px)":
                        {
                          fontSize: "3.5em",
                          padding: "5%",
                        },
                      "@media screen and (min-width: 2560px) and (min-height: 1285px) and (max-height: 1905px)":
                        {
                          fontSize: "3.5em",
                          padding: "0% 2% 0% 2%",
                        },
                      "@media screen and (min-width: 1440px) and (max-width: 2559px) and (min-height: 1009px)":
                        {
                          fontSize: "2em",
                          padding: "5%",
                        },
                      "@media screen and (min-width: 1440px) and (max-width: 2559px) and (min-height: 680px) and (max-height: 1008px)":
                        {
                          fontSize: "1.8em",
                          padding: "0% 5% 0% 5%",
                        },
                      "@media screen and (min-width: 1024px) and (max-width: 1439px) and (min-height: 858px)":
                        {
                          fontSize: "1.4em",
                          padding: "7% 5% 0% 5%",
                        },
                        "@media screen and (min-width: 1024px) and (max-width: 1439px) and (min-height: 578px) and (max-height: 857px)":
                        {
                          fontSize: "1.2em",
                          padding: "0% 10% 0% 10%",
                        },
                    }}
                  >
                    Bienvenue cher visiteur !
                  </Typography>
                  <Typography
                    padding={3}
                    textColor={"white"}
                    level="body-sm"
                    textAlign={"center"}
                    sx={{
                      "@media screen and (min-width: 2560px) and (min-height: 1906px)":
                        {
                          fontSize: "2em",
                          padding: "10%",
                        },
                      "@media screen and (min-width: 2560px) and (min-height: 1285px) and (max-height: 1905px)":
                        {
                          fontSize: "1.8em",
                          padding: "4%",
                        },

                      "@media screen and (min-width: 1440px) and (max-width: 2559px) and (min-height: 1009px)":
                        {
                          fontSize: "1.2em",
                          padding: "5%",
                        },
                        "@media screen and (min-width: 1440px) and (max-width: 2559px) and (min-height: 680px) and (max-height: 1008px)":
                        {
                          fontSize: "0.9em",
                          padding: "2% 5% 0% 5%",
                        },
                        "@media screen and (min-width: 1024px) and (max-width: 1439px) and (min-height: 578px) and (max-height: 857px)":
                        {
                          fontSize: "0.8em",
                          padding: "5% 10% 0% 10%",
                        },
                    }}
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
                    sx={{
                      "@media screen and (min-width: 2560px) and (min-height: 1906px)":
                        {
                          fontSize: "3em",
                          padding: "10%",
                        },
                      "@media screen and (min-width: 2560px) and (min-height: 1285px) and (max-height: 1905px) ":
                        {
                          fontSize: "2.3em",
                          padding: "2%",
                        },
                      "@media screen and (min-width: 1440px) and (max-width: 2559px) and (min-height: 1009px)":
                        {
                          fontSize: "1.7em",
                          padding: "5%",
                        },
                        "@media screen and (min-width: 1440px) and (max-width: 2559px) and (min-height: 680px) and (max-height: 1008px)":
                        {
                          fontSize: "1.3em",
                          padding: "2% 5% 0% 5%",
                        },
                        "@media screen and (min-width: 1024px) and (max-width: 1439px) and (min-height: 858px)":
                        {
                          fontSize: "1em",
                          padding: "7% 5% 0% 5%",
                        },
                        "@media screen and (min-width: 1024px) and (max-width: 1439px) and (min-height: 578px) and (max-height: 857px)":
                        {
                          fontSize: "1em",
                          padding: "0% 10% 0% 10%",
                        },
                    }}
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
                <img src={logo} alt="logo" width={"100%"} height={"30%"} />

                {/* Login form  */}
                <Stack
                  width={"100%"}
                  height={"50%"}
                  display={"flex"}
                  direction={"column"}
                  marginTop={"15%"}
                  spacing={1}
                >
                  <Typography
                    level="h3"
                    textColor={"white"}
                    fontWeight={400}
                    sx={{
                      "@media screen and (min-width: 2560px)": {
                        fontSize: "2.5em",
                      },
                    }}
                  >
                    Se connecter
                  </Typography>

                  <form
                    onSubmit={handleSubmit}
                    style={{ height: "45%", width: "100%" }}
                  >
                    <Stack spacing={1} width={"100%"} height={"100%"}>
                      <Box
                        width={"100%"}
                        height={"30%"}
                        sx={{
                          backgroundImage: `url(${PICTURES_DIR}/textarea.svg)`,
                          backgroundSize: "100% 100%",
                        }}
                      >
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                          style={{
                            placeholder: "Email...",
                            ...textAreaStyle,
                            fontSize:
                              window.innerWidth >= 1920 ? "1.5em" : "1em",
                          }}
                        />
                      </Box>

                      <Box
                        width={"100%"}
                        height={"30%"}
                        sx={{
                          backgroundImage: `url(${PICTURES_DIR}/textarea.svg)`,
                          backgroundSize: "100% 100%",
                        }}
                      >
                        <input
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type="password"
                          style={{
                            placeholder: "Mot de passe...",
                            fontSize: 15,
                            ...textAreaStyle,
                          }}
                        />
                      </Box>

                      {/* subimit button  */}
                      <Box
                        width={"100%"}
                        height={"20%"}
                        display={"flex"}
                        justifyContent={"center"}
                      >
                        <CustomButton
                          width={"40%"}
                          height={"100%"}
                          backgroundColor={colors.buttonDark}
                          hoverColor={colors.buttonDarkHover}
                          textColor={colors.titleBackDark}
                        >
                          {loading ? (
                            <CircularProgress
                              variant="outlined"
                              color="neutral"
                            />
                          ) : (
                            "Soumettre"
                          )}
                        </CustomButton>
                      </Box>
                    </Stack>
                  </form>

                  {/* Create account */}
                  <Typography
                    textColor={"white"}
                    fontWeight={500}
                    textAlign={"center"}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: colors.buttonDarkHover,
                      },
                      borderRadius: 5,
                      "@media screen and (min-width: 1920px)": {
                        fontSize: "1.8em",
                      },
                    }}
                    onClick={() => setOpenRegisterModal(true)}
                  >
                    Pas encore de compte ? Créez le ici
                  </Typography>
                  {authState.error && (
                    <Alert
                      sx={{
                        "@media screen and (min-width: 2560px)": {
                          fontSize: "1.8em",
                        },
                      }}
                      color="danger"
                    >
                      {authState.error}
                    </Alert>
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
        </GlobalContainer>
      </CssVarsProvider>
    </div>
  );
};

export default Home;
