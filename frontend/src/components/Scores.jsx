/* eslint-disable react/prop-types */
import * as Joy from "@mui/joy";

const Scores = ({ scoresThematic }) => {
  return (
    <Joy.Sheet
      variant="soft"
      sx={{
        width: "20vw",
        height: "85vh",
      }}
    >
      {scoresThematic?.map((e) => (
        <Joy.Typography key={e.thematic}>
          {e.thematic} : {e.totalScore}
        </Joy.Typography>
      ))}
    </Joy.Sheet>
  );
};

export default Scores;
