/* eslint-disable react/prop-types */
import {
  Alert,
  Button,
  DialogTitle,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
} from "@mui/joy";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUser } from "../api/userAPi";
import { createUserSuccess } from "../utils/redux/userSlice";

const Register = ({ openRegisterModal, setOpenRegisterModal }) => {
  const dispatch = useDispatch();
  const creationState = useSelector((state) => state.user);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Reset form when user is created
  useEffect(() => {
    if (creationState.successLogin) {
      setFirstname("");
      setLastname("");
      setEmail("");
      setPassword("");
    }
  }, [creationState.successLogin]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send informations to user API
    createUser({ firstname, lastname, email, password }, dispatch);
  };

  return (
    <Modal
      open={openRegisterModal}
      onClose={() => {
        dispatch(createUserSuccess(null));
        setOpenRegisterModal(false);
      }}
    >
      <ModalDialog>
        <ModalClose variant="outlined" />
        <DialogTitle>Création de compte</DialogTitle>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Input
              placeholder="Nom"
              size="lg"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
            <Input
              placeholder="Prenom"
              size="lg"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
            <Input
              placeholder="Email"
              size="lg"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Mot de passe"
              size="lg"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit">Soumettre</Button>
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
