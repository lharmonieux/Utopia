/* eslint-disable react/prop-types */
import { Typography } from "@mui/joy";
import React from "react";
import { useSelector } from "react-redux";
import { ReactTyped } from "react-typed";

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
  const stateUser = useSelector((state) => state.user);
  sentence = sentence
    .replace("stateUser.townName", stateUser?.townName)
    .replace("stateUser.secondCharacter.name", stateUser.secondCharacter?.name)
    .replace("stateUser.townStatus", stateUser?.townStatus)
    .replace("stateUser.partyName", stateUser?.partyName)
    .replace("stateUser.town.region", stateUser?.town?.region)
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
      sx={{
        backgroundColor: backgroundText,
        ...style,
      }}
    >
      {animated ? (
        sentence.map((subSentence, index) => (
          <ReactTyped
            key={index}
            strings={[subSentence]}
            showCursor={false}
            onComplete={
              sentence.length == index + 1
                ? onComplete || function () {}
                : function () {}
            }
            style={{ whiteSpace: "pre-line" }}
          />
        ))
      ) : (
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
      )}
    </Typography>
  );
};

export default DisplayingText;
