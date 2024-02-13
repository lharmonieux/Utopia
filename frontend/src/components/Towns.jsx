/* eslint-disable react/prop-types */

import { Box, CircularProgress, Stack, Typography } from "@mui/joy";
import { colors } from "../utils/colors";
import "animate.css";
import { useDispatch, useSelector } from "react-redux";
import { updateTownSelected } from "../utils/redux/townSlice";
import { PICTURES_DIR } from "../utils/constants";
import DisplayingText from "./DisplayingText";
import { selectionEffect } from "../utils/cssReact";

const Towns = ({ handleSelectedProposition, questionContent }) => {
  const stateActs = useSelector((state) => state.act);
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
    <Box
      display={"flex"}
      direction={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      width={"85%"}
      height={`${(1 - questionContent?.backgroundImg?.height) * 100}%`}
    >
      {stateActs.currentQuestion ? (
        <Box
          width={"100%"}
          height={"100%"}
          position={"relative"}
          marginTop={`${stateActs.currentQuestion?.visual?.mapView?.marginTop}%`}
          sx={{
            backgroundImage: `url(${PICTURES_DIR}/${stateActs.currentQuestion?.visual?.mapView?.backgroundImg})`,
            backgroundSize: "100% 100%",
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
                width={`${element.scale.width * 100}%`}
                height={`${element.scale.height * 100}%`}
                top={`${element.position.top}%`}
                left={`${element.position.left}%`}
                display={"flex"}
                // justifyContent={"center"}
                alignItems={"center"}
                zIndex={2}
                sx={{
                  backgroundImage: `url(${PICTURES_DIR}/${element.img})`,
                  backgroundSize: "100% 100%",
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
              width={"100%"}
              height={"100%"}
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
                  width={`${answer?.content?.img?.width * 100}%`}
                  height={`${answer?.content?.img?.height * 100}%`}
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
                      backgroundSize: "100% 100%",
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
            <Box
              key={town._id}
              width={"15%"}
              height={"5%"}
              position={"absolute"}
              top={`${town.top}%`}
              left={`${town.left}%`}
            >
              <Box
                width={"100%"}
                height={"100%"}
                display={"flex"}
                flexDirection={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                {/* Button's img  */}
                <img
                  src={`${PICTURES_DIR}/${stateActs.currentQuestion?.visual?.mapView?.buttonImg?.button}`}
                  width={"10%"}
                  height={"45%"}
                />

                {/* Button label  */}
                {town?.labelImg && (
                  <img
                    src={`${PICTURES_DIR}/${town?.labelImg}`}
                    width={"85%"}
                    height={"100%"}
                  />
                )}
              </Box>
              {!town.labelImg &&
                !stateActs?.currentQuestion?.visual?.mapView?.hasAnswer && (
                  <>
                    {/* GIF */}
                    <Box
                      position={"absolute"}
                      width={"20%"}
                      height={"45%"}
                      top={`10%`}
                      left={`-5%`}
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
                        width={"100%"}
                        height={"100%"}
                      />
                    </Box>

                    {/* town's description */}
                    <Box
                      zIndex={1000}
                      width={"15vw"}
                      height={"35vh"}
                      display={"none"}
                      position={"absolute"}
                      top={`-250%`}
                      left={`20%`}
                      onClick={() => setSelectedTown(town)}
                      sx={[
                        {
                          cursor: "pointer",
                          backgroundImage: `url(${PICTURES_DIR}/${stateActs.currentQuestion?.visual?.mapView?.descriptionImg})`,
                          backgroundSize: "100% 100%",
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
                        <Box
                          width={"60%"}
                          height={"20%"}
                          marginTop={"3%"}
                          marginLeft={"15%"}
                        >
                          <Typography
                            level="title-lg"
                            textColor={colors.titleBackLight}
                            fontWeight={400}
                            textAlign={"center"}
                          >
                            {town?.name}
                          </Typography>
                        </Box>

                        <Box
                          width={"100%"}
                          height={"40%"}
                          display={"flex"}
                          alignItems={"center"}
                        >
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
                          width={"75%"}
                          height={"15%"}
                          marginTop={"5%"}
                          marginLeft={"-18%"}
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"center"}
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
                    </Box>
                  </>
                )}
            </Box>
          ))}
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
  );
};

export default Towns;
