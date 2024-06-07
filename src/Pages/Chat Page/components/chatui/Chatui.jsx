import {React, useState, useEffect} from "react";
import UserMessage from "./Components/userMessage";
import OthersMessage from "./Components/othersMessage";

function ChatUI({ messages, user }) {
  let edited_user = user.toLowerCase();
  return (
    <>
      <div className={"message-box flex flex-col overflow-y-scroll overflow-x-hidden max-h-full min-h-full p-5"}>
        {messages.map((msg) =>
          msg.username === edited_user ? (
            <div className="flex flex-row justify-end" key={msg.id}>
              <UserMessage
                message={msg.message}
                time={msg.createdAt}
                key={msg.id}
              ></UserMessage>
            </div>
          ) : (
            <div className="flex flex-row justify-start" key={msg.id}>
              <OthersMessage
                message={msg.message}
                time={msg.createdAt}
                username={msg.username}
                key={msg.id}
              ></OthersMessage>
            </div>
          )
        )}
      </div>
      <div className="typing-status"></div>
    </>
  );
}


export default ChatUI;
