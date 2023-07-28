import React from "react";

export default function ChatMessage({ message }) {
  return (
    <div className="chat__window__conversation">
      {message.type === "bot" && (
        <div className="chat__window__message__avatar">B</div>
      )}
      <div className={`chat__window__message__container__${message.type}`}>
        <span>
          <p> {message.message}</p>
          <p>{message.timeStamp}</p>
        </span>
      </div>
      {message.type === "user" && (
        <div className="chat__window__message__avatar">U</div>
      )}
    </div>
  );
}
