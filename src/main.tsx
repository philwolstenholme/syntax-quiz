import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

if (import.meta.env.PROD) {
  console.log(
    "%cSyntax Quiz",
    "font-size:1.5em;font-weight:bold",
    "\nThink you know JS/TS syntax? Prove it.\nhttps://github.com/philwolstenholme/syntax-quiz",
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
