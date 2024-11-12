/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Typography } from "@mui/joy";
import { useSelector } from "react-redux";
import { PICTURES_DIR } from "../../../../utils/constants";
import { useEffect, useState } from "react";

const ResultPDF = () => {
  const thematicState = useSelector((state) => state.thematic);
  const stateUser = useSelector((state) => state.user);

  const [resultThematic, setResultThematic] = useState(new Map());
  const [explanations, setExplanations] = useState(new Map());

  // Initializing explanations info for differents scores
  useEffect(() => {
    let explanationsTmp = new Map();

    explanationsTmp.set("Ambition", {
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
    });

    explanationsTmp.set("Acuité", {
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
    });

    explanationsTmp.set("Assertivité", {
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
    });

    explanationsTmp.set("Audace", {
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
    });

    explanationsTmp.set("Agilité", {
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
    });

    setExplanations(explanationsTmp);
  }, []);

  useEffect(() => {
    if (explanations.size > 0) {
      let resultThematicTmp = new Map();

      for (let thematic of thematicState.thematics) {
        let convertedScore = 0;
        //   Get scores for the thematic of the last save
        let logForThematic = stateUser?.saves[
          stateUser.nbOfSaves - 1
        ].logScores.filter((log) => log.thematic._id === thematic._id);

        //   Set score
        if (logForThematic.length > 0) {
          const divider =
            Math.floor((logForThematic[0].scoreMaxPossible / 10) * 100) / 100;
          convertedScore =
            Math.floor((logForThematic[0].scoreGot / divider) * 100) / 100;
        }

        //   Set result text
        let title = "";
        let content = "";
        let footer = "";
        if (convertedScore < 5) {
          title = explanations.get(thematic?.name).weak.title;
          content = explanations.get(thematic?.name).weak.content;
          footer = explanations.get(thematic?.name).weak.footer;
        } else if (convertedScore >= 5 && convertedScore < 7) {
          title = explanations.get(thematic?.name).medium.title;
          content = explanations.get(thematic?.name).medium.content;
          footer = explanations.get(thematic?.name).medium.footer;
        } else {
          title = explanations.get(thematic?.name).excellent.title;
          content = explanations.get(thematic?.name).excellent.content;
          footer = explanations.get(thematic?.name).excellent.footer;
        }
        resultThematicTmp.set(thematic.name, {
          convertedScore,
          title,
          content,
          footer,
        });
      }

      setResultThematic(resultThematicTmp);
    }
  }, [explanations]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        // height: `${thematicState?.thematics.length * 50}%`,
        gap: 5,
        paddingTop: "2%",
        backgroundImage: `url(${PICTURES_DIR}/background_images/bg_result_page.jpg)`,
        backgroundSize: "100% 100%",
      }}
    >
      {thematicState?.thematics.length > 0 &&
        thematicState.thematics.map((thematic, index) => {
          return (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginLeft: "2%",
                height: "50%",
                width: "100%",
                gap: 3,
              }}
            >
              {/* Header */}
              <Box
                display={"flex"}
                alignItems={"center"}
                width={"100%"}
                gap={2}
              >
                {/* Title */}
                <Typography textColor={"white"} level="h2">
                  {thematic.name}
                </Typography>
                {/* Gauge score  */}
                <Box
                  height={"100%"}
                  width={`70%`}
                  position={"relative"}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  {/* Gauge bar */}
                  <img
                    src={`${PICTURES_DIR}/results/Couleur_${thematic?.name}.svg`}
                    height={"100%"}
                    width={`${
                      resultThematic.get(thematic?.name)?.convertedScore * 10
                    }%`}
                    style={{ position: "absolute", left: 0 }}
                  />
                  <Typography
                    level="title-lg"
                    textColor={"white"}
                    fontWeight={400}
                    sx={{ zIndex: 100 }}
                  >{`${
                    resultThematic.get(thematic?.name)?.convertedScore
                  }/10`}</Typography>
                </Box>
              </Box>

              {/* Main content */}
              <Box
                width={"60%"}
                height={"80%"}
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
                  {resultThematic.get(thematic?.name)?.title}
                </Typography>

                {/* Content */}
                <Typography level="body-md" textAlign={"center"} padding={"5%"}>
                  {resultThematic.get(thematic?.name)?.content}
                </Typography>

                {/* Footer */}
                <Typography
                  level="h4"
                  textAlign={"center"}
                  marginBottom={"10%"}
                >
                  {resultThematic.get(thematic?.name)?.footer}
                </Typography>
              </Box>
            </Box>
          );
        })}
    </Box>
  );
};

export default ResultPDF;
