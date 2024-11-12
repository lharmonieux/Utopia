/* eslint-disable react/prop-types */
import {
  Box,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
} from "@mui/joy";
import { useEffect, useState } from "react";
import CustomButton from "../../../../components/CustomButton";
import { colors } from "../../../../utils/colors";
import apiRequest from "../../../../api/requestAPI";
import { useSelector } from "react-redux";

const ModalEditPassword = ({ open, setOpen, setSuccess }) => {
  const authState = useSelector((state) => state.auth);
  const stateUser = useSelector((state) => state.user);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorForm, setErrorForm] = useState(new Map());

  useEffect(() => {
    let errorTmp = new Map();
    errorTmp.set("currentPassword", { hasError: false, message: "" });
    errorTmp.set("newPassword", { hasError: false, message: "" });
    errorTmp.set("confirmNewPassword", { hasError: false, message: "" });
    setErrorForm(errorTmp);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (authState.token) {
      // Check if all fields are filled
      if (
        currentPassword === "" ||
        newPassword === "" ||
        confirmNewPassword === ""
      ) {
        let errorTmp = new Map(errorForm);
        errorTmp.set("currentPassword", {
          hasError: true,
          message: "Veuillez remplir tous les champs",
        });
        errorTmp.set("newPassword", {
          hasError: true,
          message: "Veuillez remplir tous les champs",
        });
        errorTmp.set("confirmNewPassword", {
          hasError: true,
          message: "Veuillez remplir tous les champs",
        });
        setErrorForm(errorTmp);
        return;
      }

      // Check if newPassword has at least 8 characters
      if (newPassword.length < 8) {
        let errorTmp = new Map(errorForm);
        errorTmp.set("newPassword", {
          hasError: true,
          message: "Le mot de passe doit contenir au moins 8 caractères",
        });
        errorTmp.set("confirmNewPassword", {
          hasError: false,
          message: "",
        });
        errorTmp.set("currentPassword", {
          hasError: false,
          message: "",
        });
        setErrorForm(errorTmp);
        return;
      }

      // Check if passwords are the same
      if (newPassword !== confirmNewPassword) {
        let errorTmp = new Map(errorForm);
        errorTmp.set("confirmNewPassword", {
          hasError: true,
          message: "Les mots de passe ne sont pas identiques",
        });
        errorTmp.set("newPassword", {
          hasError: true,
          message: "Les mots de passe ne sont pas identiques",
        });
        errorTmp.set("currentPassword", {
          hasError: false,
          message: "",
        });
        setErrorForm(errorTmp);
        return;
      } else {
        // Send to database
        apiRequest("users/update_password", "patch", authState.token, {
          data: {
            idUser: stateUser.idUser,
            currentPassword,
            newPassword,
          },
        })
          .then((resultEditPassword) => {
            if (
              resultEditPassword.response.status >= 200 &&
              resultEditPassword.response.status < 300
            ) {
              setCurrentPassword("");
              setNewPassword("");
              setConfirmNewPassword("");
              setSuccess(resultEditPassword.response.data.message);
              setOpen(false);
            } else {
              let errorTmp = new Map(errorForm);
              errorTmp.set("currentPassword", {
                hasError: true,
                message: resultEditPassword.response.data.message,
              });
              errorTmp.set("newPassword", {
                hasError: false,
                message: "",
              });
              errorTmp.set("confirmNewPassword", {
                hasError: false,
                message: "",
              });
              setErrorForm(errorTmp);
            }
          })
          .catch((errorEditPassword) => {
            console.log(errorEditPassword);
          });
      }
    }
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog sx={{ width: "35%", height: "55%" }}>
        <ModalClose variant="outlined" />
        <DialogTitle level="h3">Modification du mot de passe</DialogTitle>
        <DialogContent
          sx={{ padding: 2, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <FormControl error={errorForm.get("currentPassword")?.hasError}>
            <FormLabel>Mot de passe actuel</FormLabel>
            <Input
              placeholder="Entrez le mot de passe actuel..."
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              sx={{ width: "80%" }}
              name="currentPassword"
              type="password"
            />
            {errorForm.get("currentPassword")?.hasError && (
              <FormHelperText>
                {errorForm.get("currentPassword").message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl error={errorForm.get("newPassword")?.hasError}>
            <FormLabel>Nouveau mot de passe (minimum 8 caractères)</FormLabel>
            <Input
              placeholder="Entrez le nouveau mot de passe..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ width: "80%" }}
              name="newPassword"
              type="password"
            />
            {errorForm.get("newPassword")?.hasError && (
              <FormHelperText>
                {errorForm.get("newPassword").message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl error={errorForm.get("confirmNewPassword")?.hasError}>
            <FormLabel>Confimer le nouveau mot de passe</FormLabel>
            <Input
              placeholder="Confirmez le nouveau mot de passe..."
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              sx={{ width: "80%" }}
              name="confirmNewPassword"
              type="password"
            />
            {errorForm.get("confirmNewPassword")?.hasError && (
              <FormHelperText>
                {errorForm.get("confirmNewPassword").message}
              </FormHelperText>
            )}
          </FormControl>

          <Box
            width={"100%"}
            height={"15%"}
            display={"flex"}
            justifyContent={"center"}
          >
            <CustomButton
              height={"100%"}
              width={"40%"}
              backgroundColor={colors.buttonDark}
              hoverColor={colors.buttonDarkHover}
              textColor={colors.titleBackDark}
              type={"submit"}
              clickMethod={handleSubmit}
            >
              Sauvegarder
            </CustomButton>
          </Box>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default ModalEditPassword;
