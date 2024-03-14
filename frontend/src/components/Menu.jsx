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
import { useSelector } from "react-redux";

// eslint-disable-next-line react/prop-types
const Menu = ({ showDrawer, setShowDrawer }) => {
  const stateActs = useSelector((state) => state.act);
  const listValues = [
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
      title: "Récapitulatif",
      href: "/result",
      icon: stateActs.currentAct ? <TbDetailsOff /> : <TbDetails />,
      disabled: stateActs.currentAct ? true : false,
    },
  ];
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
          {listValues.map((value, index) => (
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
