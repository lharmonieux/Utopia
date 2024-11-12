/* eslint-disable react/prop-types */
import { Box } from "@mui/joy";
import Header from "./Header";

const FormattedPage = ({
  headerTitle,
  justifyContent,
  backPage,
  alignItems,
  gap,
  paddingTop,
  children,
}) => {
  return (
    <Box
      height={"100%"}
      width={"100%"}
      display={"flex"}
      flexDirection={"column"}
      position={"relative"}
    >
      {/* HEADER */}
      <Header title={headerTitle} backPage={backPage} />
      <Box
        bgcolor={"lightgray"}
        width={"100%"}
        height={"84%"}
        borderRadius={10}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={justifyContent}
        alignItems={alignItems}
        gap={gap}
        paddingTop={paddingTop}
        // overflow={"auto"}
      >
        {children}
      </Box>
    </Box>
  );
};

export default FormattedPage;
