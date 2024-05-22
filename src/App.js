import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "../src/Pages/HomePage/HomePage";
import ChatPage from "../src/Pages/Chat Page/ChatPage";
import AnimatedCursor from "react-animated-cursor";
import { useEffect, useState } from "react";
import { WiDaySunny } from "react-icons/wi";
import { MdModeNight } from "react-icons/md";
import { UseAuthProvider } from "./Context/UserAuthContext";
import { PrivateRoute } from "./Components/PrivateRoute";

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

  const hanldeDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`w-screen h-[100vh] ${
        darkMode ? "bg-[#263238]" : "bg-white"
      }  flex  flex-col font-inter`}
    >
      <div className="App"></div>

      {/* <button
        className=" flex justify-end absolute xl:top-2 xl:right-48 top-16 right-5 sm:top-2 sm:right-48 md:top-2 md:right-48  lg:top-2 lg:right-48 z-40  "
        onClick={hanldeDarkMode}
      >
        {darkMode ? (
          <MdModeNight className="xl:text-7xl lg:text-7xl md:text-7xl sm:text-7xl text-6xl  text-white" />
        ) : (
          <WiDaySunny className=" xl:text-7xl lg:text-7xl md:text-7xl sm:text-7xl text-6xl" />
        )}
      </button> */}
      <UseAuthProvider>
        <Routes>
          <Route path="/" element={<HomePage darkMode={darkMode} />} />
          <Route
            path="chat"
            element={
              <PrivateRoute>
                <ChatPage darkMode={darkMode} setDarkMode={setDarkMode} />
              </PrivateRoute>
            }
          />
        </Routes>
      </UseAuthProvider>
    </div>
  );
}

export default App;
