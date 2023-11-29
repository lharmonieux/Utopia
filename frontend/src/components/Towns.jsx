/* eslint-disable react/prop-types */

import {
  Box,
  CircularProgress,
  CssVarsProvider,
  Stack,
  Typography,
} from "@mui/joy";
import { typographyTheme } from "../utils/themeJoy";
import { useEffect, useState } from "react";
import cloudinary from "../utils/cloudinary";
import { scale } from "@cloudinary/url-gen/actions/resize";
import { AdvancedImage } from "@cloudinary/react";
import { colors } from "../utils/colors";
import "animate.css";

const Towns = ({
  currentQuestion,
  heightMainContent,
  widthMainContent,
  towns,
  handleSelectedProposition,
}) => {
  const [mapImg, setMapImg] = useState();
  const [buttonTownImg, setButtonTownImg] = useState();
  const [buttonTownImgGif, setButtonTownImgGif] = useState();
  const [descriptionImg, setDescriptionImg] = useState();
  const [newTowns, setNewTowns] = useState();

  useEffect(() => {
    setMapImg(
      cloudinary
        .image(`exploria/${currentQuestion?.visual?.mapView?.mapImg}`)
        .quality("auto:best")
        .format("png")
    );

    setButtonTownImg(
      cloudinary
        .image(
          `exploria/${currentQuestion?.visual?.mapView?.buttonImg?.button}`
        )
        .quality("auto:best")
        .format("png")
    );

    setButtonTownImgGif(
      cloudinary
        .image(
          `exploria/${currentQuestion?.visual?.mapView?.buttonImg?.buttonGif}`
        )
        .quality("auto:best")
        .format("png")
    );

    setDescriptionImg(
      cloudinary
        .image(`exploria/${currentQuestion?.visual?.mapView?.descriptionImg}`)
        .quality("auto:best")
        .format("png")
    );

    setNewTowns(
      towns?.map((town) => ({
        name: town?.name,
        description: town?.description,
        labelImg: town?.labelImg
          ? cloudinary
              .image(`exploria/${town?.labelImg}`)
              .quality("auto:best")
              .format("png")
          : "",
        top: town?.top,
        left: town?.left,
        feedback: town?.feedback,
        selected: town?.selected ? town?.selected : false,
      }))
    );

    // for (const town of towns) {
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion]);

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
      currentQuestion?.answerType,
      selectedTown?.name
    );
    setNewTowns(
      newTowns?.map((town) => ({
        name: town?.name,
        description: town?.description,
        labelImg: town?.labelImg,
        top: town?.top,
        left: town?.left,
        feedback: town?.feedback,
        selected: selectedTown == town ? !town?.selected : false,
      }))
    );
  };

  return heightMainContent && widthMainContent ? (
    <Stack display={"flex"} direction={"column"} alignItems={"center"}>
      {currentQuestion &&
      mapImg &&
      mapImg.resize(
        scale()
          .width(parseInt(widthMainContent * 0.85))
          .height(parseInt(heightMainContent * 0.8))
      ) &&
      buttonTownImg &&
      buttonTownImg.resize(
        scale()
          .width(parseInt(widthMainContent * 0.015))
          .height(parseInt(heightMainContent * 0.025))
      ) &&
      buttonTownImgGif &&
      buttonTownImgGif.resize(
        scale()
          .width(parseInt(widthMainContent * 0.06))
          .height(parseInt(heightMainContent * 0.08))
      ) &&
      descriptionImg &&
      descriptionImg.resize(
        scale()
          .width(parseInt(widthMainContent * 0.2))
          .height(parseInt(heightMainContent * 0.35))
      ) &&
      newTowns ? (
        <CssVarsProvider theme={typographyTheme}>
          <Box
            width={parseInt(widthMainContent * 0.85)}
            height={parseInt(heightMainContent * 0.8)}
            position={"relative"}
            sx={{ backgroundImage: `url(${mapImg.toURL()})` }}
          >
            {newTowns.map((town) => (
              <Box key={town._id}>
                <Box
                  width={parseInt(widthMainContent * 0.12)}
                  height={parseInt(heightMainContent * 0.05)}
                  position={"absolute"}
                  top={town.top}
                  left={town.left}
                  display={"flex"}
                  flexDirection={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <AdvancedImage
                    cldImg={buttonTownImg}
                    alt={"Bouton de ville"}
                  />
                  {town?.labelImg && (
                    <AdvancedImage
                      cldImg={town?.labelImg?.resize(
                        scale()
                          .width(parseInt(widthMainContent * 0.1))
                          .height(parseInt(heightMainContent * 0.05))
                      )}
                    />
                  )}
                </Box>
                {!town.labelImg && (
                  <>
                    {/* GIF */}
                    <Box
                      position={"absolute"}
                      top={`${parseFloat(town.top) - 1.7}%`}
                      left={`${parseFloat(town.left) - 2.6}%`}
                      sx={{ cursor: "pointer" }}
                      onClick={() =>
                        displayDescription(
                          `description-${town?.name.split(" ").join("-")}`
                        )
                      }
                    >
                      <AdvancedImage
                        cldImg={buttonTownImgGif}
                        alt={"Bouton de ville GIF"}
                      />
                    </Box>

                    {/* town's description */}
                    <Box
                      width={parseInt(widthMainContent * 0.2)}
                      height={parseInt(heightMainContent * 0.35)}
                      position={"absolute"}
                      display={"none"}
                      top={`${parseFloat(town.top) - 12}%`}
                      left={`${parseFloat(town.left) - 25}%`}
                      sx={{
                        backgroundImage: `url(${descriptionImg.toURL()})`,
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
                        width={parseInt(widthMainContent * 0.15)}
                        height={parseInt(heightMainContent * 0.05)}
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

export default Towns;
