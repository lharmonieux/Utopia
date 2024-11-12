/* eslint-disable react/prop-types */
import {
  Box,
  Chip,
  DialogContent,
  DialogTitle,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
} from "@mui/joy";
import { PICTURES_DIR } from "../utils/constants";
import IconButtonCustom from "./IconButtonCustom";
import { TiArrowBackOutline } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoMdAdd } from "react-icons/io";
import { colors } from "../utils/colors";
import { useState } from "react";
import { generatePassword } from "../utils/generatePassword";
import apiRequest from "../api/requestAPI";
import SnackBarCustom from "./SnackBarCustom";
import { FaExclamationCircle } from "react-icons/fa";
import CustomButton from "./CustomButton";

const Header = ({ title, backPage }) => {
  const navigate = useNavigate();
  const stateUser = useSelector((state) => state.user);
  const authState = useSelector((state) => state.auth);

  //States
  const [openAddAdminModal, setOpenAddAdminModal] = useState(false);
  const [newAdminLastName, setNewAdminLastName] = useState("");
  const [newAdminFirstName, setNewAdminFirstName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminError, setNewAdminError] = useState("");
  const [newAdminSuccess, setNewAdminSuccess] = useState("");
  const [openSnackBarSuccess, setOpenSnackBarSuccess] = useState(false);

  //Functions
  const initializeAddAdminForm = () => {
    setNewAdminLastName("");
    setNewAdminFirstName("");
    setNewAdminEmail("");
    setNewAdminError("");
  };

  const handleAddAdmin = async () => {
    if (!newAdminLastName || !newAdminFirstName || !newAdminEmail) {
      setNewAdminError("Veuillez renseigner tous les champs");
    } else {
      setNewAdminError("");
      //generate random password for gamer
      const password = generatePassword(15);

      try {
        const result = await apiRequest(
          "users/register",
          "post",
          authState.token,
          {
            data: {
              lastname: newAdminLastName,
              firstname: newAdminFirstName,
              email: newAdminEmail,
              password,
              role: "ADMIN",
            },
          }
        );

        if (result.response.status >= 200 && result.response.status < 300) {
          setNewAdminSuccess("Consultant ajouté avec succès");
          setOpenAddAdminModal(false);
          initializeAddAdminForm();
          setOpenSnackBarSuccess(true);
        } else {
          setNewAdminError(result.response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleClickBack = () => {
    navigate(backPage.pathname, { state: backPage?.state });
  };
  return (
    <>
      <Box
        width={"100%"}
        height={"15%"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        {/* Logo header  */}
        <Box width={"20%"} height={"100%"}>
          <img
            src={PICTURES_DIR + "/Logo - couleurs + blanc.svg"}
            alt="logo_exploria"
            width={"100%"}
            height={"100%"}
          />
        </Box>

        {/* Title header  */}
        <Box
          width={"60%"}
          height={"100%"}
          display={"flex"}
          alignItems={"center"}
        >
          <Typography level="h1" textColor="white">
            {title}
          </Typography>
        </Box>

        {/* Back button */}
        <Box
          position={"absolute"}
          left={"-10%"}
          top={"5%"}
          width={"6%"}
          height={"5%"}
        >
          <IconButtonCustom
            icon={<TiArrowBackOutline size={35} color="white" />}
            border="none"
            onClick={handleClickBack}
          />
        </Box>

        {/* Add admin button */}
        {stateUser?.role?.name === "SUPERADMIN" && (
          <Box
            position={"absolute"}
            left={"90%"}
            top={"5%"}
            width={"20%"}
            height={"7%"}
          >
            <IconButtonCustom
              icon={<IoMdAdd size={25} />}
              border="none"
              onClick={() => setOpenAddAdminModal(true)}
              text={"Ajouter un consultant"}
              textColor={colors.titleBackLight}
              bgcolor={colors.buttonLight}
              hoverColor={colors.buttonLightHover}
            />
          </Box>
        )}

        {/* Snackbar success */}
        {newAdminSuccess && (
          <SnackBarCustom
            open={openSnackBarSuccess}
            vertical={"top"}
            horizontal={"right"}
            color={"success"}
            onClose={() => {
              setOpenSnackBarSuccess(false);
              setNewAdminSuccess("");
            }}
            text={newAdminSuccess}
          />
        )}
      </Box>

      {/* Modal new Admin */}
      <Modal
        open={openAddAdminModal}
        onClose={() => {
          setOpenAddAdminModal(false);
          initializeAddAdminForm();
        }}
      >
        <ModalDialog minWidth={"30%"} sx={{ height: "40%" }}>
          <ModalClose variant="outlined" />
          <DialogTitle>Nouveau consultant</DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Input
                placeholder="Nom..."
                value={newAdminLastName}
                onChange={(e) => setNewAdminLastName(e.target.value)}
                fullWidth
              />

              <Input
                placeholder="Prénom..."
                value={newAdminFirstName}
                onChange={(e) => setNewAdminFirstName(e.target.value)}
                fullWidth
              />

              <Input
                placeholder="Email..."
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                fullWidth
                type="email"
              />

              {newAdminError && (
                <Chip color="danger" startDecorator={<FaExclamationCircle />}>
                  {newAdminError}
                </Chip>
              )}

              <CustomButton
                backgroundColor={colors.buttonLight}
                textColor={colors.titleBackLight}
                width={"50%"}
                height={"15%"}
                hoverColor={colors.buttonLightHover}
                clickMethod={() => {
                  handleAddAdmin();
                }}
              >
                Ajouter
              </CustomButton>
            </Box>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </>
  );
};

export default Header;
