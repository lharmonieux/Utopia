/* eslint-disable react/prop-types */
import { Button, Typography } from "@mui/joy";

const IconButtonCustom = ({
  text,
  icon,
  bgcolor,
  textColor,
  hoverColor,
  onClick,
  border,
  level
}) => {
  return (
    <Button
      startDecorator={icon}
      variant="outlined"
      onClick={onClick}
      sx={{
        width: "100%",
        height: "100%",
        bgcolor: bgcolor,
        color: textColor,
        "&: hover": { bgcolor: hoverColor },
        border: border,
      }}
    >
      <Typography level={level || "title-md"} textColor={textColor}>
        {text}
      </Typography>
    </Button>
  );
};

export default IconButtonCustom;
