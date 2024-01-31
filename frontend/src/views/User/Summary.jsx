import { Box, CircularProgress, Stack, Typography } from "@mui/joy";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PICTURES_DIR } from "../../utils/constants";
import { backgroundSize } from "../../utils/backgroundSizeProvider";
import { colors } from "../../utils/colors";

const Summary = () => {
  const stateActs = useSelector((state) => state.act);
  const domConfig = useSelector((state) => state.dom);
  const navigate = useNavigate();
  return (
    <>
      {stateActs.acts ? (
        <Stack
          spacing={1}
          width={"100%"}
          height={"100%"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          sx={{
            backgroundImage: `url(${PICTURES_DIR}/sommaire_bg.jpg)`,
            backgroundSize: backgroundSize(domConfig.width, domConfig.height),
          }}
        >
          {stateActs?.acts?.map((act) => {
            let actRowImg = "";
            switch (act.status) {
              case "IN PROGRESS":
                actRowImg = `${PICTURES_DIR}/acte_non_valide.svg`;
                break;
              case "DONE":
                actRowImg = `${PICTURES_DIR}/acte_valide.svg`;
                break;
              case "NOT DONE":
                actRowImg = `${PICTURES_DIR}/acte_pas_atteint.svg`;
                break;

              default:
                break;
            }
            return (
              <Box
                key={act._id}
                width={parseInt(domConfig.width * 0.6)}
                height={parseInt(domConfig.height * 0.1)}
                display={"flex"}
                alignItems={"center"}
                onClick={() => {
                  act.status == "IN PROGRESS" && navigate("/game");
                }}
                sx={{
                  backgroundImage: `url(${actRowImg})`,
                  backgroundSize: backgroundSize(
                    domConfig.width * 0.6,
                    domConfig.height * 0.1
                  ),
                  cursor: act.status == "IN PROGRESS" && "pointer",
                }}
              >
                <Typography
                  level="title-lg"
                  textColor={"white"}
                  fontWeight={400}
                  marginLeft={"8%"}
                >
                  {`ACTE ${act.chapter}`}
                </Typography>

                <Typography
                  level="title-lg"
                  textColor={
                    act.status == "DONE"
                      ? colors.titleBackLight
                      : colors.titleBackDark
                  }
                  fontWeight={400}
                  marginLeft={"15%"}
                >
                  {`${act.name}`}
                </Typography>
              </Box>
            );
          })}
        </Stack>
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

      {/* logo */}
      <Box top={"0%"} left={"15%"} position={"absolute"}>
        <img
          src={`${PICTURES_DIR}/Logo - couleurs + blanc.svg`}
          width={domConfig.width * 0.45}
          height={domConfig.height * 0.3}
        />
      </Box>

      {/* decoration  */}
      <Box position={"absolute"} top={0} left={0}>
        <img
          src={`${PICTURES_DIR}/Déco - Charte triangle.svg`}
          height={domConfig.height * 0.2}
          width={domConfig.width * 0.15}
          style={{ transform: "rotate(180deg)" }}
        />
      </Box>

      <Box position={"absolute"} bottom={-4} right={0}>
        <img
          src={`${PICTURES_DIR}/Déco - Charte triangle.svg`}
          height={domConfig.height * 0.3}
          width={domConfig.width * 0.15}
        />
      </Box>
    </>
  );
};

export default Summary;
