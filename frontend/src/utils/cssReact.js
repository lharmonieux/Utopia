/* eslint-disable react/prop-types */
export const textAreaStyle = {
  fontSize:
    window.innerWidth >= 1920
      ? "1.7em"
      : window.innerWidth < 1024 && window.innerWidth >= 800
      ? "1em"
      : window.innerWidth < 800
      ? "0.6em"
      : "1.3em",
  padding: 3,
  height: "100%",
  width: "100%",
  border: "none",
  backgroundColor: "transparent",
  outline: "none",
  marginLeft: 10,
  resize: "none",
};

export const selectionEffect = (element) => {
  return {
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    transform: `${!element?.choiceImg ? "scale(0.9)" : "scale(1)"}`,
    borderRadius: !element?.choiceImg ? "10px" : "0px", // Coins arrondis lorsqu'il est zoomé
    boxShadow: !element?.choiceImg
      ? "0px 0px 10px 10px rgb(227, 183, 36)"
      : "none",
  };
};
