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
  marginTop,
  fontWeight,
  animated,
}) => {
  const stateUser = useSelector((state) => state.user);
  sentence = sentence
    .replace("stateUser.townName", stateUser?.townName)
    .replace("stateUser.secondCharacter.name", stateUser.secondCharacter?.name)
    .replace("stateUser.townStatus", stateUser?.townStatus)
    .replace("stateUser.partyName", stateUser?.partyName)
    .replace("stateUser.town.region", stateUser?.town?.region);
  return (
    <Typography
      level={level}
      textColor={textColor}
      fontWeight={fontWeight}
      padding={padding}
      textAlign={textAlign}
      marginLeft={marginLeft}
      marginTop={marginTop}
    >
      {animated ? (
        <TypeAnimation
          sequence={[`${sentence}`]}
          speed={80}
          repeat={1}
          cursor={false}
          style={{ whiteSpace: "pre-line" }}
        />
      ) : (
        `${sentence}`
      )}
    </Typography>
  );
};

export default DisplayingText;
