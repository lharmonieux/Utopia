/* eslint-disable react/prop-types */
import { Input } from "@mui/joy";

const TextArea = ({ town, setTown }) => {
  return (
    <Input
      placeholder="Nom de votre ville..."
      value={town}
      onChange={(e) => setTown(e.target.value)}
      slotProps={{ input: { pattern: "[A-Za-z]+" } }}
    />
  );
};

export default TextArea;
