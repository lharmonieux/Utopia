/* eslint-disable react/prop-types */
import * as Joy from "@mui/joy";

const TextArea = ({ town, setTown }) => {
  return (
    <Joy.Input
      placeholder="Nom de votre ville..."
      value={town}
      onChange={(e) => setTown(e.target.value)}
    />
  );
};

export default TextArea;
