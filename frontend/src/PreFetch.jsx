/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import cloudinary from "./utils/cloudinary.js";
import { Outlet, useNavigate } from "react-router-dom";
import { Box, CircularProgress, CssVarsProvider, IconButton } from "@mui/joy";
import GlobalContainer from "./components/GlobalContainer.jsx";
import { typographyTheme } from "./utils/themeJoy.js";
import MenuDrawer from "./components/Menu.jsx";
import { AiOutlineMenuFold } from "react-icons/ai";
import { setToken } from "./utils/redux/authSlice.js";
import { storeCurrentAct, updateStatusActs } from "./utils/redux/actSlice.js";
import apiRequest from "./api/requestAPI.js";
import { storeCharacters } from "./utils/redux/characterSlice.js";
import { storeTowns } from "./utils/redux/townSlice.js";
import {
  createUserError,
  setCurrentAct,
  setFeelings,
  setIdUser,
  setMotto,
  setPartyName,
  setThematicScore,
  setTown,
  setTownStatus,
  setUserCharacter,
  setUserInfos,
  setUserSecondCharacter,
  storeSaves,
  storeTownName,
} from "./utils/redux/userSlice.js";

const PreFetch = () => {
  const authState = useSelector((state) => state.auth);
  const stateUser = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  //Getting datas from api

  // Refresh token
  useEffect(() => {
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
          } else {
            dispatch(createUserError(response?.data?.message));
            navigate("/");
          }
        })
        .catch((error) => {
          console.log(error);
          navigate("/");
        });
    }
  }, []);

  // Acts
  useEffect(() => {
    setLoading(true);
    apiRequest("acts", "get", authState.token, {})
      .then((response) => {
        if (response.response) {
          //User
          let acts = response.response.data;
          apiRequest("users", "get", authState.token, {}).then((response) => {
            if (response.response) {
              const account = response.response.data;
              // User infos
              dispatch(
                setUserInfos({
                  firstname: account.user.firstname,
                  lastname: account.user.lastname,
                })
              );
              dispatch(setIdUser(account.user._id));

              account.user.character &&
                dispatch(setUserCharacter(account.user.character));
              account.user.motto && dispatch(setMotto(account.user.motto));
              account.user.townName &&
                dispatch(storeTownName(account.user.townName));
              account.user.secondCharacter &&
                dispatch(setUserSecondCharacter(account.user.secondCharacter));
              account.user.town && dispatch(setTown(account.user.town));
              account.user.partyName &&
                dispatch(setPartyName(account.user.partyName));
              account.user.symbol &&
                dispatch(setPartyName(account.user.symbol));
              account.user.feelings &&
                dispatch(setFeelings(account.user.feelings));

              // Last save
              const indexLastSave = account.user.saves.length - 1;
              dispatch(
                setThematicScore({
                  scoresThematic:
                    account.user.saves[indexLastSave]?.logScores || {},
                  givenResidents:
                    account.user.saves[indexLastSave]?.totalResidents || 0,
                })
              );

              //Current act
              let currentAct = acts[indexLastSave + 1];
              if (currentAct) {
                //for user
                dispatch(setCurrentAct(currentAct?._id));

                // Current act for act's store
                dispatch(storeCurrentAct(currentAct));
                // Store town status
                dispatch(setTownStatus(currentAct?.townStatus));
              }

              // all saves
              dispatch(storeSaves(account.user.saves));

              // store acts with status of user
              dispatch(
                updateStatusActs({ acts, nbOfSaves: indexLastSave + 1 })
              );
              setLoading(false);
            } else {
              // Save error message
              dispatch(createUserError(response?.data?.message));
              navigate("/");
            }
          });
        }
        // Save error message
        else {
          dispatch(createUserError(response?.data?.message));
          navigate("/");
        }
      })
      .catch((error) => {
        console.log(error);
        navigate("/");
        setLoading(false);
      });
  }, [authState.token]);

  //Characters
  useEffect(() => {
    apiRequest("characters", "get", authState.token, {})
      .then((response) => {
        if (response.response) {
          dispatch(storeCharacters(response.response.data));
        } else {
          dispatch(createUserError(response?.data?.message));

          navigate("/");
        }
      })
      .catch((error) => {
        console.log(error);
        navigate("/");
      });
  }, [authState.token]);

  // Towns
  useEffect(() => {
    apiRequest("towns", "get", authState.token, {})
      .then((response) => {
        if (response.response) {
          dispatch(storeTowns(response.response.data));
        } else {
          dispatch(createUserError(response?.data?.message));

          navigate("/");
        }
      })
      .catch((error) => {
        console.log(error);
        navigate("/");
      });
  }, [authState.token]);

  //CRUD
  // useEffect(() => {
  // Update Act
  //   if (newActs.type == "updated") {
  //     axios
  //       .put(
  //         `${import.meta.env.VITE_REACT_URL_BACK}/acts/${newActs.idAct}`,
  //         newActs.act
  //       )
  //       .then(() => {
  //         setRefresh((refresh) => ++refresh);
  //       })
  //       .catch((error) => {
  //         console.log(error.message);
  //       });
  //   }
  //   // Delete Act
  //   else if (newActs.type == "deleted") {
  //     axios
  //       .delete(`${import.meta.env.VITE_REACT_URL_BACK}/acts/${newActs.idAct}`)
  //       .then(() => setRefresh((refresh) => ++refresh))
  //       .catch((error) => console.log(error.message));
  //   }
  // }, [newActs]);

  // useEffect(() => {
  //   setMainContentDOM(document.querySelector("#main-content"));

  //   if (mainContentDOM) {
  //     // Main content sizes
  //     setWidthMainContent(mainContentDOM.clientWidth);
  //     setHeightMainContent(mainContentDOM.clientHeight);
  //   }

  //   if (widthMainContent && heightMainContent)
  //     dispatch(
  //       setSizes({ width: widthMainContent, height: heightMainContent })
  //     );
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [mainContentDOM, widthMainContent, heightMainContent, loading]);

  return !loading ? (
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
          <Outlet />
        </Box>
      </GlobalContainer>
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
  );
};

export default PreFetch;
