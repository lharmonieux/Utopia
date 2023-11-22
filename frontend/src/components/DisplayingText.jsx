/* eslint-disable react/prop-types */
import React from "react";
import {Typography} from "@mui/joy";

const DisplayingText = ({ sentence, level, textColor }) => {
  return (
    <Typography level={level} textColor={textColor} fontWeight={400} sx={{ textAlign: "center" }}>
      {sentence?.split("\n").map((chaine, index) => (
        <React.Fragment key={index}>
          {chaine} <br />
        </React.Fragment>
      ))}
    </Typography>
  );
};

export default DisplayingText;
