/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import cloudinary from "./utils/cloudinary.js";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Box,
  CircularProgress,
  CssVarsProvider,
  IconButton,
  Modal,
  ModalDialog,
  ModalClose,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
} from "@mui/joy";
import GlobalContainer from "./components/GlobalContainer.jsx";
import { setSizes } from "./utils/redux/DOMSlice.js";
import { typographyTheme } from "./utils/themeJoy.js";
import MenuDrawer from "./components/Menu.jsx";
import { AiOutlineMenuFold } from "react-icons/ai";
import { setToken } from "./utils/redux/authSlice.js";
import {
  storeActs,
  storeCurrentAct,
  updateStatusActs,
} from "./utils/redux/actSlice.js";
import apiRequest from "./api/requestAPI.js";
import { storeCharacters } from "./utils/redux/characterSlice.js";
import { storeTowns } from "./utils/redux/townSlice.js";
import {
  createUserError,
  setCurrentAct,
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
  const stateActs = useSelector((state) => state.act);
  const stateUser = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [widthMainContent, setWidthMainContent] = useState(0);
  const [heightMainContent, setHeightMainContent] = useState(0);
  const [mainContentDOM, setMainContentDOM] = useState();
  const [showDrawer, setShowDrawer] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [acts, setActs] = useState([]);
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
          dispatch(setToken({ token: response.accessToken, error: null }));
          // Store acts for app state
          dispatch(storeActs({ acts: response.response.data }));
          setLoading(false);
          setActs(response.response.data);
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
  }, []);

  //User
  useEffect(() => {
    apiRequest("users", "get", authState.token, {})
      .then((response) => {
        if (response.response) {
          dispatch(setToken({ token: response.accessToken, error: null }));
          // update only if redux's store for user is empty
          if (!stateUser.currentAct) {
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
            account.user.partyName && dispatch(setPartyName(account.user.partyName));

            // Last save
            const indexLastSave = account.user.saves.length - 1;
            dispatch(
              setThematicScore({
                scoresThematic: account.user.saves[indexLastSave]?.logScores || {},
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
            
            // update acts's status of user
            dispatch(updateStatusActs({ acts, nbOfSaves: indexLastSave + 1 }));
          }
          // change only currentAct
          else {
            for (let i = 0; i < acts.length; i++) {
              if (acts[i]?._id == stateUser.currentAct)
                dispatch(setCurrentAct(acts[i + 1]?._id));
            }
          }
        } else {
          // Save error message
          dispatch(createUserError(response?.data?.message));

          navigate("/");
        }
      })
      .catch((error) => {
        console.log(error);

        navigate("/");
        setLoading(false);
      });
  }, [acts]);

  //Characters
  useEffect(() => {
    apiRequest("characters", "get", authState.token, {})
      .then((response) => {
        if (response.response) {
          dispatch(setToken({ token: response.accessToken, error: null }));
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
  }, []);

  // Towns
  useEffect(() => {
    apiRequest("towns", "get", authState.token, {})
      .then((response) => {
        if (response.response) {
          dispatch(setToken({ token: response.accessToken, error: null }));
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
  }, []);

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

  useEffect(() => {
    setMainContentDOM(document.querySelector("#main-content"));

    if (mainContentDOM) {
      // Main content sizes
      setWidthMainContent(mainContentDOM.clientWidth);
      setHeightMainContent(mainContentDOM.clientHeight);
    }

    if (widthMainContent && heightMainContent)
      dispatch(
        setSizes({ width: widthMainContent, height: heightMainContent })
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainContentDOM, widthMainContent, heightMainContent, loading]);

  const modalSummary = () => (
    <Modal open={showSummary} onClose={() => setShowSummary(false)}>
      <ModalDialog>
        <ModalClose variant="outlined" />
        <DialogTitle>Sommaire</DialogTitle>

        <List>
          {stateActs.acts.map((act) => (
            <ListItem key={act._id}>
              <ListItemButton>
                Acte {act.chapter} : {act.name}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </ModalDialog>
    </Modal>
  );

  return !loading ? (
    <CssVarsProvider theme={typographyTheme}>
      <GlobalContainer>
        {/* Summary */}
        {showSummary && modalSummary()}

        {/* Menu button  */}
        <IconButton
          variant="outlined"
          sx={{ height: "5%", position: "absolute", top: 0, left: 0 }}
          onClick={() => setShowDrawer(true)}
        >
          <AiOutlineMenuFold size={25} color="white" />
        </IconButton>
        <MenuDrawer
          showDrawer={showDrawer}
          setShowDrawer={setShowDrawer}
          setShowSummary={setShowSummary}
        />

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
