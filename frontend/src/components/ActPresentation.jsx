/* eslint-disable react/prop-types */
import { Sheet, Stack, Typography } from "@mui/joy";
import "animate.css";
import { useEffect } from "react";

const ActPresentation = ({
  act,
  setShowActPresentation,
  setShowMainContent,
}) => {
  const actPresentationContainer = document.querySelector(
    "#act-presentation-content"
  );

  useEffect(() => {
    if (actPresentationContainer) {
      const delay = setTimeout(() => {
        actPresentationContainer.classList.add("animate__fadeOut");
        actPresentationContainer.addEventListener("animationend", () => {
          setShowActPresentation(false);
          setShowMainContent(true);
        });
      }, 4000);

      return () => clearTimeout(delay);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actPresentationContainer]);

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
        className={`animate__animated animate__fadeIn`}
        id={"act-presentation-content"}
      >
        <Typography level="h1">Acte {act?.chapter}</Typography>
        <Typography>{act?.name}</Typography>
      </Sheet>
    </Stack>
  );
};

export default ActPresentation;
