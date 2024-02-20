/* eslint-disable react/prop-types */
import { Input } from "@mui/joy";

export const InputRegister = ({ setValue, value, placeholder, height }) => {
  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      sx={{
        height: { height },
      }}
      className="input-register"
    />
  );
};
