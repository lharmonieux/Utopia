/* eslint-disable react/prop-types */
import {
  Alert,
  Box,
  CircularProgress,
  DialogTitle,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
  Typography,
} from "@mui/joy";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUser } from "../api/userAPi";
import { setErrorRegister, setSuccessRegister } from "../utils/redux/userSlice";
import CustomButton from "./CustomButton";
import { colors } from "../utils/colors";
import { InputRegister } from "./Input";
import "../assets/css/fullHD.css";

const Register = ({ openRegisterModal, setOpenRegisterModal }) => {
  const dispatch = useDispatch();
  const creationState = useSelector((state) => state.user);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset form when user is created
  useEffect(() => {
    if (creationState.successLogin) {
      setFirstname("");
      setLastname("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    }
  }, [creationState.successLogin]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Send informations to user API
    const result = createUser({ firstname, lastname, email, password });
    result
      .then((response) => {
        if (response) dispatch(setSuccessRegister(response.data.message));
        setLoading(false);
      })
      .catch((error) => {
        dispatch(setErrorRegister(error.response.data.message));
        setLoading(false);
      });
  };

  return (
    <Modal
      open={openRegisterModal}
      onClose={() => {
        dispatch(setSuccessRegister(null));
        dispatch(setErrorRegister(null));
        setOpenRegisterModal(false);
      }}
    >
      <ModalDialog
        sx={{
          width: "50%",
          height: "80%",
        }}
      >
        <ModalClose variant="outlined" />
        <DialogTitle
          sx={{
            justifyContent: "center",
            fontSize: "1.6em",
          }}
        >
          Création de compte
        </DialogTitle>

        <form onSubmit={handleSubmit} style={{ height: "100%" }}>
          <Stack spacing={3} height={"100%"}>
            <InputRegister
              placeholder={"Nom"}
              value={lastname}
              setValue={setLastname}
              height={"15%"}
            />
            <InputRegister
              placeholder={"Prénom"}
              value={firstname}
              setValue={setFirstname}
              height={"15%"}
            />
            <InputRegister
              placeholder={"Email"}
              value={email}
              setValue={setEmail}
              height={"15%"}
            />
            <InputRegister
              placeholder={"Mot de passe"}
              value={password}
              setValue={setPassword}
              height={"15%"}
            />

            {/* submit button  */}
            <Box
              width={"100%"}
              height={"10%"}
              display={"flex"}
              justifyContent={"center"}
            >
              <CustomButton
                width={"30%"}
                height={"100%"}
                backgroundColor={colors.buttonDark}
                hoverColor={colors.buttonDarkHover}
                textColor={colors.titleBackDark}
              >
                {loading ? (
                  <CircularProgress variant="outlined" color="neutral" />
                ) : (
                  "Soumettre"
                )}
              </CustomButton>
            </Box>
          </Stack>
        </form>

        {/* feedback server  */}
        {creationState.errorRegister && (
          <Alert color={"danger"}>
            <Typography level="body-md">
              {creationState.errorRegister}
            </Typography>
          </Alert>
        )}

        {creationState.succesRegister && (
          <Alert color={"success"}>
            <Typography level="body-md">
              {creationState.succesRegister}
            </Typography>
          </Alert>
        )}
      </ModalDialog>
    </Modal>
  );
};

export default Register;
