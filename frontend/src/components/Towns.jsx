/* eslint-disable react/prop-types */

import {
  Box,
  CircularProgress,
  CssVarsProvider,
  Stack,
  Typography,
} from "@mui/joy";
import { typographyTheme } from "../utils/themeJoy";
import { colors } from "../utils/colors";
import "animate.css";
import { useDispatch, useSelector } from "react-redux";
import { updateTownSelected } from "../utils/redux/townSlice";
import { backgroundSize } from "../utils/backgroundSizeProvider";
import { PICTURES_DIR } from "../utils/constants";

const Towns = ({ handleSelectedProposition }) => {
  const stateActs = useSelector((state) => state.act);
  const domConfig = useSelector((state) => state.dom);
  const stateTowns = useSelector((state) => state.town);
  const dispatch = useDispatch();

  const displayDescription = (idElement) => {
    const descriptionBox = document.querySelector(`#${idElement}`);
    if (descriptionBox) {
      const computedStyle = window.getComputedStyle(descriptionBox);
      const displayValue = computedStyle.getPropertyValue("display");
      displayValue == "none"
        ? (descriptionBox.style.display = "block")
        : (descriptionBox.style.display = "none");
      descriptionBox.classList.add("animate__bounceIn");
    }
  };

  const setSelectedTown = (selectedTown) => {
    handleSelectedProposition(
      selectedTown,
      stateActs.currentQuestion?.answerType,
      selectedTown?.name
    );
    dispatch(updateTownSelected({ towns: stateTowns.towns, selectedTown }));
  };

  return (
    <Stack display={"flex"} direction={"column"} alignItems={"center"}>
      {stateActs.currentQuestion ? (
        <CssVarsProvider theme={typographyTheme}>
          <Box
            width={parseInt(domConfig.width * 0.85)}
            height={parseInt(domConfig.height * 0.8)}
            position={"relative"}
            sx={{
              backgroundImage: `url(${PICTURES_DIR}/${stateActs.currentQuestion?.visual?.mapView?.backgroundImg})`,
              backgroundSize: backgroundSize(
                domConfig.width * 0.85,
                domConfig.height * 0.8
              ),
            }}
          >
            {/* Map image  */}
            <Box
              height={"100%"}
              width={"100%"}
              sx={{ position: "absolute", top: "-32%", left: "-6%" }}
            >
              <img
                src={`${PICTURES_DIR}/${stateActs.currentQuestion?.visual?.mapView?.mapImg}`}
                height={"140%"}
                width={"112%"}
              />
            </Box>

            {stateTowns.towns?.map((town) => (
              <Box key={town._id}>
                <Box
                  width={parseInt(domConfig.width * 0.12)}
                  height={parseInt(domConfig.height * 0.05)}
                  position={"absolute"}
                  top={`${town.top}%`}
                  left={`${town.left}%`}
                  display={"flex"}
                  flexDirection={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  {/* Button's img  */}
                  <img
                    src={`${PICTURES_DIR}/${stateActs.currentQuestion?.visual?.mapView?.buttonImg?.button}`}
                    width={domConfig.width * 0.015}
                    height={domConfig.height * 0.025}
                  />

                  {/* Button label  */}
                  {town?.labelImg && (
                    <img
                      src={`${PICTURES_DIR}/${town?.labelImg}`}
                      width={domConfig.width * 0.1}
                      height={domConfig.height * 0.05}
                    />
                  )}
                </Box>
                {!town.labelImg && (
                  <>
                    {/* GIF */}
                    <Box
                      position={"absolute"}
                      top={`${parseFloat(town.top) - 3}%`}
                      left={`${parseFloat(town.left) - 2}%`}
                      sx={{ cursor: "pointer" }}
                      onClick={() =>
                        displayDescription(
                          `description-${town?.name.split(" ").join("-")}`
                        )
                      }
                    >
                      <img
                        src={`${PICTURES_DIR}/${stateActs.currentQuestion?.visual?.mapView?.buttonImg?.buttonGif}`}
                        width={domConfig.width * 0.05}
                        height={domConfig.height * 0.1}
                      />
                    </Box>

                    {/* town's description */}
                    <Box
                      width={parseInt(domConfig.width * 0.2)}
                      height={parseInt(domConfig.height * 0.35)}
                      position={"absolute"}
                      display={"none"}
                      top={`${parseFloat(town.top) - 12}%`}
                      left={`${parseFloat(town.left) - 25}%`}
                      sx={{
                        backgroundImage: `url(${PICTURES_DIR}/${stateActs.currentQuestion?.visual?.mapView?.descriptionImg})`,
                        backgroundSize: backgroundSize(
                          domConfig.width * 0.2,
                          domConfig.height * 0.35
                        ),
                        border: town?.selected && 2,
                        borderColor: town?.selected && colors.borderDescMap,
                      }}
                      id={`description-${town?.name.split(" ").join("-")}`}
                      className="animate__animated"
                    >
                      <Box
                        width={"100%"}
                        height={"100%"}
                        display={"flex"}
                        flexDirection={"column"}
                        alignItems={"center"}
                      >
                        <Typography
                          level="title-lg"
                          textColor={colors.titleBackLight}
                          marginTop={3}
                          fontWeight={400}
                        >
                          {town?.name}
                        </Typography>
                        <Typography
                          level="body-xs"
                          paddingLeft={2}
                          paddingRight={2}
                          paddingTop={1}
                          textAlign={"center"}
                        >
                          {town?.description}
                        </Typography>
                      </Box>

                      {/* Button "chosir" */}
                      <Box
                        width={parseInt(domConfig.width * 0.15)}
                        height={parseInt(domConfig.height * 0.05)}
                        // position={"absolute"}
                        // top={`${parseFloat(town?.top) + 15.5}%`}
                        // left={`${parseFloat(town?.left) - 24}%`}
                        marginTop={-9.3}
                        marginLeft={1}
                        onClick={() => setSelectedTown(town)}
                        sx={{ cursor: "pointer" }}
                      >
                        <Typography
                          level="title-lg"
                          textColor={colors.titleBackLight}
                          fontWeight={400}
                          textAlign={"center"}
                        >
                          Choisir
                        </Typography>
                      </Box>
                    </Box>
                  </>
                )}
              </Box>
            ))}
          </Box>
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
    </Stack>
  );
};

export default Towns;
