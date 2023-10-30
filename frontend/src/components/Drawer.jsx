import * as Joy from "@mui/joy";

// eslint-disable-next-line react/prop-types
const Drawer = ({ showDrawer, setShowDrawer, setShowSummary }) => {
  return (
    <Joy.Drawer
      anchor="left"
      open={showDrawer}
      onClose={() => setShowDrawer(false)}
    >
      <Joy.Box role="presentation" variant="soft">
        <Joy.List>
          <Joy.ListItem>
            <Joy.ListItemButton>Se connecter/se déconnecter</Joy.ListItemButton>
          </Joy.ListItem>
          
          <Joy.ListItem>
            <Joy.ListItemButton onClick={() => setShowSummary(true)}>
              Sommaire
            </Joy.ListItemButton>
          </Joy.ListItem>
        </Joy.List>
      </Joy.Box>
    </Joy.Drawer>
  );
};

export default Drawer;
