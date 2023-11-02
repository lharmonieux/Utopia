import {Stack, Alert} from "@mui/joy";

export const AlertNoAnswer = () => {
  return (
    <Stack>
      <Alert color="danger" variant="soft">
        Une réponse est obligatoire
      </Alert>
    </Stack>
  )
}
