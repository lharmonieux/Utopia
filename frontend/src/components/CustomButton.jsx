import { Typography } from "@mui/joy";
import { useState } from "react";

/* eslint-disable react/prop-types */
const CustomButton = ({
  backgroundColor,
  hoverColor,
  width,
  height,
  clickMethod,
  textColor,
  level,
  style,
  disabled,
  type,
  children,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  return (
    <button
      type={type || ""}
      style={{
        cursor: !disabled && "pointer",
        borderRadius: 5,
        backgroundColor: disabled
          ? "gray"
          : isHovered
          ? hoverColor
          : backgroundColor,
        width: width,
        height: height,
        border: "none",
        ...style,
      }}
      onClick={clickMethod}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
    >
      <Typography
        textColor={textColor || "black"}
        fontWeight={600}
        level={level || "title-lg"}
        sx={{
          "@media screen and (min-width: 1440px) and (max-width: 2559px) and (min-height: 1009px)":
            {
              fontSize: "150%",
            },
          "@media screen and (min-width: 1440px) and (max-width: 2559px) and (min-height: 680px) and (max-height: 1008px)":
            {
              fontSize: "120%",
            },
          "@media screen and (min-width: 1024px) and (max-width: 1439px) and (min-height: 858px)":
            {
              fontSize: "110%",
            },
          "@media screen and (min-width: 1024px) and (max-width: 1439px) and (min-height: 578px) and (max-height: 857px)":
            {
              fontSize: "100%",
            },
          fontSize: "200%",
        }}
      >
        {children}
      </Typography>
    </button>
  );
};

export default CustomButton;
