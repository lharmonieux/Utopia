/* eslint-disable react/prop-types */
import { Box, CircularProgress, Typography } from "@mui/joy";
import { colors } from "../utils/colors";
import "animate.css";
import { useSelector } from "react-redux";
import { PICTURES_DIR } from "../utils/constants";
import { selectionEffect } from "../utils/cssReact";
import "../assets/css/fullHD.css";

const Towns = ({
  objectTownSelected,
  setObjectTownSelected,
  setContainsFeedback,
  setFeedback,
}) => {
  const stateActs = useSelector((state) => state.act);
  const stateTowns = useSelector((state) => state.town);

  const displayDescription = (idElement) => {
    const descriptionBox = document.querySelector(`#${idElement}`);
    if (descriptionBox) {
      const computedStyle = window.getComputedStyle(descriptionBox);
      const displayValue = computedStyle.getPropertyValue("display");
      displayValue == "none"
        ? (descriptionBox.style.display = "block")
        : (descriptionBox.style.display = "none");
      descriptionBox.classList.add("animate__bounceIn");

      descriptionBox.addEventListener("animationend", () =>
        descriptionBox.classList.remove("animate__bounceIn")
      );
    }
  };

  const handleSelectedTown = (selectedTown) => {
    //If selected again
    if (selectedTown._id == objectTownSelected?._id) {
      setObjectTownSelected(null);
      setContainsFeedback(false);
      setFeedback({});
    } else {
      setObjectTownSelected(selectedTown);
      setContainsFeedback(true);
      setFeedback({
        content: selectedTown?.feedback?.text,
        title: "",
        hasQuestion: false,
        img: selectedTown?.feedback?.img,
      });
    }
  };

  return (
    <Box
      alignItems={"center"}
      justifyContent={"center"}
      width={"100%"}
      height={`100%`}
      zIndex={100}
    >
      {stateActs.currentQuestion ? (
        <Box width={"100%"} height={"100%"} position={"relative"}>
          {stateTowns.towns?.map((town) => (
            <Box
              key={town._id}
              width={"15%"}
              height={"5%"}
              position={"absolute"}
              top={`${town.top}%`}
              left={`${town.left}%`}
            >
              <Box
                width={"100%"}
                height={"100%"}
                display={"flex"}
                flexDirection={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                {/* Button's img  */}
                <img
                  src={`${PICTURES_DIR}/acte_1/question_2/7b.svg`}
                  width={"10%"}
                  height={"45%"}
                />

                {/* Button label  */}
                {town?.labelImg && (
                  <img
                    alt={town?.name}
                    src={`${PICTURES_DIR}/${town?.labelImg}`}
                    width={"85%"}
                    height={"100%"}
                  />
                )}
              </Box>

              {!town.labelImg && (
                <>
                  {/* GIF */}
                  <Box
                    position={"absolute"}
                    width={"20%"}
                    height={"50%"}
                    top={`22%`}
                    left={`-4%`}
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                      displayDescription(
                        `description-${town?.name.split(" ").join("-")}`
                      );
                    }}
                  >
                    <img
                      src={`${PICTURES_DIR}//acte_1/question_2/7.gif`}
                      width={"100%"}
                      height={"100%"}
                    />
                  </Box>

                  {/* town's description */}
                  <Box
                    zIndex={1000}
                    width={"15vw"}
                    height={"35vh"}
                    display={"none"}
                    position={"absolute"}
                    top={`-250%`}
                    left={`20%`}
                    sx={[
                      {
                        cursor: "pointer",
                        backgroundImage: `url(${PICTURES_DIR}/${town?.descriptionImg})`,
                        backgroundSize: "100% 100%",
                      },
                      objectTownSelected?._id == town?._id &&
                        selectionEffect(town),
                    ]}
                    id={`description-${town?.name.split(" ").join("-")}`}
                    className="animate__animated"
                  >
                    <Box
                      width={"100%"}
                      height={"100%"}
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"center"}
                    >
                      <Box
                        width={"60%"}
                        height={"20%"}
                        marginTop={"3%"}
                        marginLeft={"15%"}
                      >
                        <Typography
                          level="title-lg"
                          textColor={colors.titleBackLight}
                          fontWeight={400}
                          textAlign={"center"}
                          id={"town-name"}
                        >
                          {town?.name}
                        </Typography>
                      </Box>

                      <Box
                        width={"100%"}
                        height={"40%"}
                        display={"flex"}
                        alignItems={"center"}
                      >
                        <Typography
                          level="body-xs"
                          paddingLeft={2}
                          paddingRight={2}
                          paddingTop={1}
                          textAlign={"center"}
                          id={"town-desc"}
                        >
                          {town?.description}
                        </Typography>
                      </Box>

                      {/* Button "chosir" */}
                      <Box
                        width={"75%"}
                        height={"15%"}
                        marginTop={"5%"}
                        marginLeft={"-18%"}
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        onClick={() => handleSelectedTown(town)}
                      >
                        <Typography
                          level="title-lg"
                          textColor={colors.titleBackLight}
                          fontWeight={400}
                          textAlign={"center"}
                        >
                          Choisir
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          ))}
        </Box>
      ) : (
        <Box
          height={"100%"}
          width={"100%"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <CircularProgress variant="soft" color="success" />
        </Box>
      )}
    </Box>
  );
};

export default Towns;
