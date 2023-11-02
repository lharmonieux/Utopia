/* eslint-disable react/prop-types */
import { Input } from "@mui/joy";

const TextArea = ({ town, setTown }) => {
  //Accept just letters
  const handleKeyDown = e => {
    const allowedCharacters = /[A-Za-zÀ-ÿ' ]/;

    if(!allowedCharacters.test(e.key)) e.preventDefault();
  }

  return (
    <Input
      placeholder="Nom de votre ville..."
      value={town}
      onChange={(e) => setTown(e.target.value)}
      onKeyDown={(e)=> handleKeyDown(e)}
    />
  );
};

export default TextArea;
