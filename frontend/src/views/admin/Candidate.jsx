/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Chip,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Table,
  Typography,
} from "@mui/joy";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import apiRequest from "../../api/requestAPI";
import { useSelector } from "react-redux";
import { IoMdAdd } from "react-icons/io";
import IconButtonCustom from "../../components/IconButtonCustom";
import { colors } from "../../utils/colors";
import { FaExclamationCircle } from "react-icons/fa";
import CustomButton from "../../components/CustomButton";
import SnackBarCustom from "../../components/SnackBarCustom";
import Loading from "../Loading";
import { generatePassword } from "../../utils/generatePassword";
import FormattedPageAdmin from "./FormattedPageAdmin";

const Candidate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentProject } = location.state || {};

  const authState = useSelector((state) => state.auth);
  const stateActs = useSelector((state) => state.act);

  //States
  const [gamers, setGamers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddGamerModal, setOpenAddGamerModal] = useState(false);
  const [newGamerLastName, setNewGamerLastName] = useState("");
  const [newGamerFirstName, setNewGamerFirstName] = useState("");
  const [newGamerEmail, setNewGamerEmail] = useState("");
  const [newGamerError, setNewGamerError] = useState("");
  const [newGamerSuccess, setNewGamerSuccess] = useState("");
  const [openSnackBarSuccess, setOpenSnackBarSuccess] = useState(false);
  const [csvFile, setCsvFile] = useState("");

  //Functions
  const handleAddGamer = async (lastname = "", firstname = "", email = "") => {
    if (
      openAddGamerModal &&
      (!newGamerLastName || !newGamerFirstName || !newGamerEmail)
    ) {
      setNewGamerError("Veuillez renseigner tous les champs");
    } else {
      setNewGamerError("");
      //generate random password for gamer
      const password = generatePassword(15);

      try {
        const result = await apiRequest(
          "users/register",
          "post",
          authState.token,
          {
            data: {
              lastname: newGamerLastName || lastname,
              firstname: newGamerFirstName || firstname,
              email: newGamerEmail || email,
              password,
              role: "JOUEUR",
              project: currentProject.projectId,
            },
          }
        );

        if (result.response.status >= 200 && result.response.status < 300) {
          setNewGamerSuccess("Candidat ajouté avec succès");
          setGamers([...gamers, result.response.data.user]);
          setOpenAddGamerModal(false);
          initializeAddGamerForm();
          setOpenSnackBarSuccess(true);
        } else {
          setNewGamerError(result.response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const initializeAddGamerForm = () => {
    setNewGamerLastName("");
    setNewGamerFirstName("");
    setNewGamerEmail("");
    setNewGamerError("");
  };

  const addSeveralGamer = async () => {
    const reader = new FileReader();
    let lines = [];
    reader.readAsText(csvFile);

    reader.onload = (e) => {
      const data = e.target.result;
      lines = data.split(/\r\n|\n/);

      lines.forEach((line) => {
        // FAIRE DES PROMESSES
        const fields = line.split(",");
        handleAddGamer({
          lastname: fields[0],
          firstname: fields[1],
          email: fields[2],
        });
      });

      window.location.reload();
    };
  };

  //useEffect
  useEffect(() => {
    // Set gamers|candidates for project
    if (currentProject) {
      apiRequest("users/project", "get", authState.token, {
        params: {
          projectId: currentProject.projectId,
        },
      })
        .then((res) => {
          if (res.response.status >= 200 && res.response.status < 300) {
            setGamers(res.response.data.users);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
          setGamers([]);
          setLoading(false);
        });
    } else {
      window.location.href = "/admin/projects";
    }
  }, [currentProject, authState.token]);

  useEffect(() => {
    // If a csv file is selected for adding several gamers
    if (csvFile) {
      addSeveralGamer();
    }
  }, [csvFile]);

  return (
    <>
      {!loading ? (
        <FormattedPageAdmin
          headerTitle={"Candidats"}
          justifyContent={"flex-start"}
          backPage={{ pathname: "/admin/projects", state: null }}
          gap={2}
          paddingTop={2}
        >
          {/* Main content */}
          {/* Add user's BUTTON */}
          <Box
            width={"100%"}
            height={"10%"}
            display={"flex"}
            justifyContent={"center"}
          >
            <Box
              width={"80%"}
              height={"100%"}
              display={"flex"}
              justifyContent={"center"}
              gap={2}
            >
              {/* Add one gamer */}
              <Box width={"25%"} height={"100%"}>
                <IconButtonCustom
                  icon={<IoMdAdd />}
                  text={"Ajouter un candidat"}
                  textColor={colors.titleBackLight}
                  bgcolor={colors.buttonLight}
                  hoverColor={colors.buttonLightHover}
                  onClick={() => setOpenAddGamerModal(true)}
                />
              </Box>

              {/* Add multiple gamers */}
              <FormControl
                sx={{
                  width: "40%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <FormLabel>
                  Ajouter plusieurs candidats via un fichier CSV
                </FormLabel>
                <input
                  type="file"
                  onChange={(e) => setCsvFile(e.target.files[0])}
                  accept=".csv"
                />
              </FormControl>
            </Box>
          </Box>
          {gamers.length === 0 ? (
            <Typography level="h2" textAlign={"center"} paddingTop={5}>
              Aucun candidat
            </Typography>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Email</th>
                  <th>Avancement</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {gamers.map((gamer) => (
                  <tr key={gamer.userId}>
                    <td style={{ wordWrap: "break-word" }}>{gamer.lastname}</td>
                    <td style={{ wordWrap: "break-word" }}>
                      {gamer.firstname}
                    </td>
                    <td style={{ wordWrap: "break-word" }}>{gamer.email}</td>
                    <td style={{ wordWrap: "break-word" }}>{`${
                      gamer.saves.length * (100 / stateActs.acts?.length)
                    }%`}</td>
                    <td>
                      <CustomButton
                        backgroundColor={colors.buttonDark}
                        hoverColor={colors.buttonDarkHover}
                        textColor={colors.titleBackDark}
                        clickMethod={() => {
                          navigate("/admin/candidates/details", {
                            state: { gamer, currentProject },
                          });
                        }}
                      >
                        Voir les résultats
                      </CustomButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {/* Modal new gamer */}
          <Modal
            open={openAddGamerModal}
            onClose={() => {
              setOpenAddGamerModal(false);
              initializeAddGamerForm();
            }}
          >
            <ModalDialog minWidth={"30%"} sx={{ height: "40%" }}>
              <ModalClose variant="outlined" />
              <DialogTitle>Nouveau candidat</DialogTitle>
              <DialogContent>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <Input
                    placeholder="Nom..."
                    value={newGamerLastName}
                    onChange={(e) => setNewGamerLastName(e.target.value)}
                    fullWidth
                  />

                  <Input
                    placeholder="Prénom..."
                    value={newGamerFirstName}
                    onChange={(e) => setNewGamerFirstName(e.target.value)}
                    fullWidth
                  />

                  <Input
                    placeholder="Email..."
                    value={newGamerEmail}
                    onChange={(e) => setNewGamerEmail(e.target.value)}
                    fullWidth
                    type="email"
                  />

                  {newGamerError && (
                    <Chip
                      color="danger"
                      startDecorator={<FaExclamationCircle />}
                    >
                      {newGamerError}
                    </Chip>
                  )}

                  <CustomButton
                    backgroundColor={colors.buttonLight}
                    textColor={colors.titleBackLight}
                    width={"50%"}
                    height={"15%"}
                    hoverColor={colors.buttonLightHover}
                    clickMethod={() => {
                      handleAddGamer();
                    }}
                  >
                    Ajouter
                  </CustomButton>
                </Box>
              </DialogContent>
            </ModalDialog>
          </Modal>

          {/* Snackbar success */}
          {newGamerSuccess && (
            <SnackBarCustom
              open={openSnackBarSuccess}
              vertical={"top"}
              horizontal={"right"}
              color={"success"}
              onClose={() => {
                setOpenSnackBarSuccess(false);
                setNewGamerSuccess("");
              }}
              text={newGamerSuccess}
            />
          )}
        </FormattedPageAdmin>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Candidate;
