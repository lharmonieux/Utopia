/* eslint-disable react/prop-types */
import { Box, Typography } from "@mui/joy";
import { PICTURES_DIR } from "../utils/constants";
import "animate.css";

const RankView = ({ text }) => {
  return (
    <Box
      width={"70%"}
      height={"30%"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      marginTop={"5%"}
      className={"animate__animated animate__zoomIn"}
      sx={{
        backgroundImage: `url(${PICTURES_DIR}/rankImg.svg)`,
        backgroundSize: "100% 100%",
      }}
    >
      <Typography textAlign={"center"} padding={"10%"} fontWeight={600}>{text}</Typography>
    </Box>
  );
};

export default RankView;
