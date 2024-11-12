/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import {
  Box,
  Checkbox,
  Chip,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalDialog,
  Stack,
  Typography,
} from "@mui/joy";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomButton from "./CustomButton";
import { colors } from "../utils/colors";
import { MdError } from "react-icons/md";
import apiRequest from "../api/requestAPI";
import SnackBarCustom from "./SnackBarCustom";
import { FaArrowDownLong } from "react-icons/fa6";

const GlobalContainer = ({ children }) => {
  // Check if user changed his password for valid his account
  const stateUser = useSelector((state) => state.user);
  const authState = useSelector((state) => state.auth);

  //States
  const [openModalDefinePassword, setOpenModalDefinePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [errorForm, setErrorForm] = useState("");
  const [successDefinePassword, setSuccessDefinePassword] = useState("");
  const [displayRGPD, setDisplayRGPD] = useState(false);

  useEffect(() => {
    if (stateUser.isPasswordChanged === null) return;
    if (stateUser.isPasswordChanged === false) {
      setOpenModalDefinePassword(true);
    } else setOpenModalDefinePassword(false);
  }, [stateUser.isPasswordChanged]);

  //Functions
  const handleSubmitDefinePassword = (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!newPassword || !confirmNewPassword || !isChecked) {
      setErrorForm("Veuillez remplir tous les champs");
      return;
    }

    // Check if newPassword has at least 8 characters
    if (newPassword.length < 8) {
      setErrorForm("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    // Check if passwords are the same
    if (newPassword !== confirmNewPassword) {
      setErrorForm("Les mots de passe ne sont pas identiques");
      return;
    } else {
      apiRequest("/users/define_password", "patch", authState.token, {
        data: { idUser: stateUser.idUser, newPassword },
      })
        .then((resultDefinePassword) => {
          if (
            resultDefinePassword.response.status >= 200 &&
            resultDefinePassword.response.status < 300
          ) {
            setOpenModalDefinePassword(false);
            setSuccessDefinePassword(
              resultDefinePassword.response.data.message
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <Stack
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      height={"97vh"}
      width={"99vw"}
      position={"relative"}
    >
      {children}

      {/* Define password modal */}
      {openModalDefinePassword && (
        <Modal
          open={openModalDefinePassword}
          onClose={() => setOpenModalDefinePassword(false)}
        >
          <ModalDialog sx={{ width: "50%", height: "45%" }}>
            <DialogTitle>
              Définissez votre mot de passe de connexion
            </DialogTitle>
            <DialogContent
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                gap: 2,
                paddingTop: 2,
              }}
            >
              <form
                style={{
                  width: "80%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <FormControl sx={{ width: "100%" }}>
                  <FormLabel>
                    Nouveau mot de passe (8 caractères minimum)
                  </FormLabel>
                  <Input
                    placeholder="Mot de passe"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    fullWidth
                  />
                </FormControl>

                <FormControl sx={{ width: "100%" }}>
                  <FormLabel>Confirmez le nouveau mot de passe</FormLabel>
                  <Input
                    placeholder="Retapez le mot de passe"
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    fullWidth
                  />
                </FormControl>

                {/* RGPD Check */}
                <FormControl
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Box
                    display={"flex"}
                    flexDirection={"row"}
                    gap={2}
                    width={"100%"}
                  >
                    <Checkbox
                      checked={isChecked}
                      onChange={() => {
                        setIsChecked(!isChecked);
                      }}
                      required
                      label={`J'ai lu et j'accepte les conditions et mentions légales quant à l'utilisation de mes données.`}
                    />
                    <CustomButton
                      width={"15%"}
                      backgroundColor={colors.buttonLight}
                      hoverColor={colors.buttonLightHover}
                      clickMethod={() => setDisplayRGPD(!displayRGPD)}
                    >
                      <FaArrowDownLong />
                    </CustomButton>
                  </Box>

                  {/* RGPD Content */}
                  {displayRGPD && (
                    <>
                      <Divider />
                      <Box>
                        <Typography
                          fontWeight={"bold"}
                        >{`Le REGLEMENT GENERAL sur la PROTECTION des DONNEES n°2016/679 nous impose de recueillir le consentement libre et éclairé de toute personne physique dont nous traitons les 
                      données à caractère personnel. En poursuivant ce questionnaire, vous acceptez que vos données soient traitées par le CRECI dans les conditions suivantes :`}</Typography>
                        <br />
                        <Typography
                          fontStyle={"italic"}
                        >{`- Vos données personnelles (nom, prénom, adresse mail) seront traitées conformément aux 2 finalités annoncées : démarche qualité et délivrance de l'attestation individuelle de formation ;`}</Typography>
                        <Typography
                          fontStyle={"italic"}
                        >{`- Les données traitées sont à usage interne au CRECI, avec consultation sur place ponctuelle par un auditeur externe ;`}</Typography>
                        <Typography
                          fontStyle={"italic"}
                        >{`- Une réclamation peut être introduite auprès de la CNIL par l'apprenant ;`}</Typography>
                        <Typography
                          fontStyle={"italic"}
                        >{`- Il n'existe pas de traitement massif ni systématique des données personnelles, qui ne sont pas commercialisées ni transférées vers un pays tiers ou une organisation internationale ;`}</Typography>
                        <Typography
                          fontStyle={"italic"}
                        >{`- Une demande de rectification, d'effacement, de portabilité des données personnelles mais aussi d'opposition au traitement des données ainsi que de retrait du consentement 
                        sont possibles sur simple demande à l'adresse qualite@creci.fr`}</Typography>
                        <Divider />
                      </Box>
                    </>
                  )}
                </FormControl>

                {errorForm && (
                  <Chip color="danger" startDecorator={<MdError />}>
                    {errorForm}
                  </Chip>
                )}

                <CustomButton
                  type={"submit"}
                  backgroundColor={colors.buttonDark}
                  hoverColor={colors.buttonDarkHover}
                  textColor={colors.titleBackDark}
                  width={"40%"}
                  clickMethod={handleSubmitDefinePassword}
                >
                  Enregistrer
                </CustomButton>
              </form>
            </DialogContent>
          </ModalDialog>
        </Modal>
      )}

      {/* Success define password modal */}
      {successDefinePassword && (
        <SnackBarCustom
          open={true}
          vertical="top"
          horizontal="right"
          onClose={() => setSuccessDefinePassword("")}
          text={successDefinePassword}
          color="success"
        />
      )}
    </Stack>
  );
};

export default GlobalContainer;
