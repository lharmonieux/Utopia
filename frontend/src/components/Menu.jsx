import { Drawer, Box, List, ListItem, ListItemButton } from "@mui/joy";

// eslint-disable-next-line react/prop-types
const Menu = ({ showDrawer, setShowDrawer, setShowSummary }) => {
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
                window.location.href = "/user/home";
                setShowDrawer(false);
              }}
            >
              Accueil
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              onClick={() => {
                window.location.href = "/user/summary";
                setShowDrawer(false);
              }}
            >
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
