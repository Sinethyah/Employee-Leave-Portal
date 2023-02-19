import React from "react";
//import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import App from "./App";
import * as serviceWorker from "./serviceWorker";
//import { StrictMode } from "react";
import { createRoot } from "react-dom/client"


const rootElement = document.getElementById("root");


const root = createRoot(rootElement);

root.render(
  <BrowserRouter>
      <App />
  </BrowserRouter>
);

serviceWorker.unregister();