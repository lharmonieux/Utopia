/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
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
import { createUserError } from "../utils/redux/userSlice.js";
import { loginFail, setToken } from "../utils/redux/authSlice.js";
import apiRequest from "../api/requestAPI.js";
import { textAreaStyle } from "../utils/cssReact.js";

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
              backgroundSize: `cover`,
              backgroundRepeat: "no-repeat",
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
                  backgroundSize: `cover`,
                  backgroundRepeat: "no-repeat",
                }}
              >
                {/* Text part */}
                <Box
                  width={"100%"}
                  height={"100%"}
                  display={"flex"}
                  flexDirection={"column"}
                  sx={{
                    "@media (min-width: 1280px) and (max-width: 1920px)": {
                      marginTop: "15%",
                    },
                  }}
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
                  <Typography level="h3" textColor={"white"} fontWeight={400}>
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
                            fontSize: 15,
                            ...textAreaStyle,
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
                      <Button
                        sx={{
                          backgroundColor: colors.buttonDark,
                          "&:hover": {
                            backgroundColor: colors.buttonDarkHover,
                          },
                        }}
                        type="submit"
                      >
                        {loading ? (
                          <CircularProgress
                            variant="outlined"
                            color="neutral"
                          />
                        ) : (
                          "Soumettre"
                        )}
                      </Button>
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
                      borderRadius: 5
                    }}
                    onClick={() => setOpenRegisterModal(true)}
                  >
                    Pas encore de compte ? Créez le ici
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
        </GlobalContainer>
      </CssVarsProvider>
    </div>
  );
};

export default Home;
