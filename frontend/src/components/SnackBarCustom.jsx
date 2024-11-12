/* eslint-disable react/prop-types */
import { Snackbar } from "@mui/joy";

const SnackBarCustom = ({ open, vertical, horizontal, onClose, text, color }) => {
  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical, horizontal }}
      onClose={onClose}
      color={color}
      autoHideDuration={3000}
    >
      {text}
    </Snackbar>
  );
};

export default SnackBarCustom;
