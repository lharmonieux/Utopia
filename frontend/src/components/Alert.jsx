/* eslint-disable react/prop-types */
import { Stack, Alert } from "@mui/joy";

export const AlertNoAnswer = () => {
  return (
    <Stack>
      <Alert
        sx={{
          fontSize: window.innerWidth >= 1920 ? "1.3em" : "1em",
        }}
        color="danger"
        variant="soft"
      >
        Une réponse est obligatoire
      </Alert>
    </Stack>
  );
};

export const AlertUser = ({ color, text }) => {
  return (
    <Alert
      sx={{
        fontSize: window.innerWidth >= 1920 ? "1.3em" : "1em",
        marginTop: 2,
      }}
      color={color}
      variant="soft"
    >
      {text}
    </Alert>
  );
};

export const AlertBAdAnswerNumber = () => {
  return (
    <Stack>
      <Alert
        sx={{
          fontSize: window.innerWidth >= 1920 ? "1.3em" : "1em",
        }}
        color="danger"
        variant="soft"
      >
        Mauvais nombre de réponses soumises
      </Alert>
    </Stack>
  );
};
