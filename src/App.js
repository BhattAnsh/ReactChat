import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "../src/pages/HomePage/HomePage";
import ChatPage from "../src/pages/ChatPage/ChatPage";
import { useEffect, useState } from "react";
import { WiDaySunny } from "react-icons/wi";
import { MdModeNight } from "react-icons/md";

function App() {
  // Retrieve dark mode state from local storage or default to false
  const [darkMode, setDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    return savedDarkMode ? JSON.parse(savedDarkMode) : false;
  });

  // Update local storage when dark mode state changes
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const handleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`w-screen min-h-screen ${
        darkMode ? "bg-darkMode" : ""
      } bg-[#ededed] flex flex-col font-inter`}
    >
      <div className="App"></div>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="chat"
          element={<ChatPage darkMode={darkMode} setDarkMode={setDarkMode} />}
        />
      </Routes>
    </div>
  );
}

export default App;
