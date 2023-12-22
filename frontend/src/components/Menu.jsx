import { Drawer, Box, List, ListItem, ListItemButton } from "@mui/joy";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const Menu = ({ showDrawer, setShowDrawer, setShowSummary }) => {
  const navigate = useNavigate();
  return (
    <Drawer
      anchor="left"
      open={showDrawer}
      onClose={() => setShowDrawer(false)}
    >
      <Box role="presentation" variant="soft">
        <List>
          <ListItem>
            <ListItemButton
              onClick={() => {
                navigate("/user/home");
                setShowDrawer(false);
              }}
            >
              Accueil
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={() => setShowSummary(true)}>
              Sommaire
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>Se déconnecter</ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Menu;
