import React from "react";

function UserStausBar({darkMode, setDarkMode, username, handleDisconnectConfirmation}) {
  return (
    <>
      <div className="status-bar bg-darkChat p-5 rounded-lg h-16 flex items-center justify-between p-10 w-full">
        <div className="nameAndTime text-white ">
          <div className="username">{username}</div>
          <div className="time text-xs">10:30 PM</div>
        </div>
        <div className="modeAndLeaveButton flex flex-row justify-center items-center gap-4">
          <div className="mode-toggle">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-white"
            >
              <i className="material-icons">
                {darkMode ? "brightness_5" : "brightness_high"}
              </i>
            </button>
          </div>
          <div className="leave-button">
            <button
              onClick={handleDisconnectConfirmation}
              className="text-white flex justify-center items-center bg-primaryOrange p-2 px-5 rounded-lg cursor-pointer gap-2"
            >
              Leave <i className="material-icons">logout</i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserStausBar;
