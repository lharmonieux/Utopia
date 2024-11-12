import ReactDOM from "react-dom/client";
import "@fontsource/inter";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./utils/redux/store.js";
import App from "./App.jsx";
import "../src/assets/css/1024screen.css";
import "../src/assets/css/1440screen.css";
import "../src/assets/css/1536screen.css";
import "../src/assets/css/1920screen.css";
import "../src/assets/css/800screen.css";
import "../src/assets/css/601screen.css";
import "../src/assets/css/2560screen.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
