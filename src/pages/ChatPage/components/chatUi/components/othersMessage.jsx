import React from 'react'

function OthersMessage({message, time, username}) {
  return (
    <div>
        <div className="others-msg-container flex flex-col items-start w-max">
            <div className="others-msg">
                <p className="others-msg__text bg-primaryGrey w-max p-4 rounded-tr-3xl rounded-tl-3xl rounded-br-3xl text-black">{message}</p>
            </div>
            <div className="time">
                <span className='userName text-white text-xs'>{username}</span>
                <span className="others-msg__time text-white text-xs">{time}</span>
            </div>
        </div>
    </div>
  )
}

export default OthersMessage;