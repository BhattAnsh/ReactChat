import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router";
// import MessageTemplate from "./components/MessageTemplate";
// import LocationTemplate from "./components/LocationTemplate";
import Swal from "sweetalert2";
import Mustache from "mustache";
import moment from "moment";
import Qs from "qs";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";
import {
  AiOutlineClose,
  AiOutlineMenu,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import RoomInfo from "./components/roomInfo";
import UserStausBar from "./components/userStatusBar";
import UserList from "./components/userList";
import ChatUI from "..//Chat Page/components/chatui/Chatui";

const socket = io("wss://reactchat-production-f378.up.railway.app/", {
  transports: ["websocket"],
});
// const socket = io('ws://localhost:8080/', { transports: ['websocket'] });

const ChatPage = ({ darkMode, setDarkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [users, setUsers] = useState([]);
  const messagesContainerRef = useRef(null);
  const [userNo, setUserNo] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Options
  // this will work only if there is ? mark in url
  const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  socket.emit("join", { username, room }, (error) => {
    if (error) {
      // Display popup if the user is already in a room
      // Swal.fire({
      //   title: 'Already in Room',
      //   text: 'You are already in a room. Redirecting to home page...',
      //   icon: 'info',
      //   showConfirmButton: false,
      //   timer: 2000, // Adjust the timer as needed
      //   willClose: () => {
      //     navigate('/'); // Redirect to home page
      //   }
      // });
      // console.log("new part")
    } else {
      toast.success(`${username} joined the room!`);
    }
  });
  // useEffect(() => {
  //   socket.on('disconnect', () => {
  //     console.log('Disconnected from the server');
  //     navigate('/');
  //   });

  //   return () => {
  //     socket.off('disconnect');
  //   };
  // }, []);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          username: message.username,
          message: message.text,
          createdAt: moment(message.createdAt).format("h:mm a"),
        },
      ]);
      scrollToBottom();

    }, [messages]);

    socket.on("locationMessage", (message) => {
      console.log(messages);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          username: message.username,
          url: message.url,
          createdAt: moment(message.createdAt).format("h:mm a"),
        },
      ]);
      scrollToBottom();
    });

    socket.on("roomData", ({ room, users }) => {
      setUsers(users);
      setUserNo(users.length);
      console.log("my Users: ", users);
      console.log("room", room);
    });

    return () => {
      socket.off("message");
      socket.off("locationMessage");
      socket.off("roomData");
    };
  }, [messages]);

  useEffect(()=>{
    socket.on("event", (event) =>{
      console.log(event.message);
      console.log("hello");
    })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = e.target.elements.message.value;
    socket.emit("sendMessage", message, (error) => {
      if (error) {
        console.log(error);
      } else {
        setInputMessage("");
        console.log("Message delivered!");
      }
    });
  };

  const handleTyping = () => {
    const message = inputMessage.trim();
    if (message) {
      socket.emit("typing");
    } else return;
  };

  const handleSendLocation = () => {
    if (!navigator.geolocation) {
      return alert("Geolocation is not supported by your browser.");
    }

    navigator.geolocation.getCurrentPosition((position) => {
      socket.emit(
        "sendLocation",
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        () => {
          console.log("Location shared!");
        }
      );
    });
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  window.onbeforeunload = function () {
    return () => {
      "Do you really want to leave?";
      navigate("/");
    };
  };

  function handleDisconnectConfirmation() {
    Swal.fire({
      title: "Disconnect Chat",
      text: "Are you sure you want to disconnect from the chat?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        if (socket) {
          socket.disconnect(); // Disconnect the socket connection
          console.log("Disconnected from the chat server!");
          window.location.href = "/";
        } else {
          console.log("No active chat connection to disconnect.");
        }
      }
    });
  }

  window.onpopstate = function () {
    console.log("hello");

    console.log("new data");
  };

  return (
    <div className="flex chat-ui-container p-10 flex-row gap-5 w-full justify-center">
      <div className="left-container flex flex-col gap-5 width 5/12">
        <RoomInfo room={room} userNo={userNo}></RoomInfo>
        <UserList users={users}></UserList>
      </div>
      <div className="right-container w-9/12 flex flex-col gap-5">
        <UserStausBar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          username={username}
          handleDisconnectConfirmation={handleDisconnectConfirmation}
        ></UserStausBar>
        <div className="chat-interface bg-darkChat p-5 rounded-lg p-10 w-full">
          <ChatUI messages={messages} user={username}></ChatUI>
        </div>
        <div className="send-bar">
          <div className="compose">
            <form
              id="message-form"
              onSubmit={handleSubmit}
              onChange={handleTyping}
            >
              <input
                name="message"
                placeholder="Message"
                className="rounded-lg"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                required
              />

              <button
                type="submit"
                className="focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 cursor-pointer rounded-md bg-brand text-[#fff] bg-[#6674cc] border-brand font-rubik xl:text-lg border xl:px-6 lg:px-6 md:px-6 sm:px-6 h-12 py-2 flex items-center gap-3 text-lg lg:h-[4rem]"
              >
                Send
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <desc></desc>
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                  <path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5"></path>
                </svg>
              </button>
            </form>
            <button
              id="send-location"
              onClick={handleSendLocation}
              className="focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 cursor-pointer rounded-md bg-brand text-[#fff] bg-[#6674cc] border-brand font-rubik xl:text-lg border xl:px-6 lg:px-6 md:px-6 sm:px-6  h-12 py-2 flex items-center gap-3 text-lg lg:h-[4rem]"
            >
              Send location
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <desc></desc>
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <line x1="10" y1="14" x2="21" y2="3"></line>
                <path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
