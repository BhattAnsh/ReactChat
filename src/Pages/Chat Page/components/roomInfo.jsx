import React from "react";

function RoomInfo(props) {
  return (
    <>
      <div className="flex flex-row gap-x-20 bg-darkChat p-5 rounded-lg px-5 items-center h-16">
        <div className="room-no text-white">{props.room.toUpperCase()}</div>
        <div className="no-of-users">
          <span className="text-white bg-primaryOrange p-3 px-5 rounded-lg cursor-pointer flex items-center gap-x-4">
            <i className="material-icons">groups</i>
            {props.userNo} Joined
          </span>
        </div>
      </div>
    </>
  );
}

export default RoomInfo;
