import { useEffect, useState } from "react";
import CancelIcon from "./assets/CancelIcon.js";
import "./App.css";
import { v4 as uuidv4 } from "uuid";
import ChatMessage from "./components/chatMessage.js";
import moment from "moment";

function App() {
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [sessionId, setSessionId] = useState();
  const [userInput, setUserInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      message: "Hi I'm Eloghosa's Bot. What's your name.",
      type: "bot",
      timeStamp: moment().startOf('day').fromNow()
    },
  ]);

 

  const handleSend = async (e) => {
    const timeStamp =moment().startOf('day').fromNow(); 
    e.preventDefault();
    if (userInput === "") return;
    setChatMessages([
      ...chatMessages,
      {
        message: userInput,
        type: "user",
        timeStamp
      },
      {
        message: "Loading...",
        type: "bot",
        timeStamp
      },
    ]);
    try {
      const res = await fetch(
        "http://remediai-ai-service.azurewebsites.net/chat",
        {
          method: "POST",
          body: JSON.stringify({
            session_id: sessionId,
            user_input: userInput,
          }),
        }
      );
      setUserInput("");
      const data = await res.json();
      setChatMessages([
        ...chatMessages,
        {
          message: data?.response,
          type: "bot",
          timeStamp
        },
      ]);
    } catch (error) {
      setChatMessages([
        ...chatMessages,
        {
          message: userInput,
          type: "user",
          timeStamp
        },
        {
          message: "Loading...",
          type: "bot",
          timeStamp
        },
        {
          message:
            error?.message ||
            "Sorry, I'm having trouble connecting to the server",
          type: "bot",
        },
      ]);
      setUserInput("");
      console.error(error);
    }
  };

  useEffect(() => {
    setSessionId(uuidv4());
  }, []);

  return (
    <div className="chat__container">
      <form onSubmit={handleSend}>
        <div
          className={`chat__window__container ${
            showChatWindow ? "return__to__original" : ""
          }`}
        >
          <div className="chat__window__head">
            <p>Conversation with Bot</p>{" "}
            <CancelIcon
              onClick={() => {
                setShowChatWindow(false);
              }}
            />{" "}
          </div>
          <div className="chat__window__messages__container">
            <div className="chat__window__today_date">
              <p style={{color: 'black'}}>{moment().format('YYYY-MM-DD')}</p>
            </div>
            {chatMessages.map((message, index) => {
              return <ChatMessage message={message} key={index} />;
            })}
          </div>
          <div className="chat__window__bottom">
            <input
              type="text"
              className="chat__window__input"
              value={userInput}
              placeholder="Write your message here"
              onChange={(e) => {
                setUserInput(e.target.value);
              }}
            />
            <button className="chat__window__send__button" type="submit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="send-icon"
              >
                <path d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"></path>
              </svg>
            </button>
          </div>
        </div>
      </form>
      <button
        onClick={() => {
          setShowChatWindow(true);
        }}
        className="chat__container__cta"
      >
        Show chat window
      </button>
    </div>
  );
}

export default App;
