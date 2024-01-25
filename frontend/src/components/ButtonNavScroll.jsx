/* eslint-disable react/prop-types */
import { Button } from "@mui/joy";
import { useSelector } from "react-redux";
import { scrollBehaviour } from "../utils/scroll";

// eslint-disable-next-line react/prop-types
const ButtonNavScroll = ({
  id,
  left,
  top,
  height,
  directionScroll,
  color,
  idContainer,
  widthMove,
  alignMvnt,
  children,
}) => {
  const domConfig = useSelector((state) => state.dom);
  return (
    <Button
      id={id}
      color={color}
      size={"lg"}
      onClick={() => scrollBehaviour(directionScroll, idContainer, widthMove, alignMvnt)}
      sx={{
        position: "absolute",
        left: `${left}%`,
        top: `${top}%`,
        zIndex: 2,
        height: parseInt(domConfig.height * height),
      }}
    >
      {children}
    </Button>
  );
};

export default ButtonNavScroll;
