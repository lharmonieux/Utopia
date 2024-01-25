export const scrollBehaviour = (
  direction,
  idContainer,
  widthMove,
  alignMvnt
) => {
  const characterContainer = document.querySelector(`#${idContainer}`);
  if (characterContainer) {
    if (alignMvnt == "row") {
      characterContainer.scrollLeft += widthMove * direction;
    } else {
      characterContainer.scrollTop += widthMove * direction;
    }
  }
};
