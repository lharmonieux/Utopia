import { Box, Divider, Input, Typography } from "@mui/joy";
import { useSelector } from "react-redux";
import IconButtonCustom from "../../../components/IconButtonCustom";
import { RiEdit2Fill } from "react-icons/ri";
import { colors } from "../../../utils/colors";
import { useState } from "react";
import ModalEditPassword from "./components/ModalEditPassword";
import SnackBarCustom from "../../../components/SnackBarCustom";
import FormattedPageAdmin from "../FormattedPageAdmin";

const Profile = () => {
  const stateUser = useSelector((state) => state.user);

  //States
  const [openEditPasswordModal, setOpenEditPasswordModal] = useState(false);
  const [successEditPassword, setSuccessEditPassword] = useState("");

  return (
    <FormattedPageAdmin
      headerTitle={"Mon profil"}
      backPage={{ pathname: "/admin/home", state: {} }}
      alignItems={"center"}
      gap={2}
      paddingTop={5}
    >
      {/* Lastname */}
      <Box
        width={"50%"}
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography level="title-md">Nom</Typography>
        <Input disabled={true} value={stateUser?.lastname || ""} />
      </Box>
      <Divider />

      {/* Firstname */}
      <Box
        width={"50%"}
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography level="title-md">Prenom</Typography>
        <Input disabled={true} value={stateUser?.firstname || ""} />
      </Box>
      <Divider />

      {/* Email */}
      <Box
        width={"50%"}
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography level="title-md">Adresse mail</Typography>
        <Input disabled={true} value={stateUser?.email || ""} />
      </Box>
      <Divider />

      {/* Password */}
      <Box
        width={"50%"}
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        gap={2}
      >
        <Typography level="title-md">Mot de passe</Typography>
        <Input disabled={true} value={"******"} />
        <Box width={"10%"}>
          <IconButtonCustom
            icon={<RiEdit2Fill size={20} />}
            bgcolor={colors.buttonLight}
            hoverColor={colors.buttonLightHover}
            textColor={colors.titleBackLight}
            border={"none"}
            onClick={() => setOpenEditPasswordModal(true)}
          />
        </Box>
      </Box>

      {/* Edit password modal */}
      {openEditPasswordModal && (
        <ModalEditPassword
          open={openEditPasswordModal}
          setOpen={setOpenEditPasswordModal}
          setSuccess={setSuccessEditPassword}
        />
      )}

      {/* SnackBar succes edit password */}
      {successEditPassword && (
        <SnackBarCustom
          open={true}
          vertical="top"
          horizontal="right"
          onClose={() => setSuccessEditPassword("")}
          text={successEditPassword}
          color={"success"}
        />
      )}
    </FormattedPageAdmin>
  );
};

export default Profile;
