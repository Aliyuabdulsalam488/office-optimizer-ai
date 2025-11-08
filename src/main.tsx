import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const Main = () => {
  useEffect(() => {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return <App />;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Main />
  </StrictMode>
);
