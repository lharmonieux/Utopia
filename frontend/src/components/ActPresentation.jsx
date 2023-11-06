/* eslint-disable react/prop-types */
import { Sheet, Stack, Typography } from "@mui/joy";
import "animate.css";
import { useEffect } from "react";

const ActPresentation = ({ act, setShowActPresentation, setShowMainContent }) => {
  useEffect(() => {
    const delay = setTimeout(() => {
      setShowActPresentation(false);
      setShowMainContent(true);
    }, 5000);

    return () => clearTimeout(delay);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack display="flex" justifyContent="center" height="100vh" width="100vw">
      <Sheet
        variant="soft"
        sx={{
          height: "50vh",
          margin: 5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 3,
          borderRadius: 5,
        }}
        className={`animate__animated animate__fadeOut animate__delay-4s`}
      >
        <Typography level="h1">Acte {act?.chapter}</Typography>
        <Typography>{act?.name}</Typography>
      </Sheet>
    </Stack>
  );
};

export default ActPresentation;
