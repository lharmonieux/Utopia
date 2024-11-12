/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Typography } from "@mui/joy";
import { PICTURES_DIR } from "../../../utils/constants";
import { colors } from "../../../utils/colors";
import { useEffect, useRef, useState } from "react";
import apiRequest from "../../../api/requestAPI";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../../../components/CustomButton";
import "animate.css";
import { useNavigate } from "react-router-dom";
import { ModalDesc } from "./components/ModalDesc";
import { jwtDecode } from "jwt-decode";
import { storeThematics } from "../../../utils/redux/thematicSlice";
import Loading from "../../Loading";
import ResultPDF from "./components/ResultPDF";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import FormattedPageUser from "../FormattedPageUser";

const Result = () => {
  const [thematicToDesc, setThematicToDesc] = useState({});
  const [thematics, setThematics] = useState([]);
  const [logScores, setLogScores] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const authState = useSelector((state) => state.auth);
  const stateUser = useSelector((state) => state.user);
  const thematicState = useSelector((state) => state.thematic);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const resultPDFRef = useRef(null);

  const explanations = [
    {
      thematic: "Ambition",
      value: {
        excellent: {
          title: "Quelle maîtrise !",
          content:
            "Vous savez donner du sens et avoir une vision lointaine et enthousiasmante  à même de mobiliser les acteurs que vous rencontrez. Grâce à cet idéal, vous combattez la routine dans vos interactions et incarnez un esprit de conquête tout en aspirant à un toujours mieux.",
          footer: "Félicitations !",
        },
        medium: {
          title: "Une aptitude à perfectionner !",
          content:
            "Vous arrivez à «rêver» et à avoir une vision claire de ce que vous voudriez mais le réel arrive à vous faire changer de cap. Dans les interactions aux autres, il vous arrive aussi d'être en réaction… en oubliant parfois ce qui vous anime au départ.",
          footer: "Restez vigilants !",
        },
        weak: {
          title: "Un point de manque…",
          content:
            "Mais finalement, une belle opportunité de progrès! Un pragmatisme ne permettant pas toujours la projection, l'aspiration et l'inspiration… Redonner du sens, éveiller le goût pour la conquête, engager autour d'un but commun et motivant, voilà une belle quête…",
          footer: "A vous de jouer !",
        },
      },
    },
    {
      thematic: "Acuité",
      value: {
        excellent: {
          title: "Bravo !",
          content:
            "Vous savez faire preuve d'une très grande sensibilité durant les échanges avec vos interlocuteurs. Pour vous, il semblerait qu'il ne puisse pas y avoir d'engagement possible (de l'autre) sans considération de ce qu'il/elle dit et ce qu'il/elle est",
          footer: "Continuez ainsi !",
        },
        medium: {
          title: "A renforcer encore !",
          content:
            "De bons réflexes et encore quelques espaces de progrès! Vos aptitudes à prendre en compte ce qui vous est offert n'est pas constante et vous cherchez à aller parfois droit au but ! Face à la tentation de la réponse immédiate, il y a la question qui permet d'avancer…",
          footer: "Pensez-y demain !",
        },
        weak: {
          title: "Plus difficile",
          content:
            "Voilà un axe clair de progrès ! Peut-être avez-vous des difficultés à vous aventurer pleinement dans l'univers de l'Autre. Vos capacités à écouter vraiment, à prendre en compte et à «partir de…» l'Autre seront nécessaires pour vos conquêtes futures. ",
          footer: "Allez-y, foncez !",
        },
      },
    },
    {
      thematic: "Assertivité",
      value: {
        excellent: {
          title: "Bravo !",
          content:
            "Vous semblez avoir des convictions fortes ET une véritable aptitude à les tenir face à l'adversité ! Nul doute que cette verticalité vous offre de la crédibilité et un rayonnement dans vos interactions professionnelles",
          footer: "Continuez de vous affirmer !",
        },
        medium: {
          title: "Une force, à aiguiser davantage !",
          content:
            "Même si vous semblez avec des idées claires, il n'apparait pas toujours facile pour vous de les tenir «contre vents et marées» … Des hésitations parfois, des doutes à certains moments vous éloignent des chemins  de l'impact",
          footer: "Osez plus !",
        },
        weak: {
          title: "Point de manque",
          content:
            "Il semblerait que vous cherchiez plus à vous faire apprécier… qu'à bousculer vos interlocuteurs dans leurs idées. Le désaccord est fertile et il permet toujours de faire bouger le ligne… surtout quand le statu quo est établi.",
          footer: "C'est à vous de jouer maintenant !",
        },
      },
    },
    {
      thematic: "Audace",
      value: {
        excellent: {
          title: "Incroyable !",
          content:
            "Vous savez vous aventurer sur des terres parfois éloignées de vous pour chercher à obtenir ce que vous voulez. Vous avez confiance en vous et n'hésitez à oser faire autrement pour faire avancer les choses.",
          footer: "Excellent !",
        },
        medium: {
          title: "De bonnes bases...",
          content:
            "… et de belles opportunités pour générer de nouveaux impacts dans vos interactions ! Il semblerait que certains réflexes reviennent parfois à votre esprit et vous incite à réitérer ce qui a déjà été fait.",
          footer: "Ne succombez pas à la tentation de la facilité !",
        },
        weak: {
          title: "A travailler...",
          content:
            "Voilà un axe qui pourrait vous permettre de faire souffler un vent de fraîcheur dans les situations bloquées. Identifiez une dimension loin de votre style et essayez de la mettre en place… juste pour le plaisir du jeu !",
          footer: "Qui ne tente rien n'a rien !",
        },
      },
    },
    {
      thematic: "Agilité",
      value: {
        excellent: {
          title: "Sublime !",
          content:
            "Avec vous, rien ne semble insurmontable et vous savez changer de chemin quand cela semble nécessaire ! Vous arrivez à penser la complexité sous son angle le plus vertueux et vous savez vous adaptez rapidement face à l'imprévu.",
          footer: "Bravo !",
        },
        medium: {
          title: "Bonne maitise...",
          content:
            "Une capacité au rebond dans certains contextes… mais aussi des situations où la continuité peut vite devenir la référence. Quelle sera votre voie personnelle de progrès dans ce domaine ?",
          footer: "Bonne chance !",
        },
        weak: {
          title: "Compliqué !",
          content:
            "Votre prise en compte de la complexité des situations rencontrées vous amène vers les comportements déjà usités. Voici certainement une belle opportunité de compléter votre jeu et d'aller sur le terrain du renouveau… pour obtenir mieux !",
          footer: "A vous d'oser !",
        },
      },
    },
  ];

  //FUnctions
  const handleGeneratePdf = async () => {
    //   const component = document.querySelector("#resultPDF");

    //   const printWindow = window.open("", "_blank");
    //   printWindow.document.write(
    //     `<html><head>
    //   <meta charset="UTF-8" />
    //   <link rel="icon" type="image/svg+xml" href="" />
    //   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    //   <title>Resultats en PDF</title>
    // </head><body>${component.innerHTML}</body></html>`
    //   );
    //   printWindow.document.close();

    //   printWindow.onload = () => {
    //     printWindow.print();
    //     printWindow.close();
    //   };
    const input = resultPDFRef.current;

    try {
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
      } else {
        let heightLeft = imgHeight;
        let position = 0;

        while (heightLeft > 0) {
          pdf.addImage(imgData, "PNG", 0, position, pageWidth, pageHeight);
          heightLeft -= pageHeight;
          position -= pageHeight;
          if (heightLeft > 0) pdf.addPage();
        }
      }
      pdf.save("Resultats.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

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
  }, []);

  useEffect(() => {
    //Control if you can access to the page
    if (stateUser.role?.name && stateUser.nbOfSaves < 5)
      window.location = "/user";

    // Fetch user's thematics
    if (authState.token) {
      apiRequest("thematic", "get", authState.token, {})
        .then((resultThematics) => {
          if (
            resultThematics.response.status >= 200 &&
            resultThematics.response.status < 300
          ) {
            const thematics = resultThematics.response.data.thematics.filter(
              (thematic) => thematic?.name != "Immersion"
            );
            setThematics(thematics);
            dispatch(storeThematics(thematics));
          }
        })
        .catch((error) => {
          console.log(error);
          navigate("/user");
        });
    }

    // Fetch user's scores
    if (stateUser.saves.length > 0 && logScores.size == 0) {
      let tmpLogScores = new Map();
      for (let score of stateUser.saves[stateUser.nbOfSaves - 1].logScores) {
        if (score.thematic?.name == "Immersion") continue;

        let evaluation = explanations.find(
          (exp) => exp.thematic == score.thematic?.name
        );

        tmpLogScores.set(score.thematic?.name, {
          scoreGot: score.scoreGot,
          scoreMaxPossible: score.scoreMaxPossible,
          evaluation: evaluation?.value,
        });
      }
      setLogScores(tmpLogScores);
      setLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateUser.nbOfSaves]);

  return (
    <>
      {!loading && thematicState.thematics ? (
        <FormattedPageUser
          headerTitle={"Resultats"}
          backPage={{ pathname: "/summary", state: {} }}
        >
          <Box
            width={"100%"}
            height={"100%"}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            sx={{
              backgroundImage: `url(${PICTURES_DIR}/background_images/bg_result_page.jpg)`,
              backgroundSize: "100% 100%",
            }}
          >
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              width={"90%"}
              height={"70%"}
            >
              {/* Left Box */}
              <Box
                width={"45%"}
                height={"70%"}
                display={"flex"}
                flexDirection={"column"}
                sx={{
                  backgroundImage: `url(${PICTURES_DIR}/home/1.svg)`,
                  backgroundSize: "100% 100%",
                }}
              >
                <Box
                  marginTop={"15%"}
                  padding={"5%"}
                  id={"left-box-result-title"}
                >
                  <Typography
                    level="h1"
                    textColor={colors.titleBackDark}
                    textAlign={"center"}
                  >
                    Découvrez votre profil !
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    textColor={"white"}
                    textAlign={"center"}
                    padding={"5%"}
                  >
                    {
                      "Lors de cette aventure, vos choix révèlent vos forces et vos axes de progrès pour obtenir en toutes circonstances l'impact désiré auprès de vos interlocuteurs."
                    }
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    textColor={colors.titleBackDark}
                    textAlign={"center"}
                    level="h3"
                    padding={"5%"}
                  >
                    {"Voici vos résultats"}
                  </Typography>
                </Box>
              </Box>

              {/* Right Box */}
              <Box
                width={"45%"}
                height={"80%"}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"space-evenly"}
                alignItems={"center"}
              >
                {thematics &&
                  logScores.size > 0 &&
                  thematics.map((thematic) => {
                    const divider =
                      Math.floor(
                        (logScores.get(thematic?.name)?.scoreMaxPossible / 10) *
                          100
                      ) / 100;

                    const convertedScore =
                      Math.floor(
                        (logScores.get(thematic?.name)?.scoreGot / divider) *
                          100
                      ) / 100;

                    const marks = `${convertedScore}/10`;

                    return (
                      <Box
                        key={thematic._id}
                        display={"flex"}
                        flexDirection={"column"}
                        justifyContent={"space-evenly"}
                        width={"95%"}
                        height={"20%"}
                      >
                        <Box
                          display={"flex"}
                          height={"40%"}
                          alignItems={"center"}
                          width={"100%"}
                        >
                          {/* Text decorator  */}
                          <img
                            src={`${PICTURES_DIR}/results/2.svg`}
                            height={"230%"}
                            width={"10%"}
                          />

                          <Typography
                            level="h3"
                            textColor={"white"}
                            marginLeft={"-5%"}
                            fontWeight={400}
                          >
                            {thematic?.name} : {marks}
                          </Typography>

                          <CustomButton
                            height={"80%"}
                            level={"title-sm"}
                            style={{
                              marginLeft: "5%",
                              "@media screen and (minWidth: 800px) and (maxWidth: 1023px)":
                                {
                                  width: "40%",
                                },
                            }}
                            clickMethod={() => {
                              setThematicToDesc({
                                ...thematic,
                                convertedScore,
                              });
                              setOpenModal(true);
                            }}
                          >
                            Voir plus
                          </CustomButton>
                        </Box>

                        {/* Score level  */}
                        <Box
                          width={"90%"}
                          height={"50%"}
                          marginLeft={"5%"}
                          sx={{
                            backgroundImage: `url(${PICTURES_DIR}/results/cadre.svg)`,
                            backgroundSize: "100% 100%",
                          }}
                        >
                          <Box
                            height={"100%"}
                            width={`${
                              (logScores.get(thematic?.name)?.scoreGot /
                                divider) *
                              10
                            }%`}
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            position={"relative"}
                          >
                            <img
                              src={`${PICTURES_DIR}/results/Couleur_${thematic?.name}.svg`}
                              height={"80%"}
                              width={"98%"}
                              className="progress-bar"
                              style={{ position: "absolute", left: "1%" }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                <Box height={"10%"} marginTop={"5%"} display={"flex"} gap={3}>
                  <CustomButton
                    disabled={true}
                    height={"100%"}
                    clickMethod={handleGeneratePdf}
                  >
                    Télécharger PDF
                  </CustomButton>

                  <CustomButton
                    height={"100%"}
                    clickMethod={() => navigate("/summary")}
                  >
                    Retour au sommaire
                  </CustomButton>
                </Box>
              </Box>
            </Box>

            {openModal && (
              <ModalDesc
                openModal={openModal}
                setOpenModal={setOpenModal}
                thematicToDesc={thematicToDesc}
                logScores={logScores}
              />
            )}

            <Box
              width={"100vw"}
              height={"100vh"}
              ref={resultPDFRef}
              id="resultPDF"
              display={"none"}
            >
              <ResultPDF />
            </Box>
          </Box>
        </FormattedPageUser>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Result;
