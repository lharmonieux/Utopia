/* eslint-disable react/prop-types */
import { Stack } from "@mui/joy";

const GlobalContainer = ({children}) => {
  return (
    <Stack
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      height={"97vh"}
      width={"99vw"}
      position={"relative"}
    >{children}</Stack>
  );
};

export default GlobalContainer;
