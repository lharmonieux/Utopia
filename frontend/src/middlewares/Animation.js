export const animateOut = (openBool, domElement, callback) => {
    const modal = document.querySelector(domElement);
    if (modal && openBool) {
      modal.classList.add("animate__zoomOut");
      modal.addEventListener("animationend", callback);
    }
  };