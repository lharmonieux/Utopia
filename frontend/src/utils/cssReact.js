/* eslint-disable react/prop-types */
export const textAreaStyle = {
  "@media (minWidth: 1280px) and (maxWidth: 1920px)": {
    padding: 3,
  },
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
    transform: `${
      !element?.choiceImg && element.selected ? "scale(0.9)" : "scale(1)"
    }`,
    borderRadius: !element?.choiceImg && element.selected ? "10px" : "0px", // Coins arrondis lorsqu'il est zoomé
    boxShadow:
      !element?.choiceImg && element.selected
        ? "0px 0px 10px 10px rgb(227, 183, 36)"
        : "none",
  };
};
