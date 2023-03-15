import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../../styles/chess.css";
import MultiPlayerGame from "../../chess/MultiPlayerGame";
import "../Room/style.css";

const Room = ({ socket, username }) => {
  const { roomId } = useParams();
  const [userArr, setUserArr] = useState([]);

  console.log(roomId);
  // Emit a join event to the server when a user joins a room on component mount
  useEffect(() => {
    socket.emit("join_room", { roomId: roomId });
  }, []);

  socket.on("user-joined", (userFromSocket) => {
    console.log(`${userFromSocket} has joined the room`);
  });

  const [msgInputted, setMsgInputted] = useState("");
  const [messages, setMessages] = useState([]);

  //   form control
  const handleChatInput = (e) => {
    e.preventDefault();
    setMsgInputted(e.target.value);
  };

  //   emitting the event "send-message" with our username and message from form below
  const sendMsg = (e) => {
    e.preventDefault();
    socket.emit("send_message", {
      room: roomId,
      username: username,
      message: msgInputted,
    });
    console.log(username);
    console.log(msgInputted);
  };

  socket.on("received_message", (newMsg) => {
    const renNewMsg = newMsg.split(":");
    console.log(renNewMsg);
    if (renNewMsg[0] === username) {
      return setMessages([...messages, `You: ${renNewMsg[1]}`]);
    }
    setMessages([...messages, newMsg]);
  });

  return (
    <section>
      <div className="column">
        <div id="roomDiv">
          <div className="leftContainer">
            <div className="component">
              <div className="room-id">
                <h3>Room ID: {roomId}</h3>
              </div>
              <div className="mobileComp">
                <div id="userDiv">
                  <div id="user">
                    <p>{username}</p>
                    <div id="userVideo">user video</div>
                    <div id="userPieces">user pieces captured</div>
                  </div>
                </div>
                <div id="oppDiv">
                  <div id="opponent">
                    <p>oppUser</p>
                    <div id="oppVideo">opp video</div>
                    <div id="oppPieces">opp pieces captured</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="middleContainer">
            <div className="mainComponent">
              {/* <div id="timer">timer</div> */}
              <div id="chessboard">
                <MultiPlayerGame roomId={roomId} username={username} />
              </div>
            </div>
          </div>

          <div className="rightContainer">
            <div className="component">
              <div id="chatWindow">
                {/* map over state arr to show messages on page */}
                {messages.map((msg) => (
                  <p>{msg}</p>
                ))}
              </div>
              <div id="chatBox">
                {/* form to send message */}
                <form onSubmit={sendMsg}>
                  <input
                    type="textarea"
                    id="chatInput"
                    placeholder="chat with your opponent"
                    onChange={handleChatInput}
                    value={msgInputted}
                  ></input>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Room;
