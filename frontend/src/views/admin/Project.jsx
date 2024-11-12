/* eslint-disable react-hooks/exhaustive-deps */
import {
  Autocomplete,
  Box,
  Chip,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Textarea,
  Typography,
} from "@mui/joy";
import IconButtonCustom from "../../components/IconButtonCustom";
import { IoMdAdd } from "react-icons/io";
import { MdDone } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { colors } from "../../utils/colors";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import CustomButton from "../../components/CustomButton";
import apiRequest from "../../api/requestAPI";
import SnackBarCustom from "../../components/SnackBarCustom";
import { storeNewProject } from "../../utils/redux/projectSlice";
import { storeNewCompany } from "../../utils/redux/companySlice";
import { useNavigate } from "react-router-dom";
import { MdError } from "react-icons/md";
import FormattedPageAdmin from "./FormattedPageAdmin";

const Project = () => {
  const dispatch = useDispatch();
  //   States
  const userState = useSelector((state) => state.user);
  const authState = useSelector((state) => state.auth);

  const projectState = useSelector((state) => state.project);

  const [projectsToDisplay, setProjectsToDisplay] = useState([]);
  const [searchedProject, setSearchedProject] = useState(null);
  const [openAddProjectModal, setOpenAddProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectEmailText, setNewProjectEmailText] = useState("");
  const [projectError, setProjectError] = useState("");
  const [projectSuccess, setProjectSuccess] = useState("");

  const companyState = useSelector((state) => state.company);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchedCompany, setSearchedCompany] = useState(null);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [companyError, setCompanyError] = useState("");
  const [companySuccess, setCompanySuccess] = useState("");
  const [displayAddCompanyForm, setDisplayAddCompanyForm] = useState(false);
  const [openSnackBarSuccess, setOpenSnackBarSuccess] = useState(false);
  const [openSnackBarError, setOpenSnackBarError] = useState(false);

  const navigate = useNavigate();
  // Functions
  const handleAddProject = async () => {
    if (!newProjectName || selectedCompany === null || !newProjectEmailText) {
      setProjectError("Veuillez renseigner tous les champs");
    } else {
      setProjectError("");
      apiRequest("project", "post", authState.token, {
        data: {
          name: newProjectName,
          admin: userState.idUser,
          company: selectedCompany.companyId,
          email_message: newProjectEmailText,
        },
      })
        .then((res) => {
          if (res.response.status >= 200 && res.response.status < 300) {
            setProjectSuccess(res.response.data.message);

            // Store project in redux
            dispatch(
              storeNewProject({
                ...res.response.data.project,
                company: selectedCompany,
              })
            );

            // Initialize states
            setOpenAddProjectModal(false);
            setNewProjectName("");
            setNewProjectEmailText("");
            setSelectedCompany(null);
            setOpenSnackBarSuccess(true);
          } else {
            setProjectError(res.response.data.message);
            setOpenAddProjectModal(false);
            setNewProjectName("");
            setNewProjectEmailText("");
            setSelectedCompany(null);
            setOpenSnackBarError(true);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleAddCompany = async () => {
    if (!newCompanyName) {
      setCompanyError("Veuillez renseigner le nom de l'entreprise");
    } else {
      setCompanyError("");
      apiRequest("company", "post", authState.token, {
        data: { name: newCompanyName },
      })
        .then((res) => {
          if (res.response.status >= 200 && res.response.status < 300) {
            setCompanySuccess(res.response.data.message);

            // Store company in redux
            dispatch(storeNewCompany(res.response.data.company));

            // Initialize states
            setNewCompanyName("");
            setDisplayAddCompanyForm(false);
          } else {
            setCompanyError(res.response.data.message);
            setNewCompanyName("");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    setProjectsToDisplay(projectState.projects);
  }, [projectState.projects]);

  useEffect(() => {
    let projectsToDisplayTmp = projectState.projects;
    if (searchedProject) {
      projectsToDisplayTmp = projectState.projects.filter(
        (project) => project.name === searchedProject.name
      );
    }

    if (searchedCompany) {
      projectsToDisplayTmp = projectState.projects.filter(
        (project) => project.company.name === searchedCompany.name
      );
    }

    setProjectsToDisplay(projectsToDisplayTmp);
  }, [searchedCompany, searchedProject]);

  return (
    <FormattedPageAdmin
      headerTitle={"Mes projets"}
      backPage={{ pathname: "/admin/home", state: {} }}
    >
      {/* Main content */}
      <Box
        bgcolor={"lightgray"}
        width={"100%"}
        flex={1}
        borderRadius={10}
        display={"flex"}
        flexDirection={"column"}
        gap={10}
      >
        {/* Form area */}
        <Box
          width={"100%"}
          height={"10%"}
          display={"flex"}
          justifyContent={"center"}
          position={"relative"}
        >
          {/* Add project button */}
          <Box width={"20%"} height={"100%"} marginTop={3}>
            <IconButtonCustom
              icon={<IoMdAdd />}
              text={"Ajouter un projet"}
              textColor={colors.titleBackLight}
              bgcolor={colors.buttonLight}
              hoverColor={colors.buttonLightHover}
              onClick={() => setOpenAddProjectModal(true)}
            />
          </Box>

          {/* Search area */}
          <Box width={"35%"} position={"absolute"} left={0} top={20}>
            <Autocomplete
              placeholder="Nom du client"
              options={
                searchedProject?.name
                  ? companyState.companies?.filter(
                      (company) =>
                        company.name === searchedProject?.company?.name
                    )
                  : companyState.companies
              }
              getOptionLabel={(option) => option.name}
              value={searchedCompany}
              onChange={(event, newValue) => setSearchedCompany(newValue)}
            />
          </Box>

          <Box width={"35%"} position={"absolute"} right={0} top={20}>
            <Autocomplete
              placeholder="Nom du projet"
              options={
                searchedCompany?.name
                  ? projectState.projects?.filter(
                      (project) =>
                        project.company.name === searchedCompany?.name
                    )
                  : projectState.projects
              }
              getOptionLabel={(option) => option.name}
              value={searchedProject}
              onChange={(event, newValue) => {
                setSearchedProject(newValue);
              }}
            />
          </Box>
        </Box>

        {/* Projetc list's box */}
        <Box display={"flex"} flex={1} width={"100%"}>
          {projectsToDisplay?.length === 0 ? (
            <Typography level="h3" textAlign={"center"} width={"100%"}>
              Aucun projet existant
            </Typography>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                width: "100%",
                height: "100%",
                flexWrap: "wrap",
                gap: 2,
                overflow: "auto",
              }}
            >
              {projectsToDisplay?.map((project) => (
                <Box
                  key={project.projectId}
                  width={"40%"}
                  height={"30%"}
                  bgcolor={colors.buttonDark}
                  borderRadius={10}
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  gap={2}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: colors.buttonDarkHover,
                    },
                  }}
                  onClick={() =>
                    navigate("/admin/candidates", {
                      state: { currentProject: project },
                    })
                  }
                >
                  <Typography level="h4" textColor={colors.titleBackDark}>
                    {project.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* Modal Add project */}
      <Modal
        open={openAddProjectModal}
        onClose={() => setOpenAddProjectModal(false)}
      >
        <ModalDialog
          sx={{
            width: "30%",
            height: "50%",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <ModalClose variant="outlined" />
          <DialogTitle>Nouveau projet</DialogTitle>
          <DialogContent sx={{ width: "100%" }}>
            <Box
              width={"100%"}
              height={"100%"}
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              gap={2}
            >
              <FormControl sx={{ width: "100%" }}>
                <Input
                  placeholder="Nom du projet"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  fullWidth
                  color={projectError ? "danger" : "primary"}
                />
              </FormControl>

              <Box display={"flex"} gap={2} width={"100%"}>
                {/* Form autocomplete */}
                <FormControl sx={{ width: "60%" }}>
                  <Autocomplete
                    placeholder="Nom de l'entreprise"
                    value={selectedCompany || null}
                    options={companyState.companies}
                    getOptionLabel={(option) => option.name}
                    onChange={(e, value) => {
                      setSelectedCompany(value);
                    }}
                    color={projectError ? "danger" : "primary"}
                    disabled={displayAddCompanyForm}
                  />
                  {companySuccess && (
                    <FormHelperText sx={{ color: "green" }}>
                      {companySuccess}
                    </FormHelperText>
                  )}
                </FormControl>

                {/* Add company's button */}
                <Box width={"30%"}>
                  <IconButtonCustom
                    icon={<IoMdAdd size={20} />}
                    text={"Ajouter"}
                    onClick={() => {
                      setDisplayAddCompanyForm(!displayAddCompanyForm);
                      !displayAddCompanyForm && setNewCompanyName("");
                    }}
                  />
                </Box>
              </Box>
              {/* Add company if visible */}
              {displayAddCompanyForm && (
                <Box display={"flex"} gap={2}>
                  <FormControl>
                    <Input
                      placeholder="Nouvelle entreprise"
                      value={newCompanyName}
                      onChange={(e) => setNewCompanyName(e.target.value)}
                      color={companyError ? "danger" : "primary"}
                    />
                    {companyError && (
                      <FormHelperText sx={{ color: "red" }}>
                        {companyError}
                      </FormHelperText>
                    )}
                  </FormControl>

                  {/* Save company's button */}
                  <IconButtonCustom
                    icon={<MdDone fontWeight={"700"} />}
                    bgcolor={"lightgreen"}
                    onClick={() => handleAddCompany()}
                  />

                  {/* Cancel company's button */}
                  <IconButtonCustom
                    icon={<RxCross2 fontWeight={"700"} />}
                    bgcolor={"red"}
                    onClick={() => {
                      setDisplayAddCompanyForm(false);
                      setNewCompanyName("");
                    }}
                  />
                </Box>
              )}

              {/* Define email message for the project */}
              <FormControl sx={{ width: "100%" }}>
                <Textarea
                  minRows={3}
                  maxRows={7}
                  placeholder="Corps de l'email..."
                  value={newProjectEmailText}
                  onChange={(e) => setNewProjectEmailText(e.target.value)}
                  color={projectError ? "danger" : "primary"}
                />
              </FormControl>

              {projectError && (
                <Chip startDecorator={<MdError />} color="danger">
                  {projectError}
                </Chip>
              )}

              <CustomButton
                width={"30%"}
                height={"15%"}
                backgroundColor={colors.buttonLight}
                textColor={colors.titleBackLight}
                hoverColor={colors.buttonLightHover}
                clickMethod={() => handleAddProject()}
              >
                Ajouter
              </CustomButton>
            </Box>
          </DialogContent>
        </ModalDialog>
      </Modal>

      {/* Snack bar success */}
      {projectSuccess && (
        <SnackBarCustom
          open={openSnackBarSuccess}
          onClose={() => {
            setProjectSuccess("");
            setOpenSnackBarSuccess(false);
          }}
          text={projectSuccess}
          vertical={"top"}
          horizontal={"right"}
          color={"success"}
        />
      )}

      {/* Snack bar error */}
      {projectError && (
        <SnackBarCustom
          open={openSnackBarError}
          onClose={() => {
            setProjectError("");
            setOpenSnackBarError(false);
          }}
          text={projectError}
          vertical={"top"}
          horizontal={"right"}
          color={"danger"}
        />
      )}
    </FormattedPageAdmin>
  );
};

export default Project;
