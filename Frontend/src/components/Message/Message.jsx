import React from "react";

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

function AvatarFallback({ children }) {
  return (
    <div className="flex items-center justify-center w-full h-full bg-gray-300 text-sm text-white">
      {children}
    </div>
  );
}

function Input({ placeholder, className }) {
  return (
    <input
      placeholder={placeholder}
      className={`border px-4 py-2 text-sm ${className}`}
    />
  );
}

function Button({ children, variant = "default", size = "default" }) {
  return (
    <button
      className={`${
        variant === "ghost" ? "bg-transparent" : "bg-blue-500 text-white"
      } ${
        size === "icon"
          ? "w-8 h-8 flex items-center justify-center"
          : "px-4 py-2"
      } rounded-full`}
    >
      {children}
    </button>
  );
}

const messages = [
  { from: "you", text: "Story unavailable" },
  { from: "you", text: "Dậy đi" },
  { from: "you", text: "Dậy đi" },
  { from: "you", text: "Dậy đi" },
  { from: "you", text: "Dậy đi" },
  { from: "you", text: "Dậy đi" },
  {
    from: "them",
    image:
      "https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg",
    text: "Làm tí"
  }
];

export default function MessengerMock({ idChat, handleClose }) {
  return (
    <Card className="w-[290px] h-[430px] scrollbar  flex flex-col justify-between shadow-lg overflow-hidden border border-gray-300">
      {/* Header */}
      <div className="bg-white p-2 border-b flex items-center gap-2 justify-between">
        <div className=" flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg" />
            <AvatarFallback>PT</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">Phạm Hồng Thái</p>
            <p className="text-xs text-green-600">Đang hoạt động</p>
            <p className="text-xs text-green-600">{idChat}</p>
          </div>
        </div>
        <div
          className="font-bold px-5 cursor-pointer"
          onClick={() => handleClose(idChat)}
        >
          x
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 p-3 bg-gray-100 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.from === "you" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] p-2 rounded-lg text-sm ${
                msg.from === "you"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-black"
              }`}
            >
              {msg.image && (
                <img src={msg.image} alt="sent" className="rounded-lg mb-1" />
              )}
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t p-2 bg-white flex items-center gap-2">
        <Input placeholder="Aa" className="flex-1 rounded-full" />
        <Button variant="default">Gửi</Button>
      </div>
    </Card>
  );
}
