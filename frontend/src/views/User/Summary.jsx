import { Box, Button, Stack } from "@mui/joy";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Summary = () => {
  const stateActs = useSelector((state) => state.act);
  const navigate = useNavigate();
  return (
    <Stack spacing={1}>
      {stateActs?.acts?.map((act) => (
        <Box key={act._id}>
          <Button
            disabled={
              act?.status == "DONE" || act?.status == "NOT DONE" ? true : false
            }
            onClick={() => {
              navigate("/user/game");
            }}
          >
            {act.name}
          </Button>
        </Box>
      ))}
    </Stack>
  );
};

export default Summary;
