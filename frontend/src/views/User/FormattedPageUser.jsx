/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import FormattedPage from "../../components/FormattedPage";

const FormattedPageUser = ({
  headerTitle,
  justifyContent,
  backPage,
  alignItems,
  gap,
  paddingTop,
  children,
}) => {
  const authState = useSelector((state) => state.auth);

  // Right control
  useEffect(() => {
    if (authState.token) {
      const decoded_token = jwtDecode(authState.token);
      if (
        decoded_token?.UserInfo?.role?.name === "ADMIN" ||
        decoded_token?.UserInfo?.role?.name === "SUPERADMIN"
      ) {
        window.location.href = "/admin/home";
      }
    }
  }, [authState.token]);

  return (
    <FormattedPage
      headerTitle={headerTitle}
      justifyContent={justifyContent}
      backPage={backPage}
      alignItems={alignItems}
      gap={gap}
      paddingTop={paddingTop}
    >
      {children}
    </FormattedPage>
  );
};

export default FormattedPageUser;
