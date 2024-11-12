/* eslint-disable react-hooks/exhaustive-deps */
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemDecorator,
  Typography,
} from "@mui/joy";
import { FaHome } from "react-icons/fa";
import { MdSummarize } from "react-icons/md";
import { RiLogoutBoxFill } from "react-icons/ri";
import apiRequest from "../api/requestAPI";
import { TbDetails, TbDetailsOff } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { VscProject } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

// eslint-disable-next-line react/prop-types
const Menu = ({ showDrawer, setShowDrawer }) => {
  const stateUser = useSelector((state) => state.user);
  const authState = useSelector((state) => state.auth);

  //States
  const [listMenu, setListMenu] = useState([]);
  const [listValuesGamer, setListValuesGamer] = useState([]);
  const [listValuesAdmin, setListValuesAdmin] = useState([]);

  useEffect(() => {
    setListValuesGamer([
      {
        title: "Accueil",
        href: "/user",
        icon: <FaHome />,
      },
      {
        title: "Sommaire",
        href: "/summary",
        icon: <MdSummarize />,
      },
      {
        title: "Mon profil",
        href: "/profile",
        icon: <CgProfile />,
      },
      {
        title: "Récapitulatif",
        href: "/result",
        icon: stateUser.nbOfSaves < 5 ? <TbDetailsOff /> : <TbDetails />,
        disabled: stateUser.nbOfSaves < 5 ? true : false,
      },
    ]);

    setListValuesAdmin([
      {
        title: "Accueil",
        href: "/admin/home",
        icon: <FaHome />,
      },
      {
        title: "Projets",
        href: "/admin/projects",
        icon: <VscProject />,
      },
      {
        title: "Mon profil",
        href: "/admin/profile",
        icon: <CgProfile />,
      },
    ]);
  }, [stateUser.nbOfSaves]);

  useEffect(() => {
    if (authState.token) {
      const decoded_token = jwtDecode(authState.token);
      if (decoded_token?.UserInfo?.role?.name === "ADMIN" || decoded_token?.UserInfo?.role?.name === "SUPERADMIN") {
        setListMenu(listValuesAdmin);
      } else {
        setListMenu(listValuesGamer);
      }
    }
  }, [authState.token, listValuesGamer, listValuesAdmin]);

  return (
    <Drawer
      anchor="left"
      open={showDrawer}
      onClose={() => setShowDrawer(false)}
      size="sm"
      color="warning"
    >
      <Box role="presentation">
        <List>
          {listMenu?.map((value, index) => (
            <ListItem key={index}>
              <ListItemDecorator>{value.icon}</ListItemDecorator>
              <ListItemButton
                onClick={() => {
                  window.location.href = value.href;
                  setShowDrawer(false);
                }}
                disabled={value.disabled}
                sx={{
                  "&:hover": {
                    border: "1px solid",
                  },
                }}
              >
                <Typography level="title-md">{value.title}</Typography>
              </ListItemButton>
            </ListItem>
          ))}
          {/* Logout  */}
          <ListItem>
            <ListItemDecorator>
              <RiLogoutBoxFill />
            </ListItemDecorator>
            <ListItemButton
              onClick={() => {
                const result = apiRequest("/auth/logout", "post", null, null);
                result.then(() => (window.location.href = "/"));
                setShowDrawer(false);
              }}
              sx={{
                "&:hover": {
                  border: "1px solid",
                },
              }}
            >
              <Typography level="title-md">Déconnexion</Typography>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Menu;
