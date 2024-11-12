import { Box, Typography } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { colors } from "../../utils/colors";
import FormattedPageAdmin from "./FormattedPageAdmin";

const HomeAdmin = () => {
  const navigate = useNavigate();
  return (
    <FormattedPageAdmin headerTitle={"Espace administrateur"}>
      {/* Main content */}
      <Box
        width={"100%"}
        flex={1}
        display={"flex"}
        justifyContent={"space-evenly"}
        alignItems={"center"}
      >
        {/* Project's box */}
        <Box
          width={"30%"}
          height={"30%"}
          border={"1px solid gray"}
          borderRadius={10}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          bgcolor={colors.buttonLight}
          onClick={() => navigate("/admin/projects")}
          sx={{ cursor: "pointer" }}
        >
          <Typography
            level="title-lg"
            textAlign={"center"}
            textColor={colors.titleBackLight}
          >
            Mes projets
          </Typography>
        </Box>

        {/* Act's box */}
        <Box
          width={"30%"}
          height={"30%"}
          border={"1px solid gray"}
          borderRadius={10}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          bgcolor={colors.buttonLight}
        >
          <Typography
            level="title-lg"
            textAlign={"center"}
            textColor={colors.titleBackLight}
          >
            Actes
          </Typography>
        </Box>
      </Box>
    </FormattedPageAdmin>
  );
};

export default HomeAdmin;
