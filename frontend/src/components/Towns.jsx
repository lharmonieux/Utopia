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
import DisplayingText from "./DisplayingText";
import { selectionEffect } from "../utils/cssReact";

const Towns = ({ handleSelectedProposition, questionContent }) => {
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

      descriptionBox.addEventListener("animationend", () =>
        descriptionBox.classList.remove("animate__bounceIn")
      );
    }
  };

  const setSelectedTown = (selectedTown) => {
    handleSelectedProposition(
      selectedTown,
      questionContent.answerType?.name,
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
            marginTop={`${stateActs.currentQuestion?.visual?.mapView?.marginTop}%`}
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

            {/* Additionnal content */}
            {stateActs.currentQuestion.additionalContent.length > 0 &&
              stateActs.currentQuestion.additionalContent?.map((element) => (
                <Box
                  key={element._id}
                  position={"absolute"}
                  width={parseInt(
                    domConfig.width *
                    element.scale.width
                  )}
                  height={parseInt(
                    domConfig.height *
                    element.scale.height
                  )}
                  top={`${element.position.top}%`}
                  left={`${element.position.left}%`}
                  display={"flex"}
                  // justifyContent={"center"}
                  alignItems={"center"}
                  zIndex={2}
                  sx={{
                    backgroundImage: `url(${PICTURES_DIR}/${element.img})`,
                    backgroundSize: backgroundSize(
                      domConfig.width *
                        element.scale.width,
                      domConfig.height *
                        element.scale.height
                    ),
                  }}
                >
                  <Typography level="title-xs" textAlign={"center"}>
                    {element.text}
                  </Typography>{" "}
                </Box>
              ))}

            {/* Answers box */}
            {stateActs?.currentQuestion?.visual?.mapView?.hasAnswer && (
              <Stack
                direction={"column"}
                spacing={2}
                zIndex={2}
                position={"absolute"}
                left={`${stateActs?.currentQuestion?.answers[0]?.content?.img?.left}%`}
                top={`${stateActs?.currentQuestion?.answers[0]?.content?.img?.top}%`}
              >
                {stateActs?.currentQuestion?.answers?.map((answer) => (
                  <Box
                    key={answer._id}
                    width={parseInt(
                      domConfig.width * answer?.content?.img?.width
                    )}
                    height={parseInt(
                      domConfig.height * answer?.content?.img?.height
                    )}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    onClick={() =>
                      handleSelectedProposition(
                        answer,
                        questionContent?.answerType?.name,
                        ""
                      )
                    }
                    sx={[
                      {
                        cursor: "pointer",
                        backgroundImage: `url(${PICTURES_DIR}/${answer?.content?.img?.name})`,
                        backgroundSize: backgroundSize(
                          domConfig.width * answer?.content?.img?.width,
                          domConfig.height * answer?.content?.img?.height
                        ),
                      },
                      selectionEffect(answer),
                    ]}
                  >
                    <DisplayingText
                      sentence={answer?.content?.text?.text}
                      textColor={answer?.content?.textColor}
                      textAlign={"center"}
                      fontWeight={600}
                    />
                  </Box>
                ))}
              </Stack>
            )}

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
                      onClick={() => {
                        if (
                          !stateActs.currentQuestion?.visual?.mapView?.hasAnswer
                        ) {
                          displayDescription(
                            `description-${town?.name.split(" ").join("-")}`
                          );
                        }
                      }}
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
                      sx={[
                        {
                          backgroundImage: `url(${PICTURES_DIR}/${stateActs.currentQuestion?.visual?.mapView?.descriptionImg})`,
                          backgroundSize: backgroundSize(
                            domConfig.width * 0.2,
                            domConfig.height * 0.35
                          ),
                        },
                        selectionEffect(town),
                      ]}
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
