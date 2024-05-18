import React from 'react'

function UserMessage({message, time}) {
  return (
    <>
        <div className="user-msg-container flex flex-col items-end w-max">
            <div className="user-msg">
                <p className="user-msg__text bg-primaryOrange w-max p-4 rounded-tr-3xl rounded-tl-3xl rounded-bl-3xl text-white">{message}</p>
            </div>
            <div className="time">
                <span className="user-msg__time text-white text-xs">{time}</span>
            </div>
        </div>
    </>
  )
}

export default UserMessage;