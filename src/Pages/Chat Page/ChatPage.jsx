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

import React, { useEffect, useMemo, useRef, useState } from "react";
import MessageTemplate from "../../Components/MessageTemplate";
import LocationTemplate from "../../Components/LocationTemplate";
import MobileMenu from "../../Components/MobileMenu";
import ShareBox from "../../Components/ShareBox";
import { FaMicrophone, FaShare } from "react-icons/fa";
import MicroPhone from "../../Components/MicroPhone";

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
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesContainerRef = useRef(null);
  const [hasError, setHasError] = useState(false);
  const [userNo, setUserNo] = useState(0);
  const [isMicOpen, setMicOpen] = useState(false);

  const [micHide, setMicHide] = useState(false);
  const [showShareBox, setShowShareBox] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [iamTyping, setIamTyping] = useState(false);
  const typingTimeOut = useRef();
  const [userTyping, setUserTyping] = useState({
    isTyping: false,
    data: "",
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Options
  // this will work only if there is ? mark in url
  const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
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
    const localusername = localStorage.getItem("username");
    const localroom = localStorage.getItem("room");

    if (localusername !== username || localroom !== room) {
      return navigate("/");
    }
    socket.emit("join", { username, room }, (data) => {
      // if (!data.status) {
      //   // Display popup if the user is already in a room
      //   Swal.fire({
      //     title: "Already in Room",
      //     text: "You are already in a room. Redirecting to home page...",
      //     icon: "info",
      //     showConfirmButton: false,
      //     timer: 2000, // Adjust the timer as needed
      //     willClose: () => {
      //       navigate("/"); // Redirect to home page
      //     },
      //   });
      //   // console.log("new part")
      // } else {
      //   setHasError(false);
      //   toast.success(`${username} joined the room!`);
      // }
      toast.success(`${username} joined the room!`);
    });
  }, []);
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
      console.log(message)
      scrollToBottom();
    });

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
    socket.on('event', (text) =>{
      console.log("Hello");
      console.log(text);
    })
    return () => {
      socket.off("message");
      socket.off("locationMessage");
      socket.off("roomData");
    };

  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = e.target.elements.message.value;
    if (message.trim() === "") {
      return;
    }
    socket.emit("sendMessage", message, (error) => {
      if (error) {
        console.log(error);
      } else {
        setInputMessage("");
        setTypingUsers([]);
        console.log("Message delivered!");
      }
    });
  };

  const handleTyping = (e) => {
    setInputMessage(e.target.value);
    const message = e.target.value.trim();

    if (!iamTyping) {
      socket.emit("START_TYPING");
      setIamTyping(true);
    }

    if (typingTimeOut.current) clearTimeout(typingTimeOut.current);

    typingTimeOut.current = setTimeout(() => {
      socket.emit("STOP_TYPING");
      setIamTyping(false);
    }, [500]);
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

  useEffect(() => {
    const handleTypingStart = (data) => {
      setUserTyping({
        ...userTyping,
        isTyping: true,
        data,
      });
    };

    const handleTypingStop = (data) => {
      // console.log("STOP TYPING>>>", data);
      setUserTyping({
        ...userTyping,
        isTyping: false,
        data: "",
      });
    };

    // Add event listeners when component mounts
    socket?.on("USER_TYPING_START", handleTypingStart);
    socket?.on("STOP_USER_TYPING", handleTypingStop);

    // Clean up event listeners when component unmounts
    return () => {
      socket?.off("USER_TYPING_START", handleTypingStart);
      socket?.off("STOP_USER_TYPING", handleTypingStop);
    };
  }, []);

  // window.onbeforeunload = function () {
  //   // This string won't actually be shown in modern browsers, but returning it triggers the confirmation dialog
  //   return "Do you really want to leave?";
  // };

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
          localStorage.clear("username");
          localStorage.clear("room");
          socket.disconnect(); // Disconnect the socket connection
          console.log("Disconnected from the chat server!");
          window.location.href = "/";
        } else {
          console.log("No active chat connection to disconnect.");
        }
      }
    });
  }

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicHide(true);
      return;
    }
    const recognition = new SpeechRecognition();

    recognition.onstart = () => {
      console.log("Speech recognition service has started");
      setMicOpen(true);
    };

    recognition.onaudioend = () => {
      console.log("Audio capturing ended");
      setMicOpen(false);
    };

    recognition.onresult = (event) => {
      const currentTranscript = event.results[0][0].transcript;
      console.log(currentTranscript);
      setMicOpen(false);
      setInputMessage((prev) => prev + currentTranscript);
    };

    recognition.start();
  };

  return (
    <div className="flex chat-ui-container p-10 flex-row gap-5 w-full justify-center h-full">
      <div className="left-container flex flex-col gap-5 width 5/12">
        <RoomInfo room={room} userNo={userNo}></RoomInfo>
        <UserList users={users}></UserList>
      </div>
      <div className="right-container w-9/12 flex flex-col gap-5 h-full">
        <UserStausBar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          username={username}
          handleDisconnectConfirmation={handleDisconnectConfirmation}
        ></UserStausBar>
        <div className="chat-interface bg-darkChat p-5 rounded-lg p-10 w-full max-h-[65vh] min-h-[65vh]">
          <ChatUI className = "h-full" messages={messages} user={username}></ChatUI>
        </div>
        <div className="send-bar bg-darkChat rounded-lg p-2 px-8 w-full">
          <div className="compose p-0 m-0 grow w-full">
            <form
              id="message-form"
              className="flex items-center justify-center items-center"
              onSubmit={handleSubmit}
            >
              <input
                name="message"
                placeholder="Message"
                className="rounded-lg m-0 outline-none bg-darkChat border-0 w-9/12 text-white"
                value={inputMessage}
                onChange={handleTyping}
                required
              />
              {!micHide && (
                <FaMicrophone
                  size={40}
                  className={`m-2 mr-3 ${
                    darkMode ? "text-white" : "text-pure-greys-600"
                  }`}
                  onClick={startListening}
                />
              )}
              <div className="flex items-center gap-5">
                <button
                  type="submit"
                  className=" flex items-center justify-center gap-4 bg-primaryOrange w-[100px] h-[50px] text-white px-10 py-4 rounded-lg "
                >
                  Send
                  <i className="material-icons">send</i>
                </button>
                <button
                  id="send-location"
                  onClick={handleSendLocation}
                  className="bg-primaryOrange rounded-[50%] w-[50px] h-[50px] text-white hover:bg-[]"
                >
                  <i className="material-icons">location_on</i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
