/* eslint-disable react/prop-types */
import { Stack, Alert } from "@mui/joy";

export const AlertNoAnswer = () => {
  return (
    <Stack>
      <Alert color="danger" variant="soft">
        Une réponse est obligatoire
      </Alert>
    </Stack>
  );
};

export const AlertUser = ({ color, text }) => {
  return (
    <Alert color={color} variant="soft" sx={{ marginTop: 2 }}>
      {text}
    </Alert>
  );
};
