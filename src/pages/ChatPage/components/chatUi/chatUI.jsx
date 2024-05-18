import React from "react";
import UserMessage from "./components/userMessage";
import OthersMessage from "./components/othersMessage";

function ChatUI({ messages, user }) {
  console.log(messages, user);
  return (
    <>
      <div className="message-box flex flex-col">
      {messages.map((msg, index) =>
        msg.username === user ? (
          <div className="flex flex-row justify-end">
            <UserMessage message={msg} time={msg.createdAt} key={index}></UserMessage>
          </div>
        ) : (
          <div className="flex flex-row justify-start">
            <OthersMessage
              message={msg}
              time={msg.createdAt}
              username={msg.username}
              key={index}
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
