/* eslint-disable react/prop-types */
import { Typography } from "@mui/joy";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const DisplayingText = ({
  sentence,
  level,
  textColor,
  padding,
  textAlign,
  marginLeft,
  marginTop,
  fontWeight,
  backgroundText,
  style,
  animated,
  id,
  onComplete,
}) => {
  useEffect(() => {
    const revealLeft = document.querySelector(".reveal-left");
    if (revealLeft) {
      revealLeft.addEventListener("animationend", onComplete);
    }
  }, [onComplete]);

  const stateUser = useSelector((state) => state.user);
  sentence = sentence
    .replace("stateUser.townName", stateUser?.townName)
    .replace("stateUser.secondCharacter.name", stateUser.secondCharacter?.name)
    .replace("stateUser.townStatus", stateUser?.townStatus)
    .replace("stateUser.partyName", stateUser?.partyName)
    .replace("stateUser.town.name", stateUser?.town?.name)
    .replace("stateUser.symbol", stateUser?.symbol);

  sentence = sentence.split("⌁");

  return (
    <Typography
      level={level}
      textColor={textColor}
      fontWeight={fontWeight}
      padding={padding}
      textAlign={textAlign}
      marginLeft={marginLeft}
      marginTop={marginTop}
      id={id}
      borderRadius={10}
      className={animated && "reveal-left"}
      sx={{
        backgroundColor: backgroundText,
        ...style,
      }}
    >
      {
        <>
          {/* Display text + treatment italic text */}
          {sentence.map((subSentence, i) => {
            if (subSentence.length == 0) return null;
            return (
              <React.Fragment key={i}>
                {subSentence.split("\n").map((line, index) => {
                  return (
                    <React.Fragment key={index}>
                      {line[0] == "«" ? <em>{line}</em> : line}
                      <br />
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            );
          })}
        </>
      }
    </Typography>
  );
};

export default DisplayingText;
