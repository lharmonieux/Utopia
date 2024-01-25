export const textArea = {
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 20,
  borderTopRightRadius: 20,
  borderBottomRightRadius: 0,
};

export const selectionEffect = (element) => {
  return {
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    transform: `${!element?.choiceImg && element.selected ? "scale(0.9)" : "scale(1)"}`,
    borderRadius: !element?.choiceImg && element.selected ? "10px" : "0px", // Coins arrondis lorsqu'il est zoomé
    boxShadow: !element?.choiceImg && element.selected ? "0px 0px 10px 10px rgb(227, 183, 36)" : "none",
  };
};
