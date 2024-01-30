/* eslint-disable react/prop-types */
import { Box, Button, CircularProgress, Stack, Typography } from "@mui/joy";
import { TypeAnimation } from "react-type-animation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PICTURES_DIR } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import "animate.css";

const Home = () => {
  const domConfig = useSelector((state) => state.dom);
  const stateActs = useSelector((state) => state.act);
  const navigate = useNavigate();
  const [backgroundImg, setBackgroundImg] = useState("");
  useEffect(() => {
    setBackgroundImg(
      PICTURES_DIR +
        "/home/snowy-mountain-peak-starry-galaxy-majesty-generative-ai.jpg"
    );
  }, []);
  return domConfig.width && domConfig.height ? (
    <Box
      width={"100%"}
      height={"100%"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-evenly"}
      flexDirection={"column"}
      sx={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: `${domConfig.width}px ${domConfig.height}px`
      }} 
      className={"animate__animated animate__zoomIn"}
    >
      {/* home's text  */}
      <Box padding={10}>
        <Typography
          textColor={"white"}
          level="title-lg"
          fontWeight={500}
          textAlign={"center"}
        >
          <TypeAnimation
            sequence={[
              `2027 ne fut décidemment pas une année comme les autres. Un premier terrien sur Mars, une base sur la Lune… et une nouvelle exoplanète découverte parfaitement habitable !
          Ce nouvel astre fut nommé Exploria, et il fallut plus de 300 ans à l'humanité pour s'y installer… En 2357, une poignée d'humains fondèrent la première colonie. Ce fut le point de départ d'une importante immigration, et 50 ans plus tard, près de 10 000 000 habitants la peuplaient.
          De la capitale Méridian essaimèrent une dizaine de villes moyennes, administrant chacune un nouveau territoire.
          Né dans l'une de ces villes beaucoup trop moyennes pour vous, vous n'avez qu'un rêve : fonder votre propre Cité !`,
            ]}
            speed={80}
            repeat={1}
            cursor={false}
            style={{ whiteSpace: "pre-line" }}
          />
        </Typography>
      </Box>

      {/* navigation */}
      <Stack spacing={5} direction={"row"}>
        <Button
          disabled={stateActs.currentAct ? false : true}
          onClick={() => navigate("/user/game")}
        >
          {stateActs.currentAct?.chapter > 1
            ? "Continuer l'aventure"
            : "Commencer à jouer"}
        </Button>
        <Button onClick={() => (window.location.href = "/user/summary")}>
          {"Voir le sommaire"}
        </Button>
      </Stack>
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
  );
};

export default Home;
