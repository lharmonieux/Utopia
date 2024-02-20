import { Typography } from "@mui/joy";
import { useState } from "react";
import "../assets/css/fullHD.css";

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
      >
        {children}
      </Typography>
    </button>
  );
};

export default CustomButton;
