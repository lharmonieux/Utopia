/* eslint-disable react/prop-types */
import { Box, Typography } from "@mui/joy";
import { TypeAnimation } from "react-type-animation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PICTURES_DIR } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import "animate.css";
import CustomButton from "../../components/CustomButton";
import { colors } from "../../utils/colors";

const Home = () => {
  const stateActs = useSelector((state) => state.act);
  const navigate = useNavigate();
  const [backgroundImg, setBackgroundImg] = useState("");
  useEffect(() => {
    setBackgroundImg(
      PICTURES_DIR +
        "/home/snowy-mountain-peak-starry-galaxy-majesty-generative-ai.jpg"
    );
  }, []);
  return (
    <Box
      width={"100%"}
      height={"100%"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-evenly"}
      flexDirection={"column"}
      sx={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: `cover`,
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
          sx={{
            "@media screen and (min-width: 1920px)": {
              fontSize: "1.8em",
            },
          }}
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
            style={{
              whiteSpace: "pre-line",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              borderRadius: 5,
            }}
          />
        </Typography>
      </Box>

      {/* navigation */}
      <Box
        width={"40%"}
        height={"10%"}
        display={"flex"}
        justifyContent={"space-evenly"}
        alignItems={"center"}
      >
        {/* left button  */}
        <Box width={"40%"} height={"100%"}>
          <CustomButton
            width={"100%"}
            height={"100%"}
            clickMethod={() => navigate("/game")}
            disabled={stateActs.currentAct ? false : true}
            backgroundColor={colors.buttonLight}
            hoverColor={colors.buttonLightHover}
          >
            {stateActs.currentAct?.chapter > 1
              ? "Continuer l'aventure"
              : "Commencer à jouer"}
          </CustomButton>
        </Box>

        {/* right button  */}
        <Box width={"30%"} height={"100%"}>
          <CustomButton
            width={"100%"}
            height={"100%"}
            clickMethod={() => navigate("/summary")}
            backgroundColor={colors.buttonLight}
            hoverColor={colors.buttonLightHover}
          >
            {"Voir le sommaire"}
          </CustomButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
