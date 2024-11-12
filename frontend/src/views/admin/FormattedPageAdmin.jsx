/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import FormattedPage from "../../components/FormattedPage";

const FormattedPageAdmin = ({
  children,
  headerTitle,
  justifyContent,
  backPage,
  alignItems,
  gap,
  paddingTop,
}) => {
  const authState = useSelector((state) => state.auth);

  // Right control
  useEffect(() => {
    if (authState.token) {
      const decoded_token = jwtDecode(authState.token);
      if (decoded_token?.UserInfo?.role?.name === "JOUEUR") {
        window.location.href = "/user";
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

export default FormattedPageAdmin;
