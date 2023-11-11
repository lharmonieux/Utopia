import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "./admin/GameContext.jsx";
import { Box, Sheet, Stack, Button, Typography } from "@mui/joy";
import Cloudinary from "../utils/cloudinary.js";
import { scale } from "@cloudinary/url-gen/actions/resize";
import "animate.css";
import { AdvancedImage } from "@cloudinary/react";

const Home = () => {
  const [backgroundImg, setBackgroundImg] = useState("");
  const [widthMainContent, setWidthMainContent] = useState(0);
  const [heightMainContent, setHeightMainContent] = useState(0);
  const [imgPresentation, setImgPresentation] = useState("");
  const [widthPresentationContent, setWidthPresentationContent] = useState(0);
  const [heightPresentationContent, setHeightPresentationContent] = useState(0);
  const [logo, setLogo] = useState("");
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

    setLogo(Cloudinary.image("exploria/Logo_-_couleurs_blanc_qhtptz"));
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
                    scale().width(widthMainContent).height(heightMainContent)
                  )
                  .toURL()
              })`,
            }}
            id={"main-content"}
            className={"animate__animated animate__zoomIn"}
          >
            <Box
              sx={{
                width: "40%",
                height: "70%",
                padding: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundImage: `url(${
                  (imgPresentation,
                  widthPresentationContent,
                  heightPresentationContent) &&
                  imgPresentation
                    .resize(
                      scale()
                        .width(widthPresentationContent)
                        .height(heightPresentationContent)
                    )
                    .format("png")
                    .toURL()
                })`,
              }}
              id={"presentation-content"}
            >
              <Typography textColor={"yellow"} level="h1" textAlign={"center"}>Bienvenue cher visiteur !</Typography><br />
              <Typography textColor={"white"} level="body-xs" textAlign={"center"}>
                {`Vous allez être plongé dans une aventure extraordinaire, dans
                laquelle vous incarnerez un héros en proie à des choix décisifs
                pour le futur. Vous aurez besoin d'une heure environ pour aller
                au bout du récit. Des pauses sont toutefois possibles… à l'issue
                de chaque « acte » !`}<br /><br />{` À la fin, vous en saurez davantage sur vos
                réflexes naturels…`}
              </Typography><br />
              <Typography textColor={"yellow"} level="h3" textAlign={"center"}>Vous êtes prêts ?</Typography>
              
            </Box>
            <Box sx={{
              height: "100%",
              width: "40%",
              display: 'flex',
              flexDirection: 'column',
            }}>
              <AdvancedImage cldImg={logo} />
              <Link to="acts">
                <Button>Administrer les actes</Button>
              </Link>
              <Link to="game">
                <Button>Accéder à la démo</Button>
              </Link></Box>
          </Sheet>
        </Stack>
      )}
    </div>
  );
};

export default Home;
