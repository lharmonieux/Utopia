import * as Joy from "@mui/joy";

export const AlertNoAnswer = () => {
  return (
    <Joy.Stack>
      <Joy.Alert color="danger" variant="soft">
        Une réponse est obligatoire
      </Joy.Alert>
    </Joy.Stack>
  )
}
