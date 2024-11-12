/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { Outlet, useNavigate } from "react-router-dom";
import { Box, CssVarsProvider, IconButton, Typography } from "@mui/joy";
import GlobalContainer from "./components/GlobalContainer.jsx";
import { typographyTheme } from "./utils/themeJoy.js";
import MenuDrawer from "./components/Menu.jsx";
import { AiOutlineMenuFold } from "react-icons/ai";
import { setToken } from "./utils/redux/authSlice.js";
import { storeCurrentAct, storeActs } from "./utils/redux/actSlice.js";
import apiRequest from "./api/requestAPI.js";
import { storeCharacters } from "./utils/redux/characterSlice.js";
import { storeTowns } from "./utils/redux/townSlice.js";
import {
  createUserError,
  storeUserCurrentAct,
  storeMotto,
  storePartyName,
  storeTown,
  storeTownStatus,
  storeUserCharacter,
  storeUserInfos,
  storeUserSecondCharacter,
  storeSaves,
  storeTownName,
  storeRole,
  storeScoreAndAnswer,
  storeUserComments,
  storeIsPasswordChanged,
} from "./utils/redux/userSlice.js";
import { storeProjects } from "./utils/redux/projectSlice.js";
import { storeCompanies } from "./utils/redux/companySlice.js";
import { storeComments } from "./utils/redux/commentSlice.js";
import Loading from "./views/Loading.jsx";
import { PICTURES_DIR } from "./utils/constants.js";
import { colors } from "./utils/colors.js";

const PreFetch = () => {
  const authState = useSelector((state) => state.auth);
  const stateUser = useSelector((state) => state.user);
  const stateActs = useSelector((state) => state.act);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);
  //Getting datas from api

  // Refresh token and store user infos
  useEffect(() => {
    apiRequest("auth/refresh", "get", authState.token, {})
      .then((result) => {
        if (result.response.status >= 200 && result.response.status < 300) {
          // Decode token's infos
          const token = result?.response?.data?.accessToken;
          const decoded_token = jwtDecode(token);

          // Store token in redux
          dispatch(
            setToken({
              token,
              error: null,
            })
          );

          // Getting of all user's infos
          apiRequest("users", "get", token, {}).then((resultUser) => {
            if (
              resultUser.response.status >= 200 &&
              resultUser.response.status < 300
            ) {
              const { user } = resultUser.response.data;

              // Store user's datas in redux
              user.character && dispatch(storeUserCharacter(user.character));
              user.motto && dispatch(storeMotto(user.motto));
              user.townName && dispatch(storeTownName(user.townName));
              user.secondCharacter &&
                dispatch(storeUserSecondCharacter(user.secondCharacter));
              user.town && dispatch(storeTown(user.town));
              user.partyName && dispatch(storePartyName(user.partyName));
              user.symbol && dispatch(storePartyName(user.symbol));
              if (user.currentAct) {
                dispatch(storeUserCurrentAct(user.currentAct.actId));
                dispatch(storeTownStatus(user.currentAct.townStatus));
              }
              if (user?.comments?.length > 0)
                dispatch(storeUserComments(user.comments));

              // Last save
              if (user.saves && user.saves.length > 0) {
                const indexLastSave = user.saves.length - 1;
                dispatch(
                  storeScoreAndAnswer({
                    act: null,
                    logScores: user.saves[indexLastSave]?.logScores || [],
                    logAnswers: [],
                    totalResidentsGot:
                      user.saves[indexLastSave]?.totalResidentsGot || 0,
                    totalResidentsPossible:
                      user.saves[indexLastSave]?.totalResidentsPossible || 0,
                  })
                );
              }

              // all saves
              dispatch(storeSaves({ saves: user.saves || [] }));

              setLoading(false);
            } else {
              // Save error message
              dispatch(createUserError(resultUser?.data?.message));
              navigate("/");
            }
          });

          // Store user infos of decodedToken in redux
          dispatch(storeRole(decoded_token.UserInfo.role));
          dispatch(
            storeUserInfos({
              firstname: decoded_token.UserInfo.firstname,
              lastname: decoded_token.UserInfo.lastname,
              userId: decoded_token.UserInfo.userId,
              email: decoded_token.UserInfo.email,
            })
          );
          dispatch(
            storeIsPasswordChanged(decoded_token.UserInfo.isPasswordChanged)
          );
        } else {
          dispatch(setToken({ token: null, error: result?.data?.message }));
          dispatch(createUserError(result?.data?.message));
          navigate("/");
        }
      })
      .catch((error) => {
        console.log(error);
        navigate("/");
      });
  }, []);

  // Projects
  useEffect(() => {
    if (authState.token && stateUser.idUser) {
      apiRequest("project", "get", authState.token, {
        params: { adminId: stateUser.idUser },
      })
        .then((res) => {
          if (res.response.status >= 200 && res.response.status < 300) {
            if (res.response.data.length > 0) {
              dispatch(storeProjects(res.response.data));
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [authState.token, stateUser.idUser]);

  //Companies
  useEffect(() => {
    if (authState.token) {
      apiRequest("company", "get", authState.token, {})
        .then((res) => {
          if (res.response.status >= 200 && res.response.status < 300) {
            if (res.response.data.length > 0) {
              dispatch(storeCompanies(res.response.data));
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [authState.token]);

  // Acts
  useEffect(() => {
    setLoading(true);
    if (authState.token && stateUser.nbOfSaves > -1) {
      apiRequest("acts", "get", authState.token, {})
        .then((resultAct) => {
          if (
            resultAct.response.status >= 200 &&
            resultAct.response.status < 300
          ) {
            let acts = resultAct.response.data.acts;

            // store acts in redux
            dispatch(storeActs({ acts, nbOfSaves: stateUser.nbOfSaves }));
            dispatch(storeCurrentAct(acts[stateUser.nbOfSaves] || null));
            dispatch(
              storeTownStatus(acts[stateUser.nbOfSaves]?.townStatus || null)
            );
            dispatch(storeUserCurrentAct(acts[stateUser.nbOfSaves] || null));

            setLoading(false);
          }
          // Save error message
          else {
            dispatch(createUserError(resultAct?.data?.message));
            navigate("/");
          }
        })
        .catch((error) => {
          console.log(error);
          navigate("/");
          setLoading(false);
        });
    }
  }, [authState.token, stateUser.nbOfSaves]);

  //Characters
  useEffect(() => {
    if (authState.token) {
      apiRequest("characters", "get", authState.token, {})
        .then((resultCharacters) => {
          if (
            resultCharacters.response.status >= 200 &&
            resultCharacters.response.status < 300
          ) {
            dispatch(
              storeCharacters(resultCharacters.response.data.characters || [])
            );
          } else {
            dispatch(createUserError(resultCharacters?.data?.message));
            navigate("/");
          }
        })
        .catch((error) => {
          console.log(error);
          navigate("/");
        });
    }
  }, [authState.token]);

  // Towns
  useEffect(() => {
    if (authState.token) {
      apiRequest("towns", "get", authState.token, {})
        .then((resulTowns) => {
          if (resulTowns.response) {
            dispatch(storeTowns(resulTowns.response.data));
          } else {
            dispatch(createUserError(resulTowns?.data?.message));
            navigate("/");
          }
        })
        .catch((error) => {
          console.log(error);
          navigate("/");
        });
    }
  }, [authState.token]);

  // Comments
  useEffect(() => {
    if (authState.token && stateUser.nbOfSaves == 5) {
      apiRequest("comments", "get", authState.token, {})
        .then((resultComments) => {
          if (
            resultComments.response.status >= 200 &&
            resultComments.response.status < 300
          ) {
            const { comments } = resultComments.response.data;
            dispatch(storeComments(comments));
          }
        })
        .catch((error) => {
          console.log(error);
          navigate("/");
        });
    }
  }, [authState.token, stateUser.nbOfSaves]);

  // Background Music Manager
  const audioPlayFunc = () => {
    const audioPlayer = document.querySelector("#audio-player");
    if (authState.token && audioPlayer) {
      if (!audioPlayed) {
        const playPromise = audioPlayer.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setAudioPlayed(true);
            })
            .catch((error) => {
              console.error("Impossible de démarrer la lecture:", error);
            });
        }
      } else {
        audioPlayer.pause();
        setAudioPlayed(false);
      }
    }
  };

  return (
    <CssVarsProvider theme={typographyTheme}>
      <GlobalContainer>
        {/* Menu button  */}
        <IconButton
          variant="outlined"
          sx={{ height: "5%", position: "absolute", top: 0, left: 0 }}
          onClick={() => setShowDrawer(true)}
        >
          <AiOutlineMenuFold size={25} color="white" />
        </IconButton>
        <MenuDrawer showDrawer={showDrawer} setShowDrawer={setShowDrawer} />

        {/* Main content */}
        <Box
          height={"100%"}
          width={"70%"}
          id={"main-content"}
          position={"relative"}
        >
          {/* Music management */}
          {stateUser.role?.name === "JOUEUR" && (
            <Box
              position={"absolute"}
              left={"101%"}
              zIndex={100}
              width={"20%"}
              height={"10%"}
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              bgcolor={colors.buttonDark}
              borderRadius={10}
              sx={{
                cursor: "pointer",
                "&:hover": { backgroundColor: colors.buttonDarkHover },
              }}
            >
              <Box onClick={() => audioPlayFunc()} width={"40%"} height={"75%"}>
                <img
                  src={`${PICTURES_DIR}/music/music.svg`}
                  width={"100%"}
                  height={"100%"}
                />
              </Box>
              <Typography level="title-md" textColor={"white"}>
                {audioPlayed ? "Arrêter la musique" : "Démarrer la musique"}
              </Typography>
              <audio
                loop={true}
                id="audio-player"
                src={stateActs.currentAct?.backgroundSong}
              />
            </Box>
          )}
          {!loading ? <Outlet /> : <Loading />}
        </Box>
      </GlobalContainer>
    </CssVarsProvider>
  );
};

export default PreFetch;
