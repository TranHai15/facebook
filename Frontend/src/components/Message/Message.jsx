import React, { useContext, useEffect, useRef } from "react";
import AuthContext from "../../contexts/Auth/AuthContext";

function Card({ children, className }) {
  return (
    <div className={`rounded-xl border bg-white ${className}`}>{children}</div>
  );
}

function Avatar({ children, className }) {
  return (
    <div className={`rounded-full overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

function AvatarImage({ src }) {
  return <img src={src} alt="avatar" className="w-full h-full object-cover" />;
}

export default function MessengerMock({
  idChat,
  handleClose,
  dataUser,
  handleChat,
  messages,
  handleSubmit,
  value,
  inputRefs,
  socket
}) {
  const { user } = useContext(AuthContext);
  const userId = user?.id;
  const chatBoxRef = useRef(null);
  if (socket) {
    socket.emit("readMessage", {
      idChat,
      userId
    });
  }
  // Auto scroll to bottom on new message
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus textarea when open
  useEffect(() => {
    inputRefs.current[idChat]?.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (document.activeElement === inputRefs.current[idChat]) {
        handleSubmit(idChat);
      }
    }
  };

  return (
    <Card className="w-[290px] h-[430px] scrollbar flex flex-col justify-between shadow-lg overflow-hidden border border-gray-300">
      {/* Header */}
      <div className="bg-white p-2 border-b flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage
              src={
                dataUser?.avatar ??
                "https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg"
              }
            />
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{dataUser?.username}</p>
          </div>
        </div>
        <div
          className="font-bold px-5 cursor-pointer"
          onClick={() => handleClose(idChat)}
        >
          x
        </div>
      </div>

      {/* Messages */}
      <div
        ref={chatBoxRef}
        className="flex-1 p-3 bg-gray-100 overflow-y-auto space-y-4"
      >
        {messages.map((msg, index) => {
          const isYou = msg.sender_id === userId;
          return (
            <div
              key={index}
              className={`flex ${isYou ? "justify-end" : "justify-start"} mb-2`}
            >
              <div className="max-w-[70%]">
                {!isYou && (
                  <div className="flex items-center gap-2 mb-1">
                    <img
                      src={msg.sender_avatar}
                      alt="avatar"
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-xs font-medium">
                      {msg.sender_username}
                    </span>
                  </div>
                )}
                <div
                  className={`p-2 rounded-lg text-sm ${
                    isYou ? "bg-purple-600 text-white" : "bg-white text-black"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="border-t p-2 bg-white flex items-center gap-2">
        <textarea
          ref={(el) => (inputRefs.current[idChat] = el)}
          rows={1}
          className="resize-none border px-4 py-2 text-sm flex-1 rounded-lg"
          value={value}
          onChange={(e) => handleChat(e, idChat)}
          onKeyDown={handleKeyDown}
        />

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-full"
          onClick={() => handleSubmit(idChat)}
        >
          Gửi
        </button>
      </div>
    </Card>
  );
}
