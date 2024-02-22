/* eslint-disable react/prop-types */
import { Button } from "@mui/joy";
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
  return (
    <Button
      id={id}
      color={color}
      size={"lg"}
      onClick={() => scrollBehaviour(directionScroll, idContainer, widthMove, alignMvnt)}
      sx={{
        position: "absolute",
        left: left,
        top: top,
        zIndex: 2,
        height: height,
      }}
    >
      {children}
    </Button>
  );
};

export default ButtonNavScroll;
