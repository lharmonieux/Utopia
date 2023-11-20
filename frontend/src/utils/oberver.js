const observerComponent = (targetNode, callback) => {
    //Config for the observer
    const observerConfig = {
        attributes: true,
        childList: true,
        subtree: true
    };

    //Creating of observer for monitor mutations
    const observer = new MutationObserver(callback);

    observer.observe(targetNode, observerConfig);
}

export default observerComponent;