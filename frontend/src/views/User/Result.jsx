import {
  Box,
  CircularProgress,
  DialogContent,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
} from "@mui/joy";
import { PICTURES_DIR } from "../../utils/constants";
import { colors } from "../../utils/colors";
import { useEffect, useState } from "react";
import apiRequest from "../../api/requestAPI";
import { useSelector } from "react-redux";
import CustomButton from "../../components/CustomButton";
import "animate.css";

const Result = () => {
  const [thematics, setThematics] = useState([]);
  const [thematicToDesc, setThematicToDesc] = useState({});
  const [logScores, setLogScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [explanationsMap, setExplanationsMap] = useState(new Map());
  const [openModal, setOpenModal] = useState(false);
  const authState = useSelector((state) => state.auth);
  const stateUser = useSelector((state) => state.user);

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

  useEffect(() => {
    // Fetch user's scores
    if (stateUser.saves.length > 0 && logScores.length == 0) {
      setLogScores(
        Object.entries(stateUser.saves[stateUser.saves.length - 1].logScores)
      );
    }

    if (logScores.length > 0) {
      let scoresUser = new Map();
      for (let [key, value] of logScores) {
        scoresUser.set(key, value);
      }

      apiRequest("/thematic", "get", authState.token).then((response) => {
        let result = response.response.data.filter(
          (thematic) => thematic.name != "Immersion"
        );
        result = result.map((thematic) => ({
          ...thematic,
          scoreValue:
            (scoresUser.get(thematic.name) * 10) /
            scoresUser.get(`${thematic.name}-max-score`),
        }));
        setThematics(result);
        setLoading(false);
      });

      const tmpExplanationsMap = new Map();
      for (let exp of explanations) {
        tmpExplanationsMap.set(exp.thematic, exp.value);
      }
      setExplanationsMap(tmpExplanationsMap);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateUser, logScores]);

  const modalDesc = () => {
    return (
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        className="animate__animated animate__zoomIn"
      >
        <ModalDialog
          sx={{
            backgroundImage: `url(${PICTURES_DIR}/background_images/bg_result_page.jpg)`,
            backgroundSize: "100% 100%",
            height: "80%",
            width: "60%",
          }}
        >
          <ModalClose variant="outlined" sx={{ zIndex: 100 }} />
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              display={"flex"}
              flexDirection={"column"}
              height={"90%"}
              width={"50%"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Typography level="h1" textColor={"white"}>
                {thematicToDesc.name}
              </Typography>

              {/* Gauge score  */}
              <Box
                height={"5%"}
                width={`100%`}
                position={"relative"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                {/* Gauge bar */}
                <img
                  src={`${PICTURES_DIR}/results/Couleur_${thematicToDesc.name}.svg`}
                  height={"100%"}
                  width={`${thematicToDesc.scoreValue * 10}%`}
                  style={{ position: "absolute", left: 0 }}
                />
                <Typography
                  level="title-lg"
                  textColor={"white"}
                  fontWeight={400}
                  sx={{ zIndex: 100 }}
                >{`${
                  Math.floor(thematicToDesc.scoreValue * 100) / 100
                }/10`}</Typography>
              </Box>

              {/* Main content */}
              <Box
                height={"80%"}
                width={"100%"}
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
                justifyContent={"space-between"}
                sx={{
                  backgroundImage: `url(${PICTURES_DIR}/results/bg_detail.svg)`,
                  backgroundSize: "100% 100%",
                }}
              >
                {/* Title */}
                <Typography level="h4" marginTop={"10%"}>
                  {thematicToDesc.scoreValue < 5
                    ? explanationsMap.get(thematicToDesc.name).weak.title
                    : thematicToDesc.scoreValue >= 5 &&
                      thematicToDesc.scoreValue < 7
                    ? explanationsMap.get(thematicToDesc.name).medium.title
                    : explanationsMap.get(thematicToDesc.name).excellent.title}
                </Typography>

                {/* Content */}
                <Typography level="body-md" textAlign={"center"} padding={"5%"}>
                  {thematicToDesc.scoreValue < 5
                    ? explanationsMap.get(thematicToDesc.name).weak.content
                    : thematicToDesc.scoreValue >= 5 &&
                      thematicToDesc.scoreValue < 7
                    ? explanationsMap.get(thematicToDesc.name).medium.content
                    : explanationsMap.get(thematicToDesc.name).excellent
                        .content}
                </Typography>

                {/* Footer */}
                <Typography level="h4" textAlign={"center"} marginBottom={"10%"}>
                  {thematicToDesc.scoreValue < 5
                    ? explanationsMap.get(thematicToDesc.name).weak.footer
                    : thematicToDesc.scoreValue >= 5 &&
                      thematicToDesc.scoreValue < 7
                    ? explanationsMap.get(thematicToDesc.name).medium.footer
                    : explanationsMap.get(thematicToDesc.name).excellent.footer}
                </Typography>
              </Box>
            </Box>
          </DialogContent>
        </ModalDialog>
      </Modal>
    );
  };

  return (
    <>
      {!loading ? (
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
          <img
            width={"50%"}
            height={"25%"}
            src={`${PICTURES_DIR}/Logo - couleurs + blanc.svg`}
          />

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
              <Box marginTop={"5%"} padding={"5%"} sx={{
                "media screen and (min-width: 1920px) and (max-width: 2559px)":{
                  padding: "10%"
                }
              }}>
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
            >
              {thematics &&
                thematics.map((thematic) => {
                  const marks = `${
                    Math.floor(thematic.scoreValue * 100) / 100
                  }/10`;
                  return (
                    <Box
                      key={thematic._id}
                      display={"flex"}
                      flexDirection={"column"}
                      justifyContent={"space-evenly"}
                      width={"95%"}
                      height={"15%"}
                    >
                      <Box
                        display={"flex"}
                        height={"40%"}
                        alignItems={"center"}
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
                          {thematic.name} : {marks}
                        </Typography>

                        <CustomButton
                          height={"80%"}
                          level={"title-sm"}
                          style={{ marginLeft: "5%" }}
                          clickMethod={() => {
                            setThematicToDesc(thematic);
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
                          width={`${thematic.scoreValue * 10}%`}
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"center"}
                          position={"relative"}
                        >
                          <img
                            src={`${PICTURES_DIR}/results/Couleur_${thematic.name}.svg`}
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
            </Box>
          </Box>

          {openModal && modalDesc()}
        </Box>
      ) : (
        <Box
          width={"100%"}
          height={"100%"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <CircularProgress variant="outlined" />
        </Box>
      )}
    </>
  );
};

export default Result;
