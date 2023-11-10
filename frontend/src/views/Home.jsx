import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "./admin/GameContext.jsx";
import { Box, Sheet, Stack, Button } from "@mui/joy";
import Cloudinary from "../utils/cloudinary.js";
import { fill } from "@cloudinary/url-gen/actions/resize";
import "animate.css";
import { AdvancedImage } from "@cloudinary/react";
// import { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { ActContext } from "./GameContext";

const Home = () => {
  const [backgroundImg, setBackgroundImg] = useState("");
  const [widthMainContent, setWidthMainContent] = useState(0);
  const [heightMainContent, setHeightMainContent] = useState(0);
  const [imgPresentation, setImgPresentation] = useState("");
  const [widthPresentationContent, setWidthPresentationContent] = useState(0);
  const [heightPresentationContent, setHeightPresentationContent] = useState(0);
  const [resizeDOM, setResizeDOM] = useState(0);
  const { loading } = useContext(AppContext);

  const containerMainContent = document.querySelector("#main-content");
  const containerPresentationContent = document.querySelector(
    "#presentation-content"
  );
  //Get automatically the new sizes
  window.addEventListener("resize", () => {
    containerMainContent && setResizeDOM(containerMainContent.clientWidth);
  });

  useEffect(() => {
    //Size of the main element for background image
    if (containerMainContent && containerPresentationContent) {
      //Main Content sizes
      setWidthMainContent(containerMainContent.clientWidth);
      setHeightMainContent(containerMainContent.clientHeight);

      //Presentation container sizes
      setHeightPresentationContent(containerPresentationContent.clientHeight);
      setWidthPresentationContent(containerPresentationContent.clientWidth);
    }

    setBackgroundImg(
      Cloudinary.image(
        "exploria/snowy-mountain-peak-starry-galaxy-majesty-generative-ai_f7ureo"
      )
    );

    setImgPresentation(Cloudinary.image("exploria/1_p8okvj"));
  }, [resizeDOM, containerMainContent, containerPresentationContent]);

  return (
    <div>
      {loading ? (
        <p>Chargement des données...</p>
      ) : (
        <Stack
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          height={"100vh"}
          width={"100vw"}
        >
          <Sheet
            variant="outlined"
            sx={{
              height: "90%",
              width: "80%",
              borderRadius: 3,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
              backgroundImage: `url(${
                (backgroundImg, widthMainContent, heightMainContent) &&
                backgroundImg
                  .resize(
                    fill().width(widthMainContent).height(heightMainContent)
                  )
                  .toURL()
              })`,
            }}
            id={"main-content"}
            className={"animate__animated animate__zoomIn"}
          >
            <Box
              sx={{
                width: "30%",
                height: "70%",
                backgroundImage: `url(${
                  (imgPresentation,
                  widthPresentationContent,
                  heightPresentationContent) &&
                  imgPresentation
                    .toURL()
                })`,
              }}
              id={"presentation-content"}
            >
              <Link to="acts">
                <Button>
                  Administrer les actes
                </Button>
              </Link>
              <Link to="game">
                <Button >Accéder à la démo</Button>
              </Link>
            </Box>
            <Box>
              Se connecter
            </Box>
          </Sheet>
        </Stack>
      )}
    </div>
  );
};

export default Home;
