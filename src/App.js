import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/pages/Login/index";
import Signup from "./components/pages/Signup/index";
import Home from "./components/pages/Home/index";
import Footer from "./components/Footer";
import Room from "./components/pages/Room/index";
import Profile from "./components/pages/Profile/index";
import Friends from "./components/pages/Friends/index";
import Messages from "./components/pages/Messages/index";
import API from "./utils/API";

// Import and init socket globally one time (bugfix)
import io from "socket.io-client";

const socket = io("http://localhost:3002");

function App() {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState(0);
  const [username, setUsername] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Login
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      API.isValidToken(savedToken).then((tokenData) => {
        if (tokenData.isValid) {
          setToken(savedToken);
          setUserId(tokenData.user.id);
          setUsername(tokenData.user.username);
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem("token");
        }
      });
    }
  }, []);

  // Logout
  const logout = () => {
    setToken("");
    setUserId(0);
    setIsLoggedIn(false);
    localStorage.removeItem("token");
  };

  // AB: Room ID creation
  const [roomId, setRoomId] = useState("");
  useEffect(() => {
    handleHost();
  }, []);
  const handleHost = () => {
    const genId = Math.floor(Math.random() * 100000);
    setRoomId(genId);
  };

  return (
    <div>
      <BrowserRouter>
        <Header isLoggedIn={isLoggedIn} userId={userId} logout={logout} />
        <Routes>
          <Route
            path="/home"
            element={
              <Home
                socket={socket}
                isLoggedIn={isLoggedIn}
                token={token}
                userId={userId}
                username={username}
                roomId={roomId}
              />
            }
          />
          <Route
            path="/login"
            element={
              <Login
                setToken={setToken}
                setUserId={setUserId}
                setUsername={setUsername}
                setIsLoggedIn={setIsLoggedIn}
              />
            }
          />
          <Route
            path="/signup"
            element={
              <Signup
                setToken={setToken}
                setUserId={setUserId}
                setUsername={setUsername}
                setIsLoggedIn={setIsLoggedIn}
              />
            }
          />
          <Route
            path={`/room/:roomId`}
            element={<Room socket={socket} username={username} />}
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/friends" element={<Friends />} />
          <Route
            path="/messages"
            element={
              <Messages
                isLoggedIn={isLoggedIn}
                token={token}
                userId={userId}
                username={username}
              />
            }
          />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
