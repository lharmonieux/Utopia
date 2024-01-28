/* eslint-disable react/prop-types */
// import React from "react";
import { Typography } from "@mui/joy";
import { useSelector } from "react-redux";
import { TypeAnimation } from "react-type-animation";

const DisplayingText = ({
  sentence,
  level,
  textColor,
  padding,
  textAlign,
  marginLeft,
  fontWeight,
}) => {
  const stateUser = useSelector((state) => state.user);
  sentence = sentence
    .replace("stateUser.townName", stateUser?.townName)
    .replace("stateUser.secondCharacter.name", stateUser.secondCharacter?.name)
    .replace("stateUser.townStatus", stateUser?.townStatus)
    .replace("stateUser.partyName", stateUser?.partyName);
  return (
    <Typography
      level={level}
      textColor={textColor}
      fontWeight={fontWeight}
      padding={padding}
      textAlign={textAlign}
      marginLeft={marginLeft}
    >
      <TypeAnimation
        sequence={[sentence]}
        speed={50}
        repeat={1}
        cursor={false}
        style={{ whiteSpace: "pre-line" }}
      />
    </Typography>
  );
};

export default DisplayingText;
