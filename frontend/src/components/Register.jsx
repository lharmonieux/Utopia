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
} from "@mui/joy";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUser } from "../api/userAPi";
import { createUserError, createUserSuccess } from "../utils/redux/userSlice";
import CustomButton from "./CustomButton";
import { colors } from "../utils/colors";
import { InputRegister } from "./Input";

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
        if (response) dispatch(createUserSuccess(response.data.message));
        setLoading(false);
      })
      .catch((error) => {
        dispatch(createUserError(error.response.data.message));
        setLoading(false);
      });
  };

  return (
    <Modal
      open={openRegisterModal}
      onClose={() => {
        dispatch(createUserSuccess(null));
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
            "@media screen and (min-width: 2560px)": {
              fontSize: "2.5em",
              display: "flex",
            },
            justifyContent: "center",
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
        {creationState.error && (
          <Alert color={"danger"}>{creationState.error} </Alert>
        )}

        {creationState.successLogin && (
          <Alert color={"success"}>{creationState.successLogin} </Alert>
        )}
      </ModalDialog>
    </Modal>
  );
};

export default Register;
