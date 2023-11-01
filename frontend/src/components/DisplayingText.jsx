/* eslint-disable react/prop-types */
import React from "react";
import * as Joy from "@mui/joy";

const DisplayingText = ({ sentence }) => {
  return (
    <Joy.Typography level="title-md" sx={{ textAlign: "center" }}>
      {sentence?.split("\n").map((chaine, index) => (
        <React.Fragment key={index}>
          {chaine} <br />
        </React.Fragment>
      ))}
    </Joy.Typography>
  );
};

export default DisplayingText;
